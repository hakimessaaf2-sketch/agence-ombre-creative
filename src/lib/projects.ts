import { useEffect, useState } from "react";
import hero from "@/assets/hero.jpg";
import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import { supabase } from "@/lib/supabase";

export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  published: boolean;
  createdAt: string;
  order?: number;
};

export type ProjectCategory = {
  id: string;
  name: string;
  order: number;
};

export const fallbackProjects: Project[] = [
  {
    id: "lancement-smartphone",
    image: p1,
    category: "Lancement de produit",
    title: "Lancement smartphone",
    description: "Mise en scène, presse et influenceurs pour un lancement high-tech.",
    published: true,
    createdAt: "2026-01-14T10:00:00.000Z",
    order: 0,
  },
  {
    id: "roadshow-national",
    image: p2,
    category: "Brand Activation & Roadshow",
    title: "Roadshow national",
    description: "Une tournée dans les grandes villes du Royaume au plus près du public.",
    published: true,
    createdAt: "2026-02-03T10:00:00.000Z",
    order: 1,
  },
  {
    id: "conference-presse",
    image: p3,
    category: "Relations presse",
    title: "Conférence de presse",
    description: "Organisation et couverture médiatique d’une annonce officielle.",
    published: true,
    createdAt: "2026-02-18T10:00:00.000Z",
    order: 2,
  },
  {
    id: "gala-entreprise",
    image: hero,
    category: "Événement corporate",
    title: "Gala d’entreprise",
    description: "Scénographie, accueil des invités et production audiovisuelle.",
    published: true,
    createdAt: "2026-03-01T10:00:00.000Z",
    order: 3,
  },
];

export const fallbackCategories: ProjectCategory[] = Array.from(
  new Set(fallbackProjects.map((project) => project.category)),
).map((name, order) => ({
  id: name,
  name,
  order,
}));

export async function getCategories(): Promise<ProjectCategory[]> {
  if (!supabase) return fallbackCategories;
  const { data, error } = await supabase
    .from("project_categories")
    .select("id, name, sort_order")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({ id: row.id, name: row.name, order: row.sort_order }));
}

export async function createCategory(name: string, order = 0) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("project_categories")
    .insert({ name: name.trim(), sort_order: order })
    .select("id, name, sort_order")
    .single();
  if (error) throw new Error(error.message);
  return { id: data.id, name: data.name, order: data.sort_order } satisfies ProjectCategory;
}

export function useCategories() {
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getCategories()
      .then((nextCategories) => {
        if (active) setCategories(nextCategories);
      })
      .catch(() => {
        if (active) setCategories([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { categories, loading, setCategories };
}

export async function getProjects(includeUnpublished = false): Promise<Project[]> {
  if (!supabase)
    return sortProjects(
      includeUnpublished
        ? fallbackProjects
        : fallbackProjects.filter((project) => project.published),
    );

  const query = supabase
    .from("projects")
    .select("id, title, category, description, image_path, published, sort_order, created_at")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  const { data, error } = includeUnpublished ? await query : await query.eq("published", true);
  if (error) throw new Error(error.message);
  return (data ?? []).map(fromRow);
}

function fromRow(row: {
  id: string;
  title: string;
  category: string;
  description: string;
  image_path: string;
  published: boolean;
  sort_order: number;
  created_at: string;
}): Project {
  const image =
    row.image_path.startsWith("/") ||
    row.image_path.startsWith("http") ||
    row.image_path.startsWith("data:")
      ? row.image_path
      : (supabase?.storage.from("project-images").getPublicUrl(row.image_path).data.publicUrl ??
        row.image_path);
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    image,
    published: row.published,
    order: row.sort_order,
    createdAt: row.created_at,
  };
}

function requireSupabase() {
  if (!supabase)
    throw new Error(
      "Supabase n’est pas configuré. Ajoutez les variables VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY.",
    );
  return supabase;
}

async function persistImage(image: string) {
  if (!image.startsWith("data:")) return image;
  const client = requireSupabase();
  const [metadata, payload] = image.split(",");
  if (!metadata || !payload) throw new Error("Format d’image invalide.");
  const contentType = metadata.match(/data:(.*?);base64/)?.[1] ?? "image/jpeg";
  const binary = Uint8Array.from(atob(payload), (character) => character.charCodeAt(0));
  const extension = contentType.split("/")[1] ?? "jpg";
  const path = `projects/${crypto.randomUUID()}.${extension}`;
  const { error } = await client.storage
    .from("project-images")
    .upload(path, binary, { contentType, upsert: false });
  if (error) throw new Error(error.message);
  return path;
}

export async function createProject(project: Omit<Project, "id" | "createdAt">) {
  const client = requireSupabase();
  const imagePath = await persistImage(project.image);
  const { data, error } = await client
    .from("projects")
    .insert({
      title: project.title,
      category: project.category,
      description: project.description,
      image_path: imagePath,
      published: project.published,
      // `sort_order` is a Postgres integer; keep the fallback within its range.
      // The admin form normally supplies the next sequential order explicitly.
      sort_order: project.order ?? 0,
    })
    .select("id, title, category, description, image_path, published, sort_order, created_at")
    .single();
  if (error) throw new Error(error.message);
  return fromRow(data);
}

export async function updateProject(id: string, changes: Partial<Project>) {
  const client = requireSupabase();
  const payload: Record<string, unknown> = {};
  if (changes["title"] !== undefined) payload["title"] = changes["title"];
  if (changes["category"] !== undefined) payload["category"] = changes["category"];
  if (changes["description"] !== undefined) payload["description"] = changes["description"];
  if (changes["published"] !== undefined) payload["published"] = changes["published"];
  if (changes["order"] !== undefined) payload["sort_order"] = changes["order"];
  if (changes["image"] !== undefined) payload["image_path"] = await persistImage(changes["image"]);
  const { data, error } = await client
    .from("projects")
    .update(payload)
    .eq("id", id)
    .select("id, title, category, description, image_path, published, sort_order, created_at")
    .single();
  if (error) throw new Error(error.message);
  return fromRow(data);
}

export async function deleteProject(id: string) {
  const { error } = await requireSupabase().from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export function useProjects(includeUnpublished = false) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getProjects(includeUnpublished).then((nextProjects) => {
      if (active) {
        setProjects(nextProjects);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [includeUnpublished]);

  return { projects, loading, setProjects };
}

export function sortProjects(projects: Project[]) {
  return [...projects].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}
