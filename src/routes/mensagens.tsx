import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSchool } from "@/lib/school-store";
import { useAuth, rotulosPerfil } from "@/lib/auth-store";

export const Route = createFileRoute("/mensagens")({
  head: () => ({
    meta: [
      { title: "Mensagens para responsáveis · Colégio Aurora" },
      {
        name: "description",
        content:
          "Canal de comunicação entre secretaria, professores e responsáveis do Colégio Aurora.",
      },
      { property: "og:title", content: "Mensagens · Colégio Aurora" },
      {
        property: "og:description",
        content: "Envie e acompanhe recados por aluno entre escola e família.",
      },
    ],
  }),
  component: MensagensPage,
});

function MensagensPage() {
  const { alunos, mensagens, enviarMensagem } = useSchool();
  const { usuario } = useAuth();

  const visiveis = useMemo(() => {
    if (usuario?.perfil === "responsavel" && usuario.vinculo) {
      return alunos.filter((a) => a.nome === usuario.vinculo);
    }
    return alunos;
  }, [alunos, usuario]);

  const [alunoId, setAlunoId] = useState(visiveis[0]?.id ?? "");
  const [texto, setTexto] = useState("");

  const thread = mensagens.filter((m) => m.alunoId === alunoId);

  const enviar = () => {
    if (!texto.trim() || !usuario) {
      toast.error("Escreva uma mensagem antes de enviar.");
      return;
    }
    enviarMensagem({
      alunoId,
      autor: usuario.nome,
      perfil: rotulosPerfil[usuario.perfil],
      texto: texto.trim(),
    });
    setTexto("");
    toast.success("Mensagem enviada.");
  };

  return (
    <AppShell
      title="Mensagens"
      subtitle="Comunicação entre escola e responsáveis"
      actions={
        <Select value={alunoId} onValueChange={setAlunoId}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Selecione o aluno" />
          </SelectTrigger>
          <SelectContent>
            {visiveis.map((a) => (
              <SelectItem key={a.id} value={a.id}>
                {a.nome} · {a.turma}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Conversa</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-3">
            {thread.map((m) => (
              <div key={m.id} className="rounded-lg border border-border p-3">
                <p className="text-sm">{m.texto}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {m.autor} · {m.perfil} · {m.quando}
                </p>
              </div>
            ))}
            {thread.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhuma mensagem para este aluno.</p>
            )}
          </div>

          <div className="grid gap-2">
            <Textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escreva um recado…"
              rows={3}
            />
            <Button className="justify-self-start" onClick={enviar}>
              <Send className="size-4" /> Enviar
            </Button>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
