import Link from "next/link";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/60 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:justify-between">
        <div>
          <p className="font-heading text-lg font-bold">Gambeta</p>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            Botines y accesorios de fútbol. Coordinamos cada pedido por
            WhatsApp.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <Link href="/catalogo" className="text-muted-foreground hover:text-foreground">
            Catálogo
          </Link>
          <Link href="/envios-y-pagos" className="text-muted-foreground hover:text-foreground">
            Envíos y pagos
          </Link>
          <Link href="/faq" className="text-muted-foreground hover:text-foreground">
            Preguntas frecuentes
          </Link>
          <Link href="/contacto" className="text-muted-foreground hover:text-foreground">
            Contacto
          </Link>
          {WHATSAPP_NUMBER && (
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              WhatsApp
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
