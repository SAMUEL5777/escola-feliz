import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Mail, Plus, Trash2 } from "lucide-react";
import { useSchool } from "@/lib/school-store";

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
  const { professores, turmas, addProfessor, removeProfessor } = useSchool();
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState(false);
  const [form, setForm] = useState({ nome: "", disciplina: "", email: "", turmas: [] as string[] });

  const lista = professores.filter(
    (p) =>
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.disciplina.toLowerCase().includes(busca.toLowerCase()),
  );

  const alternarTurma = (nome: string) =>
    setForm((f) => ({
      ...f,
      turmas: f.turmas.includes(nome)
        ? f.turmas.filter((t) => t !== nome)
        : [...f.turmas, nome],
    }));

  const salvar = () => {
    if (!form.nome.trim() || !form.disciplina.trim()) {
      toast.error("Informe nome e disciplina.");
      return;
    }
    addProfessor({
      nome: form.nome.trim(),
      disciplina: form.disciplina.trim(),
      email: form.email.trim() || "sem-email@escola.edu.br",
      turmas: form.turmas,
    });
    toast.success(`${form.nome} adicionado ao corpo docente.`);
    setForm({ nome: "", disciplina: "", email: "", turmas: [] });
    setAberto(false);
  };

  return (
    <AppShell title="Professores" subtitle="Corpo docente e atribuição de turmas">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome ou disciplina"
          className="w-full sm:max-w-xs"
        />
        <Dialog open={aberto} onOpenChange={setAberto}>
          <DialogTrigger asChild>
            <Button size="sm" className="ml-auto">
              <Plus className="size-4" /> Novo professor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo professor</DialogTitle>
              <DialogDescription>Cadastre um docente e atribua turmas.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="pnome">Nome</Label>
                <Input
                  id="pnome"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pdisc">Disciplina</Label>
                <Input
                  id="pdisc"
                  value={form.disciplina}
                  onChange={(e) => setForm({ ...form, disciplina: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pmail">E-mail</Label>
                <Input
                  id="pmail"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Turmas</Label>
                <div className="flex flex-wrap gap-1.5">
                  {turmas.map((t) => (
                    <Button
                      key={t.id}
                      type="button"
                      size="sm"
                      variant={form.turmas.includes(t.nome) ? "default" : "outline"}
                      onClick={() => alternarTurma(t.nome)}
                    >
                      {t.nome}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAberto(false)}>
                Cancelar
              </Button>
              <Button onClick={salvar}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {lista.map((p) => (
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
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Remover ${p.nome}`}
                  className="ml-auto text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    removeProfessor(p.id);
                    toast.success("Professor removido.");
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.turmas.length === 0 && (
                  <span className="text-xs text-muted-foreground">Sem turmas atribuídas</span>
                )}
                {p.turmas.map((t) => (
                  <Badge key={t} variant="secondary">
                    {t}
                  </Badge>
                ))}
              </div>

              <a
                href={`mailto:${p.email}`}
                className="mt-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <Mail className="size-4" />
                {p.email}
              </a>
            </CardContent>
          </Card>
        ))}
        {lista.length === 0 && (
          <p className="text-muted-foreground">Nenhum professor encontrado.</p>
        )}
      </div>
    </AppShell>
  );
}
