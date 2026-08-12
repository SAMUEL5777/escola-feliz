import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { turmas, disciplinas } from "@/lib/school-data";

export const Route = createFileRoute("/turmas")({
  head: () => ({
    meta: [
      { title: "Turmas · Colégio Aurora — Gestão Escolar" },
      {
        name: "description",
        content:
          "Turmas do ano letivo com turno, sala, professor regente, ocupação e grade de disciplinas.",
      },
      { property: "og:title", content: "Turmas · Colégio Aurora" },
      {
        property: "og:description",
        content: "Turno, sala, regente e ocupação de cada turma do ano letivo.",
      },
    ],
  }),
  component: Turmas,
});

function Turmas() {
  return (
    <AppShell title="Turmas" subtitle="Ano letivo 2026 · ensino fundamental II">
      <div className="grid gap-4 md:grid-cols-2">
        {turmas.map((t) => (
          <Card key={t.id} className="shadow-soft">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="font-display text-2xl">{t.nome}</CardTitle>
              <Badge variant={t.turno === "Manhã" ? "secondary" : "outline"}>{t.turno}</Badge>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Regente</dt>
                  <dd className="font-medium">{t.regente}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Sala</dt>
                  <dd className="font-medium">{t.sala}</dd>
                </div>
              </dl>

              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Ocupação</span>
                  <span className="font-medium">{t.alunos}/35 vagas</span>
                </div>
                <Progress value={(t.alunos / 35) * 100} className="mt-2 h-2" />
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {disciplinas.map((d) => (
                  <Badge key={d} variant="outline">
                    {d}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
