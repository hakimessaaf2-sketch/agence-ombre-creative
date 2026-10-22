import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import media from "@/assets/mm/media.json";
import { services } from "@/components/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Morocco Media — Communication, PR & Événementiel" },
      { name: "description", content: "Agence de communication, relations presse et événementiel basée à Casablanca." },
      { property: "og:title", content: "Morocco Media — Communication, PR & Événementiel" },
      { property: "og:description", content: "Agence de communication, relations presse et événementiel basée à Casablanca." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <section className="relative min-h-[88vh] overflow-hidden">
        <img src={hero} alt="Événement Morocco Media" width={1600} height={912} className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-fade" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-6 pb-24">
          <p className="eyebrow">Casablanca · Maroc</p>
          <h1 className="mt-4 max-w-5xl text-5xl font-extrabold leading-[1.02] md:text-8xl">
            Faites <span className="text-primary">rayonner</span> votre marque.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Communication stratégique, relations presse, événements et lancements de produits pour les marques nationales et internationales.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/contact" className="rounded-md bg-primary px-7 py-3 font-semibold text-primary-foreground transition hover:opacity-90">Parlons de votre projet</Link>
            <Link to="/services" className="rounded-md border border-border px-7 py-3 font-semibold transition hover:border-primary">Nos services</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="eyebrow">Expertises</p>
        <h2 className="mt-3 text-4xl font-bold md:text-5xl">De la stratégie à la réalisation</h2>
        <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
          {services.slice(0, 6).map((s, i) => (
            <div key={s.t} className="bg-background p-8 transition hover:bg-card">
              <span className="font-display text-sm text-primary">0{i + 1}</span>
              <h3 className="mt-3 text-xl font-bold">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card py-16">
        <p className="eyebrow text-center">Ils nous ont fait confiance</p>
        <div className="mx-auto mt-8 grid max-w-7xl grid-cols-3 gap-4 px-6 md:grid-cols-6">
          {media.clients.slice(0, 12).map((u) => (
            <div key={u} className="flex h-20 items-center justify-center rounded bg-logo-bg p-3">
              <img src={u} alt="Client" loading="lazy" className="max-h-full max-w-full object-contain" />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
