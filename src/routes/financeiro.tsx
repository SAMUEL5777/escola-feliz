import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSchool } from "@/lib/school-store";
import { alunosVisiveis } from "@/lib/escopo";
import { useAuth } from "@/lib/auth-store";

export const Route = createFileRoute("/financeiro")({
  head: () => ({
    meta: [
      { title: "Financeiro · Mensalidades — Colégio Aurora" },
      {
        name: "description",
        content:
          "Controle de mensalidades do Colégio Aurora: pagas, pendentes e atrasadas, com registro de pagamento.",
      },
      { property: "og:title", content: "Financeiro · Mensalidades" },
      {
        property: "og:description",
        content: "Acompanhe cobranças por aluno e registre pagamentos.",
      },
    ],
  }),
  component: FinanceiroPage,
});

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function FinanceiroPage() {
  const { alunos, mensalidades, registrarPagamento, gerarMensalidade } = useSchool();
  const { usuario } = useAuth();
  const [status, setStatus] = useState("todas");
  const [busca, setBusca] = useState("");

  if (usuario?.perfil === "aluno") {
    return (
      <AppShell title="Financeiro" subtitle="Mensalidades, cobranças e pagamentos">
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            O financeiro fica disponível apenas para a secretaria e para o responsável.
          </CardContent>
        </Card>
      </AppShell>
    );
  }


  const nomeDe = (id: string) => alunos.find((a) => a.id === id)?.nome ?? id;

  const lista = useMemo(() => {
    let l = mensalidades;
    if (usuario && usuario.perfil !== "secretaria") {
      const ids = new Set(alunosVisiveis(alunos, usuario).map((a) => a.id));
      l = l.filter((m) => ids.has(m.alunoId));
    }
    if (status !== "todas") l = l.filter((m) => m.status === status);
    if (busca.trim()) {
      const q = busca.toLowerCase();
      l = l.filter(
        (m) => nomeDe(m.alunoId).toLowerCase().includes(q) || m.referencia.toLowerCase().includes(q),
      );
    }
    return l;
  }, [mensalidades, status, busca, usuario, alunos]);

  const total = lista.reduce((s, m) => s + m.valor, 0);
  const emAberto = lista.filter((m) => m.status !== "Paga").reduce((s, m) => s + m.valor, 0);

  return (
    <AppShell
      title="Financeiro"
      subtitle="Mensalidades, cobranças e pagamentos"
      actions={
        usuario?.perfil === "secretaria" ? (
          <Button
            onClick={() => {
              const alvo = alunos[0];
              if (!alvo) return;
              gerarMensalidade(alvo.id, "Set/2026", 890, "10/09/2026");
              toast.success(`Cobrança de Set/2026 gerada para ${alvo.nome}.`);
            }}
          >
            Gerar cobrança
          </Button>
        ) : undefined
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total no filtro</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{brl(total)}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Em aberto</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{brl(emAberto)}</CardContent>
        </Card>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Input
          placeholder="Buscar por aluno ou referência…"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="max-w-xs"
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            <SelectItem value="Paga">Pagas</SelectItem>
            <SelectItem value="Pendente">Pendentes</SelectItem>
            <SelectItem value="Atrasada">Atrasadas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="mt-4">
        <CardContent className="overflow-x-auto pt-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="py-2">Aluno</th>
                <th className="py-2">Referência</th>
                <th className="py-2">Vencimento</th>
                <th className="py-2">Valor</th>
                <th className="py-2">Status</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {lista.map((m) => (
                <tr key={m.id} className="border-b border-border/60">
                  <td className="py-2">{nomeDe(m.alunoId)}</td>
                  <td className="py-2">{m.referencia}</td>
                  <td className="py-2">{m.vencimento}</td>
                  <td className="py-2">{brl(m.valor)}</td>
                  <td className="py-2">
                    <Badge
                      variant={
                        m.status === "Paga"
                          ? "secondary"
                          : m.status === "Atrasada"
                            ? "destructive"
                            : "outline"
                      }
                    >
                      {m.status}
                    </Badge>
                  </td>
                  <td className="py-2 text-right">
                    {m.status !== "Paga" && usuario?.perfil === "secretaria" && (
                      <Button size="sm" variant="outline" onClick={() => registrarPagamento(m.id)}>
                        Registrar pagamento
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {lista.length === 0 && (
                <tr>
                  <td className="py-6 text-muted-foreground" colSpan={6}>
                    Nenhuma mensalidade encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </AppShell>
  );
}
