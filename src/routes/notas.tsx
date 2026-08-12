import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Minus, Plus, Save } from "lucide-react";
import { useSchool } from "@/lib/school-store";

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
  const { alunos, notas, turmas, setNota, setFrequencia } = useSchool();
  const [turma, setTurma] = useState("Todas");

  const visiveis = alunos.filter((a) => turma === "Todas" || a.turma === turma);

  return (
    <AppShell title="Notas & Frequência" subtitle="Lançamentos do 2º bimestre">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Select value={turma} onValueChange={setTurma}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Turma" />
          </SelectTrigger>
          <SelectContent>
            {["Todas", ...turmas.map((t) => t.nome)].map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          size="sm"
          className="ml-auto"
          onClick={() => toast.success("Lançamentos salvos no diário de classe.")}
        >
          <Save className="size-4" /> Salvar lançamentos
        </Button>
      </div>

      <Tabs defaultValue="notas">
        <TabsList>
          <TabsTrigger value="notas">Notas</TabsTrigger>
          <TabsTrigger value="frequencia">Frequência</TabsTrigger>
        </TabsList>

        <TabsContent value="notas" className="mt-4">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Boletim por bimestre</CardTitle>
              <CardDescription>
                Clique em uma nota para editar — a média e a situação são recalculadas
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
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
                  {visiveis.map((a) => {
                    const registro = notas.find((n) => n.alunoId === a.id);
                    const bimestres = registro?.bimestres ?? [0, 0, 0, 0];
                    const media = bimestres.reduce((s, v) => s + v, 0) / bimestres.length;
                    return (
                      <TableRow key={a.id}>
                        <TableCell className="font-medium">{a.nome}</TableCell>
                        <TableCell>{a.turma}</TableCell>
                        {bimestres.map((b, i) => (
                          <TableCell key={i} className="text-right">
                            <Input
                              type="number"
                              min={0}
                              max={10}
                              step="0.1"
                              value={b}
                              onChange={(e) => setNota(a.id, i, Number(e.target.value))}
                              className="ml-auto h-8 w-20 text-right tabular-nums"
                            />
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
                  {visiveis.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                        Nenhum aluno nesta turma.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="frequencia" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {visiveis.map((a) => (
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
                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={`Registrar falta de ${a.nome}`}
                      onClick={() => setFrequencia(a.id, a.frequencia - 2)}
                    >
                      <Minus className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={`Registrar presença de ${a.nome}`}
                      onClick={() => setFrequencia(a.id, a.frequencia + 2)}
                    >
                      <Plus className="size-4" />
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      {a.frequencia >= 75
                        ? "Frequência regular"
                        : "Abaixo do mínimo legal de 75%"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
