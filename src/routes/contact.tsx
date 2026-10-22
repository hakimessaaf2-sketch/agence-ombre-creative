import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { EMAIL, INSTAGRAM, INSTAGRAM_HANDLE, InstagramIcon, PageHero } from "@/components/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Morocco Media" },
      { name: "description", content: "Contactez Morocco Media à Casablanca pour votre prochain projet." },
      { property: "og:title", content: "Contact — Morocco Media" },
      { property: "og:description", content: "Parlons de votre projet de communication." },
    ],
  }),
  component: Contact,
});

const field = "w-full rounded-md border border-input bg-background px-4 py-3 outline-none transition focus:border-primary";

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <PageHero eyebrow="Contact" title="Parlons de votre projet">
        Une idée, un événement, un lancement ? Notre équipe vous répond rapidement.
      </PageHero>
      <section className="mx-auto grid max-w-7xl gap-16 px-6 py-24 md:grid-cols-[1fr_1.5fr]">
        <div className="space-y-8">
          {[["Adresse", "Casablanca, Maroc"], ["Téléphone", "+212 5 00 00 00 00"]].map(([k, v]) => (
            <div key={k}>
              <p className="eyebrow">{k}</p>
              <p className="mt-2 text-xl font-semibold">{v}</p>
            </div>
          ))}
          <div>
            <p className="eyebrow">Email</p>
            <a href={`mailto:${EMAIL}`} className="mt-2 inline-block text-xl font-semibold transition hover:text-primary">{EMAIL}</a>
          </div>
          <div>
            <p className="eyebrow">Instagram</p>
            <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-2 text-xl font-semibold transition hover:text-primary">
              <InstagramIcon className="h-5 w-5" /> {INSTAGRAM_HANDLE}
            </a>
          </div>
        </div>
        {sent ? (
          <div className="rounded-lg border border-primary bg-card p-10">
            <h2 className="text-3xl font-bold">Merci !</h2>
            <p className="mt-2 text-muted-foreground">Votre message a bien été envoyé. Nous revenons vers vous très vite.</p>
          </div>
        ) : (
          <form className="grid gap-4 rounded-lg border border-border bg-card p-8" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <div className="grid gap-4 md:grid-cols-2">
              <input required placeholder="Nom complet" className={field} />
              <input required type="email" placeholder="Email" className={field} />
            </div>
            <input placeholder="Société" className={field} />
            <select className={field} defaultValue="">
              <option value="" disabled>Service souhaité</option>
              <option>Relations presse</option>
              <option>Événementiel</option>
              <option>Lancement de produit</option>
              <option>Influenceurs</option>
              <option>Autre</option>
            </select>
            <textarea required rows={5} placeholder="Votre message" className={field} />
            <button className="rounded-md bg-primary px-7 py-3 font-semibold text-primary-foreground transition hover:opacity-90">Envoyer</button>
          </form>
        )}
      </section>
    </>
  );
}
