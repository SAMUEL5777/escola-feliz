import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { contasDemo, rotulosPerfil, useAuth } from "@/lib/auth-store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar · Colégio Aurora — Gestão Escolar" },
      {
        name: "description",
        content:
          "Acesse o sistema do Colégio Aurora com perfis de secretaria, professor ou responsável.",
      },
      { property: "og:title", content: "Entrar · Colégio Aurora" },
      {
        property: "og:description",
        content: "Login por perfil: secretaria, professor e responsável.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { usuario, entrar } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  useEffect(() => {
    if (usuario) navigate({ to: "/", replace: true });
  }, [usuario, navigate]);

  const submeter = (e: React.FormEvent) => {
    e.preventDefault();
    const r = entrar(email, senha);
    if (!r.ok) {
      toast.error(r.erro ?? "Não foi possível entrar.");
      return;
    }
    toast.success("Bem-vindo(a) ao Colégio Aurora.");
    navigate({ to: "/", replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-sidebar px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-3 text-sidebar-foreground">
          <div className="flex size-11 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <GraduationCap className="size-5" />
          </div>
          <div>
            <p className="font-display text-xl leading-tight">Colégio Aurora</p>
            <p className="text-xs opacity-70">Sistema de Gestão Escolar</p>
          </div>
        </div>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Entrar</CardTitle>
            <CardDescription>Use uma das contas de demonstração abaixo.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={submeter}>
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="secretaria@escola.edu.br"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  autoComplete="current-password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="123456"
                />
              </div>
              <Button type="submit">Entrar</Button>
            </form>

            <div className="mt-6 space-y-2 border-t border-border pt-4">
              <p className="text-xs font-medium text-muted-foreground">
                Contas de demonstração (senha 123456)
              </p>
              {contasDemo.map((c) => (
                <button
                  key={c.email}
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg border border-border px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
                  onClick={() => {
                    setEmail(c.email);
                    setSenha(c.senha);
                  }}
                >
                  <span>
                    <span className="block font-medium">{rotulosPerfil[c.perfil]}</span>
                    <span className="block text-xs text-muted-foreground">{c.email}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">usar</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
