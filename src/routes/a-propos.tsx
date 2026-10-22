import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site";
import p3 from "@/assets/p3.jpg";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — Morocco Media" },
      { name: "description", content: "Agence de communication, relations presse et événementiel basée à Casablanca." },
      { property: "og:title", content: "À propos — Morocco Media" },
      { property: "og:description", content: "Découvrez Morocco Media, votre partenaire communication au Maroc." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageHero eyebrow="À propos" title="Agence de Communication, Relations Presse et Événementiel">
        Basée à Casablanca, Morocco Media accompagne des marques nationales et internationales dans le développement de leur image et de leur visibilité au Maroc.
      </PageHero>
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-2">
        <img src={p3} alt="Conférence de presse" loading="lazy" width={1024} height={768} className="rounded-lg object-cover" />
        <div className="space-y-6 text-lg text-muted-foreground">
          <p>Morocco Media est une agence spécialisée en communication stratégique, relations presse, organisation d’événements et lancement de produits.</p>
          <p>Grâce à notre réseau de médias, d’influenceurs et de partenaires, nous concevons et mettons en œuvre des campagnes efficaces, combinant relations presse, marketing digital, production de contenu et activation de marque.</p>
          <p>Nous intervenons également dans le management d’artistes et d’influenceurs, avec des solutions de communication sur mesure.</p>
        </div>
      </section>
      <section className="border-t border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-20 md:grid-cols-3">
          {[
            ["Notre mission", "Offrir des solutions sur mesure, créatives et orientées résultats."],
            ["Notre exécution", "Une réalisation professionnelle et une forte visibilité médiatique."],
            ["Notre promesse", "De la stratégie à la réalisation, faire rayonner votre marque."],
          ].map(([t, d]) => (
            <div key={t} className="border-l-2 border-primary pl-6">
              <h3 className="text-2xl font-bold">{t}</h3>
              <p className="mt-2 text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
