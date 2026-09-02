import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Printer } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useSchool } from "@/lib/school-store";
import { useAuth } from "@/lib/auth-store";

export const Route = createFileRoute("/boletim")({
  head: () => ({
    meta: [
      { title: "Boletim & Histórico · Colégio Aurora" },
      {
        name: "description",
        content:
          "Boletim bimestral e histórico escolar dos alunos do Colégio Aurora, pronto para impressão em PDF.",
      },
      { property: "og:title", content: "Boletim & Histórico · Colégio Aurora" },
      {
        property: "og:description",
        content: "Consulte notas por bimestre, frequência e histórico escolar por ano.",
      },
    ],
  }),
  component: BoletimPage,
});

function BoletimPage() {
  const { alunos, notas, historico } = useSchool();
  const { usuario } = useAuth();

  const visiveis = useMemo(() => {
    if (usuario?.perfil === "responsavel" && usuario.vinculo) {
      return alunos.filter((a) => a.nome === usuario.vinculo);
    }
    return alunos;
  }, [alunos, usuario]);

  const [alunoId, setAlunoId] = useState(visiveis[0]?.id ?? "");
  const aluno = visiveis.find((a) => a.id === alunoId) ?? visiveis[0];
  const bimestres = notas.find((n) => n.alunoId === aluno?.id)?.bimestres ?? [];
  const registros = historico.filter((h) => h.alunoId === aluno?.id);

  if (!aluno) {
    return (
      <AppShell title="Boletim & Histórico" subtitle="Nenhum aluno disponível">
        <p className="text-sm text-muted-foreground">Sem alunos para exibir.</p>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Boletim & Histórico"
      subtitle="Notas por bimestre, frequência e anos anteriores"
      actions={
        <>
          <Select value={aluno.id} onValueChange={setAlunoId}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {visiveis.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.nome} · {a.turma}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => window.print()}>
            <Printer className="size-4" /> Imprimir / Salvar PDF
          </Button>
        </>
      }
    >
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {aluno.nome}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                Matrícula {aluno.id} · {aluno.turma} · Responsável: {aluno.responsavel}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="py-2">Bimestre</th>
                  <th className="py-2">Nota</th>
                </tr>
              </thead>
              <tbody>
                {bimestres.map((n, i) => (
                  <tr key={i} className="border-b border-border/60">
                    <td className="py-2">{i + 1}º bimestre</td>
                    <td className="py-2">{n.toFixed(1)}</td>
                  </tr>
                ))}
                <tr>
                  <td className="py-2 font-medium">Média / Frequência</td>
                  <td className="py-2 font-medium">
                    {aluno.media.toFixed(1)} · {aluno.frequencia}%{" "}
                    <Badge variant="secondary">{aluno.situacao}</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Histórico escolar</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="py-2">Ano</th>
                  <th className="py-2">Série</th>
                  <th className="py-2">Média final</th>
                  <th className="py-2">Frequência</th>
                  <th className="py-2">Resultado</th>
                </tr>
              </thead>
              <tbody>
                {registros.map((h) => (
                  <tr key={`${h.ano}-${h.serie}`} className="border-b border-border/60">
                    <td className="py-2">{h.ano}</td>
                    <td className="py-2">{h.serie}</td>
                    <td className="py-2">{h.mediaFinal.toFixed(1)}</td>
                    <td className="py-2">{h.frequencia}%</td>
                    <td className="py-2">{h.resultado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
