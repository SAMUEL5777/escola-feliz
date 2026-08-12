import { Bell, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useSchool } from "@/lib/school-store";

export function NotificationsMenu() {
  const { notificacoes, marcarTodasLidas } = useSchool();
  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label="Notificações"
          className="relative rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-muted"
        >
          <Bell className="size-4" />
          {naoLidas > 0 && (
            <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-accent text-[10px] font-medium text-accent-foreground">
              {naoLidas}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-medium">Notificações</p>
          <Button variant="ghost" size="sm" onClick={marcarTodasLidas} disabled={naoLidas === 0}>
            <Check className="size-3.5" /> Marcar lidas
          </Button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notificacoes.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              Nenhuma notificação.
            </p>
          )}
          {notificacoes.map((n) => (
            <div key={n.id} className="border-b border-border/60 px-4 py-3 last:border-0">
              <p className={`text-sm ${n.lida ? "text-muted-foreground" : "font-medium"}`}>
                {n.texto}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{n.quando}</p>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
