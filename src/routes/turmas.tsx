import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Users } from "lucide-react";
import { disciplinas } from "@/lib/school-data";
import { useSchool } from "@/lib/school-store";

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
  const { turmas, professores, alunos, addTurma, removeTurma } = useSchool();
  const [turno, setTurno] = useState("Todos");
  const [aberto, setAberto] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    turno: "Manhã" as "Manhã" | "Tarde",
    sala: "",
    regente: professores[0]?.nome ?? "",
    alunos: "25",
  });

  const lista = turmas.filter((t) => turno === "Todos" || t.turno === turno);

  const salvar = () => {
    if (!form.nome.trim() || !form.sala.trim()) {
      toast.error("Informe nome da turma e sala.");
      return;
    }
    addTurma({
      nome: form.nome.trim(),
      turno: form.turno,
      sala: form.sala.trim(),
      regente: form.regente,
      alunos: Number(form.alunos) || 0,
    });
    toast.success(`Turma ${form.nome} criada.`);
    setForm({ ...form, nome: "", sala: "" });
    setAberto(false);
  };

  return (
    <AppShell title="Turmas" subtitle="Ano letivo 2026 · ensino fundamental II">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {["Todos", "Manhã", "Tarde"].map((t) => (
          <Button
            key={t}
            size="sm"
            variant={turno === t ? "default" : "outline"}
            onClick={() => setTurno(t)}
          >
            {t}
          </Button>
        ))}

        <Dialog open={aberto} onOpenChange={setAberto}>
          <DialogTrigger asChild>
            <Button size="sm" className="ml-auto">
              <Plus className="size-4" /> Nova turma
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova turma</DialogTitle>
              <DialogDescription>Defina turno, sala e professor regente.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="tnome">Nome</Label>
                <Input
                  id="tnome"
                  placeholder="6º A"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tsala">Sala</Label>
                <Input
                  id="tsala"
                  value={form.sala}
                  onChange={(e) => setForm({ ...form, sala: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Turno</Label>
                <Select
                  value={form.turno}
                  onValueChange={(v) => setForm({ ...form, turno: v as "Manhã" | "Tarde" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manhã">Manhã</SelectItem>
                    <SelectItem value="Tarde">Tarde</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Regente</Label>
                <Select
                  value={form.regente}
                  onValueChange={(v) => setForm({ ...form, regente: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {professores.map((p) => (
                      <SelectItem key={p.id} value={p.nome}>
                        {p.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tqtd">Alunos</Label>
                <Input
                  id="tqtd"
                  type="number"
                  value={form.alunos}
                  onChange={(e) => setForm({ ...form, alunos: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAberto(false)}>
                Cancelar
              </Button>
              <Button onClick={salvar}>Criar turma</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {lista.map((t) => {
          const matriculados = alunos.filter((a) => a.turma === t.nome).length;
          return (
            <Card key={t.id} className="shadow-soft">
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="font-display text-2xl">{t.nome}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={t.turno === "Manhã" ? "secondary" : "outline"}>{t.turno}</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Remover turma ${t.nome}`}
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      removeTurma(t.id);
                      toast.success(`Turma ${t.nome} removida.`);
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
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

                <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="size-4" /> {matriculados} aluno(s) nesta lista
                </p>

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
          );
        })}
      </div>
    </AppShell>
  );
}
