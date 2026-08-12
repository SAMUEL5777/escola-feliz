import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { alunos, turmas } from "@/lib/school-data";
import { UserPlus } from "lucide-react";

export const Route = createFileRoute("/alunos")({
  head: () => ({
    meta: [
      { title: "Alunos · Colégio Aurora — Gestão Escolar" },
      {
        name: "description",
        content:
          "Lista de alunos matriculados com turma, responsável, frequência, média e situação escolar.",
      },
      { property: "og:title", content: "Alunos · Colégio Aurora" },
      {
        property: "og:description",
        content: "Consulte matrícula, frequência e desempenho de cada aluno.",
      },
    ],
  }),
  component: Alunos,
});

function Alunos() {
  const [busca, setBusca] = useState("");
  const [turma, setTurma] = useState("Todas");

  const lista = alunos.filter(
    (a) =>
      a.nome.toLowerCase().includes(busca.toLowerCase()) &&
      (turma === "Todas" || a.turma === turma),
  );

  return (
    <AppShell title="Alunos" subtitle={`${alunos.length} alunos exibidos de 109 matriculados`}>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome"
          className="w-full sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-1">
          {["Todas", ...turmas.map((t) => t.nome)].map((t) => (
            <Button
              key={t}
              size="sm"
              variant={turma === t ? "default" : "outline"}
              onClick={() => setTurma(t)}
            >
              {t}
            </Button>
          ))}
        </div>
        <Button className="ml-auto" size="sm">
          <UserPlus className="size-4" /> Nova matrícula
        </Button>
      </div>

      <Card className="shadow-soft">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matrícula</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Turma</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead className="text-right">Frequência</TableHead>
                <TableHead className="text-right">Média</TableHead>
                <TableHead>Situação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lista.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{a.id}</TableCell>
                  <TableCell className="font-medium">{a.nome}</TableCell>
                  <TableCell>{a.turma}</TableCell>
                  <TableCell className="text-muted-foreground">{a.responsavel}</TableCell>
                  <TableCell className="text-right">{a.frequencia}%</TableCell>
                  <TableCell className="text-right">{a.media.toFixed(1)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        a.situacao === "Aprovado"
                          ? "outline"
                          : a.situacao === "Recuperação"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {a.situacao}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {lista.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                    Nenhum aluno encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppShell>
  );
}
