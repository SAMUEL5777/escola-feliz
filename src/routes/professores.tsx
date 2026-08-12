import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail } from "lucide-react";
import { professores } from "@/lib/school-data";

export const Route = createFileRoute("/professores")({
  head: () => ({
    meta: [
      { title: "Professores · Colégio Aurora — Gestão Escolar" },
      {
        name: "description",
        content:
          "Quadro de professores do Colégio Aurora com disciplinas, turmas atribuídas e contato.",
      },
      { property: "og:title", content: "Professores · Colégio Aurora" },
      {
        property: "og:description",
        content: "Disciplinas, turmas atribuídas e contato do corpo docente.",
      },
    ],
  }),
  component: Professores,
});

function iniciais(nome: string) {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("");
}

function Professores() {
  return (
    <AppShell title="Professores" subtitle="Corpo docente e atribuição de turmas">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {professores.map((p) => (
          <Card key={p.id} className="shadow-soft">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Avatar className="size-12">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {iniciais(p.nome)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-medium">{p.nome}</p>
                  <p className="text-sm text-muted-foreground">{p.disciplina}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.turmas.map((t) => (
                  <Badge key={t} variant="secondary">
                    {t}
                  </Badge>
                ))}
              </div>

              <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="size-4" />
                {p.email}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
