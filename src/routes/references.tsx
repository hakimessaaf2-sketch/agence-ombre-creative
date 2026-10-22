import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site";
import media from "@/assets/mm/media.json";

export const Route = createFileRoute("/references")({
  head: () => ({
    meta: [
      { title: "Références — Morocco Media" },
      { name: "description", content: "Les marques, artistes et influenceurs qui font confiance à Morocco Media." },
      { property: "og:title", content: "Références — Morocco Media" },
      { property: "og:description", content: "Ils nous ont fait confiance." },
    ],
  }),
  component: Refs,
});

function Gallery({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <h2 className="text-4xl font-bold">{title}</h2>
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {items.map((u) => (
          <div key={u} className="aspect-[3/4] overflow-hidden rounded-lg border border-border">
            <img src={u} alt={title} loading="lazy" className="h-full w-full object-cover grayscale transition duration-500 hover:scale-105 hover:grayscale-0" />
          </div>
        ))}
      </div>
    </section>
  );
}

function Refs() {
  return (
    <>
      <PageHero eyebrow="Nos références" title="Ils nous ont fait confiance">
        Technologie, télécommunications, automobile, grande distribution, beauté, lifestyle et corporate : nous accompagnons des marques de tous secteurs.
      </PageHero>
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
          {media.clients.map((u) => (
            <div key={u} className="flex h-28 items-center justify-center rounded-lg bg-logo-bg p-4 transition hover:-translate-y-1">
              <img src={u} alt="Logo client" loading="lazy" className="max-h-full max-w-full object-contain" />
            </div>
          ))}
        </div>
      </section>
      <div className="border-t border-border" />
      <Gallery title="Artistes" items={media.artists} />
      <Gallery title="Influenceurs" items={media.influencers} />
    </>
  );
}
