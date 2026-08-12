import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notas, alunos } from "@/lib/school-data";

export const Route = createFileRoute("/notas")({
  head: () => ({
    meta: [
      { title: "Notas e Frequência · Colégio Aurora — Gestão Escolar" },
      {
        name: "description",
        content:
          "Lançamento de notas por bimestre e acompanhamento da frequência dos alunos por turma.",
      },
      { property: "og:title", content: "Notas e Frequência · Colégio Aurora" },
      {
        property: "og:description",
        content: "Notas bimestrais e presença consolidada por aluno.",
      },
    ],
  }),
  component: Notas,
});

function Notas() {
  return (
    <AppShell title="Notas & Frequência" subtitle="Lançamentos do 2º bimestre">
      <Tabs defaultValue="notas">
        <TabsList>
          <TabsTrigger value="notas">Notas</TabsTrigger>
          <TabsTrigger value="frequencia">Frequência</TabsTrigger>
        </TabsList>

        <TabsContent value="notas" className="mt-4">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Boletim por bimestre</CardTitle>
              <CardDescription>Média geral considera os quatro bimestres</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Turma</TableHead>
                    <TableHead className="text-right">1º</TableHead>
                    <TableHead className="text-right">2º</TableHead>
                    <TableHead className="text-right">3º</TableHead>
                    <TableHead className="text-right">4º</TableHead>
                    <TableHead className="text-right">Média</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notas.map((n) => {
                    const media = n.bimestres.reduce((s, v) => s + v, 0) / 4;
                    return (
                      <TableRow key={n.aluno}>
                        <TableCell className="font-medium">{n.aluno}</TableCell>
                        <TableCell>{n.turma}</TableCell>
                        {n.bimestres.map((b, i) => (
                          <TableCell key={i} className="text-right tabular-nums">
                            {b.toFixed(1)}
                          </TableCell>
                        ))}
                        <TableCell className="text-right">
                          <Badge variant={media >= 7 ? "outline" : "destructive"}>
                            {media.toFixed(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="frequencia" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {alunos.map((a) => (
              <Card key={a.id} className="shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-medium">{a.nome}</p>
                    <span className="text-sm text-muted-foreground">{a.turma}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <Progress value={a.frequencia} className="h-2" />
                    <span className="w-12 shrink-0 text-right text-sm tabular-nums">
                      {a.frequencia}%
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {a.frequencia >= 75
                      ? "Frequência regular"
                      : "Abaixo do mínimo legal de 75%"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
