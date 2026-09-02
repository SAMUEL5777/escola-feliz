import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Perfil = "secretaria" | "professor" | "responsavel" | "aluno";

export type Usuario = {
  nome: string;
  email: string;
  perfil: Perfil;
  /** Responsável: nome do aluno. Professor: disciplina. Aluno: turma. */
  vinculo?: string;
};

export const contasDemo: Array<Usuario & { senha: string }> = [
  {
    nome: "Maria Silva",
    email: "secretaria@escola.edu.br",
    senha: "123456",
    perfil: "secretaria",
  },
  {
    nome: "Helena Vasconcelos",
    email: "helena@escola.edu.br",
    senha: "123456",
    perfil: "professor",
    vinculo: "Matemática",
  },
  {
    nome: "Marcos Ferreira",
    email: "responsavel@escola.edu.br",
    senha: "123456",
    perfil: "responsavel",
    vinculo: "Ana Beatriz Ferreira",
  },
  {
    nome: "Ana Beatriz Ferreira",
    email: "aluno@escola.edu.br",
    senha: "123456",
    perfil: "aluno",
    vinculo: "9º A",
  },
];

export const rotulosPerfil: Record<Perfil, string> = {
  secretaria: "Secretaria acadêmica",
  professor: "Professor(a)",
  responsavel: "Responsável",
  aluno: "Aluno(a)",
};

const STORAGE_KEY = "colegio-aurora-auth-v1";

type Ctx = {
  usuario: Usuario | null;
  carregando: boolean;
  entrar: (email: string, senha: string) => { ok: boolean; erro?: string };
  sair: () => void;
};

const AuthContext = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUsuario(JSON.parse(raw) as Usuario);
    } catch {
      /* ignore */
    }
    setCarregando(false);
  }, []);

  const entrar = useCallback((email: string, senha: string) => {
    const conta = contasDemo.find(
      (c) => c.email.toLowerCase() === email.trim().toLowerCase() && c.senha === senha,
    );
    if (!conta) return { ok: false, erro: "E-mail ou senha inválidos." };
    const { senha: _s, ...dados } = conta;
    setUsuario(dados);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
    } catch {
      /* ignore */
    }
    return { ok: true };
  }, []);

  const sair = useCallback(() => {
    setUsuario(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<Ctx>(
    () => ({ usuario, carregando, entrar, sair }),
    [usuario, carregando, entrar, sair],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
