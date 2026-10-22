import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site";
import hero from "@/assets/hero.jpg";
import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";

export const Route = createFileRoute("/projets")({
  head: () => ({
    meta: [
      { title: "Projets & Événements — Morocco Media" },
      { name: "description", content: "Événements, lancements de produits, roadshows et conférences réalisés par Morocco Media." },
      { property: "og:title", content: "Projets & Événements — Morocco Media" },
      { property: "og:description", content: "Une sélection de nos réalisations au Maroc." },
    ],
  }),
  component: Projects,
});

const projects = [
  { img: p1, cat: "Lancement de produit", t: "Lancement smartphone", d: "Mise en scène, presse et influenceurs pour un lancement high-tech." },
  { img: p2, cat: "Brand Activation & Roadshow", t: "Roadshow national", d: "Une tournée dans les grandes villes du Royaume au plus près du public." },
  { img: p3, cat: "Relations presse", t: "Conférence de presse", d: "Organisation et couverture médiatique d’une annonce officielle." },
  { img: hero, cat: "Événement corporate", t: "Gala d’entreprise", d: "Scénographie, accueil des invités et production audiovisuelle." },
];

function Projects() {
  return (
    <>
      <PageHero eyebrow="Projets / Events" title="Nos réalisations">
        Des événements et campagnes qui ont marqué les esprits.
      </PageHero>
      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-24 md:grid-cols-2">
        {projects.map((p) => (
          <article key={p.t} className="group overflow-hidden rounded-lg border border-border bg-card">
            <div className="aspect-[4/3] overflow-hidden">
              <img src={p.img} alt={p.t} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            </div>
            <div className="p-8">
              <p className="eyebrow">{p.cat}</p>
              <h2 className="mt-2 text-2xl font-bold">{p.t}</h2>
              <p className="mt-2 text-muted-foreground">{p.d}</p>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
