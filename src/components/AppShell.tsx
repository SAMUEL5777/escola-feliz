import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { toast } from "sonner";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  ClipboardList,
  LogOut,
  RotateCcw,
  UserCog,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GlobalSearch } from "@/components/GlobalSearch";
import { NotificationsMenu } from "@/components/NotificationsMenu";
import { useSchool } from "@/lib/school-store";

const nav = [
  { to: "/", label: "Painel", icon: LayoutDashboard },
  { to: "/alunos", label: "Alunos", icon: GraduationCap },
  { to: "/professores", label: "Professores", icon: Users },
  { to: "/turmas", label: "Turmas", icon: BookOpen },
  { to: "/notas", label: "Notas & Frequência", icon: ClipboardList },
] as const;

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { reset } = useSchool();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-sidebar px-4 py-6 text-sidebar-foreground md:flex">
        <div className="flex items-center gap-3 px-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <GraduationCap className="size-5" />
          </div>
          <div>
            <p className="font-display text-lg leading-tight">Colégio Aurora</p>
            <p className="text-xs opacity-70">Gestão Escolar</p>
          </div>
        </div>

        <nav className="mt-8 flex flex-col gap-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              activeProps={{
                className: "bg-sidebar-accent text-sidebar-accent-foreground",
              }}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-sidebar-accent/60"
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto rounded-xl bg-sidebar-accent/50 p-4 text-xs leading-relaxed opacity-90">
          Ano letivo 2026 · 2º bimestre em andamento
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex flex-wrap items-center gap-4 border-b border-border bg-background/85 px-6 py-4 backdrop-blur">
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-2xl font-semibold">{title}</h1>
            <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <GlobalSearch />
          <NotificationsMenu />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button aria-label="Conta">
                <Avatar className="size-9">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    MS
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                Maria Silva
                <span className="block text-xs font-normal text-muted-foreground">
                  Secretaria acadêmica
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => toast.info("Perfil disponível em breve.")}>
                <UserCog className="size-4" /> Meu perfil
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  reset();
                  toast.success("Dados de demonstração restaurados.");
                }}
              >
                <RotateCcw className="size-4" /> Restaurar dados demo
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => toast.info("Sessão encerrada (protótipo).")}>
                <LogOut className="size-4" /> Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <nav className="flex gap-1 overflow-x-auto border-b border-border px-4 py-2 md:hidden">
          {nav.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              activeProps={{ className: "bg-secondary text-secondary-foreground" }}
              className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm text-muted-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>

        {actions && (
          <div className="flex flex-wrap gap-2 border-b border-border px-6 py-3">{actions}</div>
        )}

        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
