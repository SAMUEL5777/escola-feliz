import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth, rotulosPerfil } from "@/lib/auth-store";
import { useSchool } from "@/lib/school-store";
import { alunosVisiveis } from "@/lib/escopo";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Meu perfil · Colégio Aurora" },
      {
        name: "description",
        content:
          "Dados da conta no Colégio Aurora: nome, e-mail, tipo de acesso e vínculo escolar.",
      },
      { property: "og:title", content: "Meu perfil · Colégio Aurora" },
      { property: "og:description", content: "Dados da sua conta e vínculo escolar." },
    ],
  }),
  component: PerfilPage,
});

function PerfilPage() {
  const { usuario, sair } = useAuth();
  const { alunos, mensalidades } = useSchool();
  const navigate = useNavigate();

  const meus = alunosVisiveis(alunos, usuario ?? null);
  const meuAluno = usuario?.perfil === "aluno" || usuario?.perfil === "responsavel" ? meus[0] : undefined;
  const emAberto = meuAluno
    ? mensalidades.filter((m) => m.alunoId === meuAluno.id && m.status !== "Paga").length
    : 0;

  return (
    <AppShell title="Meu perfil" subtitle="Dados da conta e vínculo escolar">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>{usuario?.nome}</CardTitle>
            <CardDescription>{usuario?.email}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tipo de acesso</span>
              <Badge variant="secondary">{usuario ? rotulosPerfil[usuario.perfil] : "—"}</Badge>
            </div>
            {usuario?.vinculo && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {usuario.perfil === "aluno"
                    ? "Turma"
                    : usuario.perfil === "professor"
                      ? "Disciplina"
                      : "Aluno vinculado"}
                </span>
                <span className="font-medium">{usuario.vinculo}</span>
              </div>
            )}
            <Button
              variant="outline"
              className="mt-2 justify-self-start"
              onClick={() => {
                sair();
                toast.success("Sessão encerrada.");
                navigate({ to: "/login", replace: true });
              }}
            >
              <LogOut className="size-4" /> Sair da conta
            </Button>
          </CardContent>
        </Card>

        {meuAluno && (
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Resumo escolar</CardTitle>
              <CardDescription>{meuAluno.nome} · {meuAluno.turma}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Média atual</span>
                <span className="font-medium">{meuAluno.media.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frequência</span>
                <span className="font-medium">{meuAluno.frequencia}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Situação</span>
                <span className="font-medium">{meuAluno.situacao}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mensalidades em aberto</span>
                <span className="font-medium">{emAberto}</span>
              </div>
              <div className="mt-2 flex gap-2">
                <Button size="sm" onClick={() => navigate({ to: "/boletim" })}>
                  Ver boletim
                </Button>
                <Button size="sm" variant="outline" onClick={() => navigate({ to: "/mensagens" })}>
                  Mensagens
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
