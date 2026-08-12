import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  alunos as alunosSeed,
  professores as professoresSeed,
  turmas as turmasSeed,
  agenda as agendaSeed,
  notas as notasSeed,
  type Aluno,
  type Professor,
  type Turma,
} from "@/lib/school-data";

export type Evento = { id: string; data: string; titulo: string; tipo: string };
export type Notificacao = { id: string; texto: string; lida: boolean; quando: string };
export type NotasAluno = { alunoId: string; bimestres: number[] };

type State = {
  alunos: Aluno[];
  professores: Professor[];
  turmas: Turma[];
  agenda: Evento[];
  notas: NotasAluno[];
  notificacoes: Notificacao[];
};

const STORAGE_KEY = "colegio-aurora-state-v1";

function situacaoDe(media: number, frequencia: number): Aluno["situacao"] {
  if (frequencia < 75 || media < 5) return "Reprovado";
  if (media < 7) return "Recuperação";
  return "Aprovado";
}

function initialState(): State {
  return {
    alunos: alunosSeed,
    professores: professoresSeed,
    turmas: turmasSeed,
    agenda: agendaSeed.map((a, i) => ({ id: `E${i}`, ...a })),
    notas: notasSeed.map((n, i) => ({
      alunoId: alunosSeed[i].id,
      bimestres: n.bimestres,
    })),
    notificacoes: [
      { id: "N1", texto: "Diego Martins Rocha está com frequência abaixo de 75%.", lida: false, quando: "há 2 h" },
      { id: "N2", texto: "Prova bimestral de Matemática marcada para 15/Ago.", lida: false, quando: "ontem" },
      { id: "N3", texto: "Boletins do 1º bimestre disponíveis para download.", lida: true, quando: "3 dias" },
    ],
  };
}

type Ctx = State & {
  addAluno: (a: Omit<Aluno, "id" | "situacao">) => void;
  updateAluno: (id: string, patch: Partial<Aluno>) => void;
  removeAluno: (id: string) => void;
  addProfessor: (p: Omit<Professor, "id">) => void;
  removeProfessor: (id: string) => void;
  addTurma: (t: Omit<Turma, "id">) => void;
  removeTurma: (id: string) => void;
  setNota: (alunoId: string, bimestre: number, valor: number) => void;
  setFrequencia: (alunoId: string, valor: number) => void;
  addEvento: (e: Omit<Evento, "id">) => void;
  removeEvento: (id: string) => void;
  marcarTodasLidas: () => void;
  reset: () => void;
};

const SchoolContext = createContext<Ctx | null>(null);

export function SchoolProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initialState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState(), ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const notificar = useCallback((texto: string) => {
    setState((s) => ({
      ...s,
      notificacoes: [
        { id: crypto.randomUUID(), texto, lida: false, quando: "agora" },
        ...s.notificacoes,
      ].slice(0, 20),
    }));
  }, []);

  const value = useMemo<Ctx>(() => {
    const mediaDe = (b: number[]) => b.reduce((s, v) => s + v, 0) / b.length;

    return {
      ...state,
      addAluno: (a) => {
        const id = String(2024000 + Math.floor(Math.random() * 9000) + 100);
        setState((s) => ({
          ...s,
          alunos: [
            ...s.alunos,
            { ...a, id, situacao: situacaoDe(a.media, a.frequencia) },
          ],
          notas: [...s.notas, { alunoId: id, bimestres: [a.media, a.media, a.media, a.media] }],
        }));
        notificar(`Nova matrícula: ${a.nome} (${a.turma}).`);
      },
      updateAluno: (id, patch) =>
        setState((s) => ({
          ...s,
          alunos: s.alunos.map((a) => {
            if (a.id !== id) return a;
            const next = { ...a, ...patch };
            return { ...next, situacao: situacaoDe(next.media, next.frequencia) };
          }),
        })),
      removeAluno: (id) =>
        setState((s) => ({
          ...s,
          alunos: s.alunos.filter((a) => a.id !== id),
          notas: s.notas.filter((n) => n.alunoId !== id),
        })),
      addProfessor: (p) =>
        setState((s) => ({
          ...s,
          professores: [...s.professores, { ...p, id: `P${s.professores.length + 1}` }],
        })),
      removeProfessor: (id) =>
        setState((s) => ({ ...s, professores: s.professores.filter((p) => p.id !== id) })),
      addTurma: (t) =>
        setState((s) => ({ ...s, turmas: [...s.turmas, { ...t, id: `T${s.turmas.length + 1}` }] })),
      removeTurma: (id) =>
        setState((s) => ({ ...s, turmas: s.turmas.filter((t) => t.id !== id) })),
      setNota: (alunoId, bimestre, valor) =>
        setState((s) => {
          const notas = s.notas.map((n) =>
            n.alunoId === alunoId
              ? {
                  ...n,
                  bimestres: n.bimestres.map((b, i) =>
                    i === bimestre ? Math.max(0, Math.min(10, valor)) : b,
                  ),
                }
              : n,
          );
          const alvo = notas.find((n) => n.alunoId === alunoId);
          const media = alvo ? Number(mediaDe(alvo.bimestres).toFixed(1)) : 0;
          return {
            ...s,
            notas,
            alunos: s.alunos.map((a) =>
              a.id === alunoId
                ? { ...a, media, situacao: situacaoDe(media, a.frequencia) }
                : a,
            ),
          };
        }),
      setFrequencia: (alunoId, valor) =>
        setState((s) => ({
          ...s,
          alunos: s.alunos.map((a) => {
            if (a.id !== alunoId) return a;
            const frequencia = Math.max(0, Math.min(100, Math.round(valor)));
            return { ...a, frequencia, situacao: situacaoDe(a.media, frequencia) };
          }),
        })),
      addEvento: (e) =>
        setState((s) => ({ ...s, agenda: [...s.agenda, { ...e, id: crypto.randomUUID() }] })),
      removeEvento: (id) =>
        setState((s) => ({ ...s, agenda: s.agenda.filter((e) => e.id !== id) })),
      marcarTodasLidas: () =>
        setState((s) => ({
          ...s,
          notificacoes: s.notificacoes.map((n) => ({ ...n, lida: true })),
        })),
      reset: () => setState(initialState()),
    };
  }, [state, notificar]);

  return <SchoolContext.Provider value={value}>{children}</SchoolContext.Provider>;
}

export function useSchool() {
  const ctx = useContext(SchoolContext);
  if (!ctx) throw new Error("useSchool deve ser usado dentro de SchoolProvider");
  return ctx;
}
