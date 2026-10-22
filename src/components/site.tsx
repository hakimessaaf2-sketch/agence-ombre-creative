import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import media from "@/assets/mm/media.json";
import logoAsset from "@/assets/mm/logo.png.asset.json";

const nav = [
  { to: "/a-propos", label: "À propos" },
  { to: "/services", label: "Services" },
  { to: "/projets", label: "Projets" },
  { to: "/references", label: "Références" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logoAsset.url} alt="Morocco Media" className="h-12 w-auto" />
        </Link>
        <nav className="hidden gap-8 md:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="text-sm font-semibold text-muted-foreground transition hover:text-foreground" activeProps={{ className: "text-sm font-semibold text-primary" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)} aria-label="Menu">☰</button>
      </div>
      {open && (
        <nav className="flex flex-col gap-4 border-t border-border px-6 py-4 md:hidden">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="font-semibold">{n.label}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-bold">MOROCCO <span className="text-primary">MEDIA</span></p>
          <p className="mt-3 text-sm text-muted-foreground">Agence de communication, relations presse et événementiel basée à Casablanca.</p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          {nav.map((n) => <Link key={n.to} to={n.to} className="text-muted-foreground hover:text-primary">{n.label}</Link>)}
        </div>
        <div className="text-sm text-muted-foreground">
          <p>Casablanca, Maroc</p>
          <p className="mt-2">contact@moroccomedia.ma</p>
        </div>
      </div>
      <p className="border-t border-border py-4 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} Morocco Media. Tous droits réservés.</p>
    </footer>
  );
}

export function PageHero({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-glow">
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-5xl font-extrabold md:text-7xl">{title}</h1>
        {children && <div className="mt-6 max-w-2xl text-lg text-muted-foreground">{children}</div>}
      </div>
    </section>
  );
}

export const services = [
  { t: "Relations Presse & Media Coverage", d: "Communiqués, conférences de presse et couverture médiatique nationale et internationale." },
  { t: "Organisation d’Événements", d: "Conception et production d’événements corporate, galas, salons et soirées de marque." },
  { t: "Lancement de Produits", d: "Des lancements marquants qui créent l’attente et maximisent la visibilité." },
  { t: "Influenceurs & KOL Management", d: "Campagnes avec les créateurs et leaders d’opinion les plus pertinents." },
  { t: "Production Vidéo & Photo", d: "Contenus créatifs de qualité pour vos campagnes et réseaux sociaux." },
  { t: "Communication Digitale", d: "Stratégie social media, contenus et campagnes digitales orientées résultats." },
  { t: "Media Buying", d: "Achat d’espaces optimisé en TV, radio, presse, affichage et digital." },
  { t: "Brand Activation & Roadshow", d: "Des activations terrain qui rapprochent votre marque de son public." },
  { t: "Artist & Talent Management", d: "Management d’artistes et de talents, partenariats et booking." },
];
