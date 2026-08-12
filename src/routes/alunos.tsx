import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { useSchool } from "@/lib/school-store";
import { UserPlus, Trash2, Download, ArrowUpDown } from "lucide-react";

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

type Ordem = "nome" | "media" | "frequencia";

function Alunos() {
  const { alunos, turmas, addAluno, removeAluno } = useSchool();
  const [busca, setBusca] = useState("");
  const [turma, setTurma] = useState("Todas");
  const [situacao, setSituacao] = useState("Todas");
  const [ordem, setOrdem] = useState<Ordem>("nome");
  const [asc, setAsc] = useState(true);
  const [aberto, setAberto] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    turma: turmas[0]?.nome ?? "",
    responsavel: "",
    frequencia: "100",
    media: "7",
  });

  const lista = alunos
    .filter(
      (a) =>
        (a.nome.toLowerCase().includes(busca.toLowerCase()) ||
          a.responsavel.toLowerCase().includes(busca.toLowerCase()) ||
          a.id.includes(busca)) &&
        (turma === "Todas" || a.turma === turma) &&
        (situacao === "Todas" || a.situacao === situacao),
    )
    .sort((a, b) => {
      const dir = asc ? 1 : -1;
      if (ordem === "nome") return a.nome.localeCompare(b.nome) * dir;
      return (a[ordem] - b[ordem]) * dir;
    });

  const exportar = () => {
    const linhas = [
      ["Matrícula", "Nome", "Turma", "Responsável", "Frequência", "Média", "Situação"],
      ...lista.map((a) => [a.id, a.nome, a.turma, a.responsavel, a.frequencia, a.media, a.situacao]),
    ];
    const csv = linhas.map((l) => l.join(";")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "alunos.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exportado com sucesso.");
  };

  const salvar = () => {
    if (!form.nome.trim() || !form.responsavel.trim()) {
      toast.error("Preencha nome e responsável.");
      return;
    }
    addAluno({
      nome: form.nome.trim(),
      turma: form.turma,
      responsavel: form.responsavel.trim(),
      frequencia: Number(form.frequencia) || 0,
      media: Number(form.media) || 0,
    });
    toast.success(`${form.nome} matriculado(a) em ${form.turma}.`);
    setForm({ nome: "", turma: turmas[0]?.nome ?? "", responsavel: "", frequencia: "100", media: "7" });
    setAberto(false);
  };

  return (
    <AppShell title="Alunos" subtitle={`${lista.length} de ${alunos.length} alunos exibidos`}>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome, responsável ou matrícula"
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

        <Select value={situacao} onValueChange={setSituacao}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Situação" />
          </SelectTrigger>
          <SelectContent>
            {["Todas", "Aprovado", "Recuperação", "Reprovado"].map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={ordem}
          onValueChange={(v) => setOrdem(v as Ordem)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nome">Nome</SelectItem>
            <SelectItem value="media">Média</SelectItem>
            <SelectItem value="frequencia">Frequência</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={() => setAsc((v) => !v)}>
          <ArrowUpDown className="size-4" /> {asc ? "Crescente" : "Decrescente"}
        </Button>

        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" onClick={exportar}>
            <Download className="size-4" /> Exportar CSV
          </Button>

          <Dialog open={aberto} onOpenChange={setAberto}>
            <DialogTrigger asChild>
              <Button size="sm">
                <UserPlus className="size-4" /> Nova matrícula
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova matrícula</DialogTitle>
                <DialogDescription>Cadastre um aluno no ano letivo de 2026.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input
                    id="nome"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="resp">Responsável</Label>
                  <Input
                    id="resp"
                    value={form.responsavel}
                    onChange={(e) => setForm({ ...form, responsavel: e.target.value })}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="grid gap-2">
                    <Label>Turma</Label>
                    <Select
                      value={form.turma}
                      onValueChange={(v) => setForm({ ...form, turma: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {turmas.map((t) => (
                          <SelectItem key={t.id} value={t.nome}>
                            {t.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="freq">Frequência %</Label>
                    <Input
                      id="freq"
                      type="number"
                      value={form.frequencia}
                      onChange={(e) => setForm({ ...form, frequencia: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="media">Média</Label>
                    <Input
                      id="media"
                      type="number"
                      step="0.1"
                      value={form.media}
                      onChange={(e) => setForm({ ...form, media: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAberto(false)}>
                  Cancelar
                </Button>
                <Button onClick={salvar}>Matricular</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="shadow-soft">
        <CardContent className="overflow-x-auto pt-6">
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
                <TableHead className="text-right">Ações</TableHead>
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
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Remover ${a.nome}`}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remover matrícula?</AlertDialogTitle>
                          <AlertDialogDescription>
                            {a.nome} será removido(a) da lista de alunos.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              removeAluno(a.id);
                              toast.success("Matrícula removida.");
                            }}
                          >
                            Remover
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
              {lista.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
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
