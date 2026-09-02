import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSchool } from "@/lib/school-store";
import { useAuth, type Perfil } from "@/lib/auth-store";
import { alunosVisiveis } from "@/lib/escopo";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { alunos: todosAlunos, professores, turmas } = useSchool();
  const { usuario } = useAuth();
  const alunos = alunosVisiveis(todosAlunos, usuario);
  const perfil: Perfil = usuario?.perfil ?? "secretaria";
  const paginas = [
    { to: "/", label: "Painel", perfis: ["secretaria", "professor", "responsavel", "aluno"] },
    { to: "/alunos", label: "Alunos", perfis: ["secretaria", "professor"] },
    { to: "/professores", label: "Professores", perfis: ["secretaria"] },
    { to: "/turmas", label: "Turmas", perfis: ["secretaria", "professor"] },
    { to: "/notas", label: "Notas & Frequência", perfis: ["secretaria", "professor"] },
    { to: "/chamada", label: "Chamada diária", perfis: ["secretaria", "professor"] },
    {
      to: "/boletim",
      label: "Boletim & Histórico",
      perfis: ["secretaria", "professor", "responsavel", "aluno"],
    },
    { to: "/financeiro", label: "Financeiro", perfis: ["secretaria", "responsavel", "aluno"] },
    {
      to: "/mensagens",
      label: "Mensagens",
      perfis: ["secretaria", "professor", "responsavel", "aluno"],
    },
    {
      to: "/perfil",
      label: "Meu perfil",
      perfis: ["secretaria", "professor", "responsavel", "aluno"],
    },
  ].filter((p) => (p.perfis as string[]).includes(perfil));
  const podeVerEquipe = perfil === "secretaria" || perfil === "professor";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const go = (to: string) => {
    setOpen(false);
    navigate({ to });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted lg:w-64"
      >
        <Search className="size-4" />
        <span className="hidden lg:inline">Buscar aluno, turma...</span>
        <kbd className="ml-auto hidden rounded border border-border px-1.5 text-[10px] lg:inline">
          ⌘K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Buscar alunos, professores, turmas ou páginas..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          <CommandGroup heading="Páginas">
            {paginas.map((p) => (
              <CommandItem key={p.to} value={p.label} onSelect={() => go(p.to)}>
                {p.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Alunos">
            {alunos.map((a) => (
              <CommandItem
                key={a.id}
                value={`${a.nome} ${a.turma}`}
                onSelect={() => go(podeVerEquipe ? "/alunos" : "/boletim")}
              >
                {a.nome}
                <span className="ml-auto text-xs text-muted-foreground">{a.turma}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          {podeVerEquipe && (
            <CommandGroup heading="Professores">
              {professores.map((p) => (
                <CommandItem
                  key={p.id}
                  value={`${p.nome} ${p.disciplina}`}
                  onSelect={() => go("/professores")}
                >
                  {p.nome}
                  <span className="ml-auto text-xs text-muted-foreground">{p.disciplina}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {podeVerEquipe && (
            <CommandGroup heading="Turmas">
              {turmas.map((t) => (
                <CommandItem key={t.id} value={`turma ${t.nome}`} onSelect={() => go("/turmas")}>
                  {t.nome}
                  <span className="ml-auto text-xs text-muted-foreground">{t.turno}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
