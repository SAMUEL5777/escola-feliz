import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  GraduationCap,
  Users,
  BookOpen,
  TrendingUp,
  UserPlus,
  CalendarPlus,
  ClipboardList,
  Trash2,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { frequenciaMensal, disciplinas } from "@/lib/school-data";
import { useSchool } from "@/lib/school-store";
import { useAuth } from "@/lib/auth-store";
import { alunosVisiveis } from "@/lib/escopo";

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

function Painel() {
  const { alunos, professores, turmas, agenda, notas, mensalidades, addEvento, removeEvento } =
    useSchool();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const gestao = usuario?.perfil === "secretaria" || usuario?.perfil === "professor";
  const [aberto, setAberto] = useState(false);
  const [evento, setEvento] = useState({ data: "", titulo: "", tipo: "Evento" });

  const emRisco = alunos.filter((a) => a.situacao !== "Aprovado");
  const meuAluno = alunosVisiveis(alunos, usuario)[0];
  const statsPessoais = meuAluno
    ? ([
        {
          label: "Média atual",
          value: meuAluno.media.toFixed(1).replace(".", ","),
          hint: meuAluno.situacao,
          icon: TrendingUp,
          to: "/boletim",
        },
        {
          label: "Frequência",
          value: `${meuAluno.frequencia}%`,
          hint: "no bimestre",
          icon: ClipboardList,
          to: "/boletim",
        },
        {
          label: "Turma",
          value: meuAluno.turma,
          hint: "ano letivo 2026",
          icon: BookOpen,
          to: "/boletim",
        },
        {
          label: "Mensalidades em aberto",
          value: String(
            mensalidades.filter((m) => m.alunoId === meuAluno.id && m.status !== "Paga").length,
          ),
          hint: "ver financeiro",
          icon: Users,
          to: "/financeiro",
        },
      ] as const)
    : [];
  const mediaGeral =
    alunos.length > 0
      ? (alunos.reduce((s, a) => s + a.media, 0) / alunos.length).toFixed(1).replace(".", ",")
      : "0,0";

  const stats = [
    {
      label: "Alunos matriculados",
      value: String(alunos.length),
      hint: "clique para ver a lista",
      icon: GraduationCap,
      to: "/alunos",
    },
    {
      label: "Professores ativos",
      value: String(professores.length),
      hint: `${disciplinas.length} disciplinas`,
      icon: Users,
      to: "/professores",
    },
    {
      label: "Turmas abertas",
      value: String(turmas.length),
      hint: "2 turnos",
      icon: BookOpen,
      to: "/turmas",
    },
    {
      label: "Média geral",
      value: mediaGeral,
      hint: "recalculada em tempo real",
      icon: TrendingUp,
      to: "/notas",
    },
  ] as const;

  const desempenho = disciplinas.map((d, i) => {
    const base = notas.flatMap((n) => n.bimestres[i % 4] ?? 0);
    const media = base.length ? base.reduce((s, v) => s + v, 0) / base.length : 0;
    return { disciplina: d.slice(0, 4), media: Number(media.toFixed(1)) };
  });

  const salvarEvento = () => {
    if (!evento.data.trim() || !evento.titulo.trim()) {
      toast.error("Informe data e título do compromisso.");
      return;
    }
    addEvento(evento);
    toast.success("Compromisso adicionado à agenda.");
    setEvento({ data: "", titulo: "", tipo: "Evento" });
    setAberto(false);
  };

  return (
    <AppShell
      title="Painel geral"
      subtitle="Visão consolidada do 2º bimestre de 2026"
      actions={
        gestao ? (
          <>
            {usuario?.perfil === "secretaria" && (
              <Button size="sm" onClick={() => navigate({ to: "/alunos" })}>
                <UserPlus className="size-4" /> Matricular aluno
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => navigate({ to: "/notas" })}>
              <ClipboardList className="size-4" /> Lançar notas
            </Button>
            <Button size="sm" variant="outline" onClick={() => setAberto(true)}>
              <CalendarPlus className="size-4" /> Novo compromisso
            </Button>
          </>
        ) : (
          <>
            <Button size="sm" onClick={() => navigate({ to: "/boletim" })}>
              Meu boletim
            </Button>
            <Button size="sm" variant="outline" onClick={() => navigate({ to: "/financeiro" })}>
              Mensalidades
            </Button>
            <Button size="sm" variant="outline" onClick={() => navigate({ to: "/mensagens" })}>
              Mensagens
            </Button>
          </>
        )
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {(gestao ? stats : statsPessoais).map(({ label, value, hint, icon: Icon, to }) => (
          <button key={label} className="text-left" onClick={() => navigate({ to })}>
            <Card className="shadow-soft transition-shadow hover:shadow-md">
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
          </button>
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
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle>Agenda pedagógica</CardTitle>
              <CardDescription>Próximos compromissos</CardDescription>
            </div>
            <Dialog open={aberto} onOpenChange={setAberto}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <CalendarPlus className="size-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo compromisso</DialogTitle>
                  <DialogDescription>Adicione um item à agenda pedagógica.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edata">Data</Label>
                    <Input
                      id="edata"
                      placeholder="25 Ago"
                      value={evento.data}
                      onChange={(e) => setEvento({ ...evento, data: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="etit">Título</Label>
                    <Input
                      id="etit"
                      value={evento.titulo}
                      onChange={(e) => setEvento({ ...evento, titulo: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="etipo">Tipo</Label>
                    <Input
                      id="etipo"
                      value={evento.tipo}
                      onChange={(e) => setEvento({ ...evento, tipo: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAberto(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={salvarEvento}>Adicionar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-4">
            {agenda.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-14 shrink-0 rounded-lg bg-secondary px-2 py-1.5 text-center text-xs font-medium text-secondary-foreground">
                  {item.data}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.titulo}</p>
                  <p className="text-xs text-muted-foreground">{item.tipo}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Remover ${item.titulo}`}
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => removeEvento(item.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            {agenda.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum compromisso agendado.</p>
            )}
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
              <BarChart data={desempenho}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="disciplina" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis domain={[0, 10]} stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip />
                <Bar dataKey="media" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {gestao && (
          <Card className="shadow-soft">
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle>Alunos em atenção</CardTitle>
                <CardDescription>Baixa frequência ou média abaixo de 7,0</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={() => navigate({ to: "/notas" })}>
                Ver notas
              </Button>
            </CardHeader>
            <CardContent className="space-y-5">
              {emRisco.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhum aluno em situação de risco.</p>
              )}
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
        )}
      </div>
    </AppShell>
  );
}
