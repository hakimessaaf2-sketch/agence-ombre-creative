import { createFileRoute } from "@tanstack/react-router";
import { PageHero, services } from "@/components/site";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Nos Services — Morocco Media" },
      { name: "description", content: "Relations presse, événements, lancements, influenceurs, production, digital, media buying." },
      { property: "og:title", content: "Nos Services — Morocco Media" },
      { property: "og:description", content: "Toutes les expertises de Morocco Media pour votre marque." },
    ],
  }),
  component: Services,
});

function Services() {
  return (
    <>
      <PageHero eyebrow="Nos services" title="Des solutions complètes pour votre visibilité">
        Neuf expertises complémentaires pour concevoir, produire et amplifier vos campagnes.
      </PageHero>
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="divide-y divide-border border-y border-border">
          {services.map((s, i) => (
            <div key={s.t} className="group grid items-baseline gap-4 py-10 md:grid-cols-[120px_1fr_1fr]">
              <span className="font-display text-4xl font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="text-2xl font-bold transition group-hover:text-primary md:text-3xl">{s.t}</h2>
              <p className="text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
