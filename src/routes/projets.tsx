import { createFileRoute } from "@tanstack/react-router";
import { PageHero, projects } from "@/components/site";
import { useProjects } from "@/lib/projects";

export const Route = createFileRoute("/projets")({
  head: () => ({
    meta: [
      { title: "Projets & Événements — Morocco Media" },
      {
        name: "description",
        content:
          "Événements, lancements de produits, roadshows et conférences réalisés par Morocco Media.",
      },
      { property: "og:title", content: "Projets & Événements — Morocco Media" },
      { property: "og:description", content: "Une sélection de nos réalisations au Maroc." },
    ],
  }),
  component: Projects,
});

function Projects() {
  const { projects: liveProjects } = useProjects();
  return (
    <>
      <PageHero eyebrow="Projets / Events" title="Nos réalisations">
        Des événements et campagnes qui ont marqué les esprits.
      </PageHero>
      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-24 md:grid-cols-2">
        {(liveProjects.length ? liveProjects : projects).map((p) => (
          <article
            key={"title" in p ? p.title : p.t}
            className="group overflow-hidden rounded-lg border border-border bg-card"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={"image" in p ? p.image : p.img}
                alt={"title" in p ? p.title : p.t}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-8">
              <p className="eyebrow">{"category" in p ? p.category : p.cat}</p>
              <h2 className="mt-2 text-2xl font-bold">{"title" in p ? p.title : p.t}</h2>
              <p className="mt-2 text-muted-foreground">
                {"description" in p ? p.description : p.d}
              </p>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
