import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { GraduationCap, Users, BookOpen, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  alunos,
  professores,
  turmas,
  agenda,
  frequenciaMensal,
  desempenhoPorDisciplina,
} from "@/lib/school-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Painel · Colégio Aurora — Gestão Escolar" },
      {
        name: "description",
        content:
          "Painel de gestão escolar com indicadores de matrículas, frequência, desempenho por disciplina e agenda pedagógica.",
      },
      { property: "og:title", content: "Painel · Colégio Aurora — Gestão Escolar" },
      {
        property: "og:description",
        content: "Indicadores de matrículas, frequência e desempenho em um só lugar.",
      },
    ],
  }),
  component: Painel,
});

const stats = [
  { label: "Alunos matriculados", value: "109", hint: "+6 este mês", icon: GraduationCap },
  { label: "Professores ativos", value: String(professores.length), hint: "5 disciplinas", icon: Users },
  { label: "Turmas abertas", value: String(turmas.length), hint: "2 turnos", icon: BookOpen },
  { label: "Média geral", value: "7,8", hint: "+0,3 vs. 1º bim.", icon: TrendingUp },
];

function Painel() {
  const emRisco = alunos.filter((a) => a.situacao !== "Aprovado");

  return (
    <AppShell
      title="Painel geral"
      subtitle="Visão consolidada do 2º bimestre de 2026"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, hint, icon: Icon }) => (
          <Card key={label} className="shadow-soft">
            <CardContent className="flex items-start justify-between gap-4 pt-6">
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-1 font-display text-3xl">{value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
              </div>
              <div className="rounded-xl bg-secondary p-2.5 text-secondary-foreground">
                <Icon className="size-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="shadow-soft lg:col-span-2">
          <CardHeader>
            <CardTitle>Frequência média mensal</CardTitle>
            <CardDescription>Percentual de presença por mês letivo</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={frequenciaMensal}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="mes" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis domain={[70, 100]} stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="presenca"
                  stroke="var(--color-primary)"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Agenda pedagógica</CardTitle>
            <CardDescription>Próximos compromissos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {agenda.map((item) => (
              <div key={item.titulo} className="flex gap-3">
                <div className="w-14 shrink-0 rounded-lg bg-secondary px-2 py-1.5 text-center text-xs font-medium text-secondary-foreground">
                  {item.data}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.titulo}</p>
                  <p className="text-xs text-muted-foreground">{item.tipo}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Média por disciplina</CardTitle>
            <CardDescription>Todas as turmas · 2º bimestre</CardDescription>
          </CardHeader>
          <CardContent className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={desempenhoPorDisciplina}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="disciplina" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis domain={[0, 10]} stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip />
                <Bar dataKey="media" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Alunos em atenção</CardTitle>
            <CardDescription>Baixa frequência ou média abaixo de 7,0</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {emRisco.map((a) => (
              <div key={a.id}>
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium">{a.nome}</p>
                  <Badge variant={a.situacao === "Reprovado" ? "destructive" : "secondary"}>
                    {a.situacao}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <Progress value={a.frequencia} className="h-2" />
                  <span className="w-24 shrink-0 text-right text-xs text-muted-foreground">
                    {a.frequencia}% · média {a.media.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
