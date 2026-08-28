import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CalendarCheck, Check, X, Save } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSchool } from "@/lib/school-store";
import { useAuth } from "@/lib/auth-store";

export const Route = createFileRoute("/chamada")({
  head: () => ({
    meta: [
      { title: "Chamada diária · Colégio Aurora" },
      {
        name: "description",
        content:
          "Registre a chamada por aula: selecione turma, disciplina e data e marque presenças e faltas.",
      },
      { property: "og:title", content: "Chamada diária · Colégio Aurora" },
      {
        property: "og:description",
        content: "Presenças e faltas por aula, com atualização automática da frequência.",
      },
    ],
  }),
  component: ChamadaPage,
});

function hoje() {
  return new Date().toISOString().slice(0, 10);
}

function ChamadaPage() {
  const { aulas, alunos, chamadas, registrarChamada, setFrequencia } = useSchool();
  const { usuario } = useAuth();

  const aulasVisiveis = useMemo(
    () =>
      usuario?.perfil === "professor"
        ? aulas.filter((a) => a.professor === usuario.nome)
        : aulas,
    [aulas, usuario],
  );

  const [aulaId, setAulaId] = useState(aulasVisiveis[0]?.id ?? "");
  const [data, setData] = useState(hoje());
  const [presencas, setPresencas] = useState<Record<string, boolean>>({});

  const aula = aulasVisiveis.find((a) => a.id === aulaId) ?? aulasVisiveis[0];
  const turmaAlunos = alunos.filter((a) => a.turma === aula?.turma);

  const registroExistente = chamadas.find((c) => c.aulaId === aulaId && c.data === data);
  const estado = (id: string) =>
    presencas[id] ?? registroExistente?.presencas[id] ?? true;

  const salvar = () => {
    if (!aula) return;
    const mapa: Record<string, boolean> = {};
    turmaAlunos.forEach((a) => (mapa[a.id] = estado(a.id)));
    registrarChamada({
      data,
      aulaId: aula.id,
      turma: aula.turma,
      disciplina: aula.disciplina,
      presencas: mapa,
    });
    // Ajusta a frequência acumulada de cada aluno com base na chamada.
    turmaAlunos.forEach((a) => {
      const delta = mapa[a.id] ? 1 : -3;
      setFrequencia(a.id, a.frequencia + delta);
    });
    setPresencas({});
    toast.success(`Chamada de ${aula.disciplina} registrada.`);
  };

  const presentes = turmaAlunos.filter((a) => estado(a.id)).length;

  return (
    <AppShell
      title="Chamada diária"
      subtitle="Registro de presença aula por aula"
      actions={
        <Button size="sm" onClick={salvar} disabled={!aula || turmaAlunos.length === 0}>
          <Save className="size-4" /> Salvar chamada
        </Button>
      }
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Aula</CardTitle>
            <CardDescription>Selecione a aula e a data</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label>Aula</Label>
              <Select value={aulaId} onValueChange={setAulaId}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha a aula" />
                </SelectTrigger>
                <SelectContent>
                  {aulasVisiveis.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.diaSemana} {a.horario} · {a.turma} · {a.disciplina}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="data">Data</Label>
              <Input id="data" type="date" value={data} onChange={(e) => setData(e.target.value)} />
            </div>
            <div className="rounded-lg bg-secondary p-3 text-sm text-secondary-foreground">
              <p className="font-medium">
                {presentes}/{turmaAlunos.length} presentes
              </p>
              <p className="text-xs opacity-80">
                {registroExistente ? "Chamada já registrada nesta data." : "Ainda não registrada."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {aula ? `${aula.turma} · ${aula.disciplina}` : "Nenhuma aula disponível"}
            </CardTitle>
            <CardDescription>
              {aula ? `Professor(a) ${aula.professor}` : "Selecione outra aula"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {turmaAlunos.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum aluno nesta turma.</p>
            )}
            {turmaAlunos.map((a) => {
              const presente = estado(a.id);
              return (
                <div
                  key={a.id}
                  className="flex flex-wrap items-center gap-3 rounded-lg border border-border px-3 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{a.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      Matrícula {a.id} · frequência {a.frequencia}%
                    </p>
                  </div>
                  <Badge variant={presente ? "secondary" : "destructive"}>
                    {presente ? "Presente" : "Falta"}
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant={presente ? "default" : "outline"}
                      onClick={() => setPresencas((p) => ({ ...p, [a.id]: true }))}
                    >
                      <Check className="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={presente ? "outline" : "destructive"}
                      onClick={() => setPresencas((p) => ({ ...p, [a.id]: false }))}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarCheck className="size-4" /> Chamadas registradas
          </CardTitle>
          <CardDescription>Histórico recente de lançamentos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {chamadas.length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhuma chamada registrada ainda.</p>
          )}
          {chamadas.slice(0, 12).map((c) => {
            const faltas = Object.values(c.presencas).filter((p) => !p).length;
            return (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
              >
                <span>
                  {c.data} · {c.turma} · {c.disciplina}
                </span>
                <Badge variant={faltas > 0 ? "destructive" : "secondary"}>
                  {faltas} falta(s)
                </Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </AppShell>
  );
}
