import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowDownToLine,
  ArrowUpToLine,
  Check,
  Eye,
  EyeOff,
  FolderKanban,
  ImagePlus,
  LogOut,
  Plus,
  Trash2,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createProject,
  createCategory,
  deleteProject,
  type Project,
  type ProjectCategory,
  updateProject,
  useCategories,
  useProjects,
  sortProjects,
} from "@/lib/projects";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Morocco Media" }] }),
  component: Admin,
});

const inputClass =
  "w-full rounded border border-border bg-background px-3 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(!isSupabaseConfigured);
  const [adminReady, setAdminReady] = useState<boolean | null>(null);
  const [loginError, setLoginError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setUser(data.session?.user ?? null);
        setAuthReady(true);
      }
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAdminReady(null);
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!supabase || !user) return;
    supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data, error }) => setAdminReady(Boolean(data) && !error));
  }, [user]);

  if (!isSupabaseConfigured) {
    return <SupabaseSetupNotice />;
  }

  if (!authReady) {
    return (
      <main className="flex min-h-[calc(100vh-76px)] items-center justify-center text-sm text-muted-foreground">
        Vérification de la session…
      </main>
    );
  }

  if (!user) {
    return (
      <Login
        email={email}
        password={password}
        error={loginError}
        busy={loginBusy}
        setEmail={setEmail}
        setPassword={setPassword}
        onSubmit={async (event) => {
          event.preventDefault();
          if (!supabase) return;
          setLoginBusy(true);
          setLoginError("");
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) setLoginError("Email ou mot de passe incorrect.");
          setLoginBusy(false);
        }}
      />
    );
  }

  if (adminReady === null) {
    return (
      <main className="flex min-h-[calc(100vh-76px)] items-center justify-center text-sm text-muted-foreground">
        Vérification des droits administrateur…
      </main>
    );
  }

  if (!adminReady) {
    return <AccessDenied onLogout={() => void supabase?.auth.signOut()} />;
  }

  return (
    <AdminDashboard
      onLogout={() => {
        void supabase?.auth.signOut();
      }}
      onBack={() => navigate({ to: "/" })}
      showForm={showForm}
      setShowForm={setShowForm}
      editing={editing}
      setEditing={setEditing}
    />
  );
}

function SupabaseSetupNotice() {
  return (
    <main className="flex min-h-[calc(100vh-76px)] items-center justify-center px-6 py-16">
      <div className="max-w-lg rounded-lg border border-border bg-card p-8">
        <p className="eyebrow">Configuration requise</p>
        <h1 className="mt-3 font-display text-3xl font-bold">Connectez Supabase pour continuer</h1>
        <p className="mt-3 text-muted-foreground">
          Ajoutez <code>VITE_SUPABASE_URL</code> et <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> dans
          votre fichier d’environnement, puis appliquez la migration.
        </p>
      </div>
    </main>
  );
}

function AccessDenied({ onLogout }: { onLogout: () => void }) {
  return (
    <main className="flex min-h-[calc(100vh-76px)] items-center justify-center px-6 py-16">
      <div className="max-w-lg rounded-lg border border-border bg-card p-8">
        <p className="eyebrow">Accès refusé</p>
        <h1 className="mt-3 font-display text-3xl font-bold">Ce compte n’est pas administrateur</h1>
        <p className="mt-3 text-muted-foreground">
          Ajoutez son UUID dans la table <code>admin_users</code> après la création du compte
          Supabase Auth.
        </p>
        <button
          onClick={onLogout}
          className="mt-6 rounded bg-primary px-4 py-3 font-semibold text-primary-foreground"
        >
          Se déconnecter
        </button>
      </div>
    </main>
  );
}

function Login({
  email,
  password,
  error,
  busy,
  setEmail,
  setPassword,
  onSubmit,
}: {
  email: string;
  password: string;
  error: string;
  busy: boolean;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
}) {
  return (
    <main className="min-h-[calc(100vh-76px)] bg-glow px-6 py-16">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-lg border border-border bg-card shadow-2xl lg:grid-cols-[1fr_0.85fr]">
        <div className="hidden min-h-[560px] flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
          <div>
            <p className="font-display text-2xl font-bold">
              MOROCCO <span className="opacity-70">MEDIA</span>
            </p>
            <p className="mt-24 max-w-sm font-display text-5xl font-bold leading-tight">
              Donnez une scène à chaque histoire.
            </p>
          </div>
          <p className="text-sm opacity-75">Espace de gestion des projets et événements</p>
        </div>
        <div className="p-8 sm:p-12">
          <Link
            to="/"
            className="mb-16 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Retour au site
          </Link>
          <p className="eyebrow">Espace admin</p>
          <h1 className="mt-3 font-display text-4xl font-bold">Content studio</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Ajoutez, publiez et organisez vos réalisations.
          </p>
          <form onSubmit={onSubmit} className="mt-10 grid gap-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold">
                Email administrateur
              </label>
              <input
                id="email"
                required
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold">
                Mot de passe
              </label>
              <input
                id="password"
                required
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={inputClass}
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-red-400">
                {error}
              </p>
            )}
            <button
              disabled={busy}
              className="mt-2 rounded bg-primary px-4 py-3 font-semibold text-primary-foreground transition hover:opacity-90 active:scale-[.99] disabled:opacity-60"
            >
              {busy ? "Connexion…" : "Se connecter"}
            </button>
            <p className="text-center text-xs text-muted-foreground">
              Authentification sécurisée par Supabase Auth
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}

function AdminDashboard({
  onLogout,
  onBack,
  showForm,
  setShowForm,
  editing,
  setEditing,
}: {
  onLogout: () => void;
  onBack: () => void;
  showForm: boolean;
  setShowForm: (value: boolean) => void;
  editing: Project | null;
  setEditing: (value: Project | null) => void;
}) {
  const { projects, loading, setProjects } = useProjects(true);
  const { categories, setCategories } = useCategories();
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [categorySaving, setCategorySaving] = useState(false);
  const publishedCount = projects.filter((project) => project.published).length;
  const handleSaved = (project: Project) => {
    setProjects((current) =>
      sortProjects(
        editing
          ? current.map((item) => (item.id === project.id ? project : item))
          : [...current, project],
      ),
    );
    setEditing(null);
    setShowForm(false);
  };
  const handleDelete = async (project: Project) => {
    if (!window.confirm(`Supprimer « ${project.title} » ?`)) return;
    await deleteProject(project.id);
    setProjects((current) => current.filter((item) => item.id !== project.id));
  };
  const moveProject = async (project: Project, direction: "top" | "bottom") => {
    const sorted = sortProjects(projects);
    const orders = sorted.map((item, index) => item.order ?? index);
    const order = direction === "top" ? Math.min(...orders) - 1 : Math.max(...orders) + 1;
    const updated = await updateProject(project.id, { order });
    setProjects((current) =>
      sortProjects(current.map((item) => (item.id === updated.id ? updated : item))),
    );
  };

  return (
    <main className="min-h-[calc(100vh-76px)] bg-[#100d0d]">
      <div className="mx-auto flex max-w-[1440px] flex-col lg:flex-row">
        <aside className="border-b border-border px-6 py-6 lg:min-h-[calc(100vh-76px)] lg:w-64 lg:border-b-0 lg:border-r lg:px-5">
          <Link to="/" className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Morocco Media" className="h-12 w-auto" />
          </Link>
          <div className="mt-10">
            <p className="eyebrow mb-3 text-[10px]">Workspace</p>
            <div className="flex items-center gap-3 rounded bg-primary/10 px-3 py-3 text-sm font-semibold text-primary">
              <FolderKanban className="h-4 w-4" /> Projets / Events
            </div>
          </div>
          <div className="mt-12 flex items-center justify-between border-t border-border pt-5 lg:mt-auto">
            <div>
              <p className="text-sm font-semibold">Admin</p>
              <p className="text-xs text-muted-foreground">Content manager</p>
            </div>
            <button
              onClick={onLogout}
              aria-label="Se déconnecter"
              className="rounded p-2 text-muted-foreground hover:bg-card hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </aside>
        <section className="min-w-0 flex-1 px-6 py-8 sm:px-10 lg:px-12">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <button
                onClick={onBack}
                className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" /> Voir le site
              </button>
              <p className="eyebrow">Content studio</p>
              <h1 className="mt-2 font-display text-4xl font-bold">Vos réalisations</h1>
              <p className="mt-2 text-muted-foreground">
                Publiez les projets qui donnent vie à votre savoir-faire.
              </p>
            </div>
            <button
              onClick={() => {
                setEditing(null);
                setShowForm(true);
              }}
              className="inline-flex items-center gap-2 rounded bg-primary px-4 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
            >
              <Plus className="h-4 w-4" /> Ajouter un projet
            </button>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            <Stat label="Total projets" value={projects.length} />
            <Stat label="En ligne" value={publishedCount} accent />
            <Stat label="Brouillons" value={projects.length - publishedCount} />
          </div>
          <section className="mt-10 rounded-lg border border-border bg-card p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Organisation</p>
                <h2 className="mt-2 font-display text-xl font-bold">Catégories</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Créez vos catégories ici. Elles seront disponibles dans le formulaire projet.
                </p>
              </div>
              <button
                onClick={() => {
                  setCategoryName("");
                  setCategoryError("");
                  setShowCategoryForm(true);
                }}
                className="inline-flex items-center gap-2 rounded border border-primary px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10"
              >
                <Plus className="h-4 w-4" /> Ajouter une catégorie
              </button>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {categories.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune catégorie pour le moment.</p>
              ) : (
                categories.map((category) => (
                  <span
                    key={category.id}
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-sm"
                  >
                    {category.name}
                  </span>
                ))
              )}
            </div>
          </section>
          <Dialog open={showCategoryForm} onOpenChange={setShowCategoryForm}>
            <DialogContent className="sm:max-w-md">
              <form
                className="grid gap-5"
                onSubmit={async (event) => {
                  event.preventDefault();
                  const name = categoryName.trim();
                  if (!name) return;
                  setCategorySaving(true);
                  setCategoryError("");
                  try {
                    const nextCategory = await createCategory(
                      name,
                      categories.reduce((max, item) => Math.max(max, item.order), -1) + 1,
                    );
                    setCategories((current) => [...current, nextCategory]);
                    setShowCategoryForm(false);
                    setCategoryName("");
                  } catch (caught) {
                    setCategoryError(
                      caught instanceof Error
                        ? caught.message
                        : "Impossible d’ajouter la catégorie.",
                    );
                  } finally {
                    setCategorySaving(false);
                  }
                }}
              >
                <DialogHeader>
                  <p className="eyebrow text-left">Organisation</p>
                  <DialogTitle className="font-display text-2xl">Nouvelle catégorie</DialogTitle>
                  <DialogDescription>
                    Ajoutez une catégorie qui pourra être choisie pour vos projets.
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <label htmlFor="category-name" className="mb-2 block text-sm font-semibold">
                    Nom de la catégorie
                  </label>
                  <input
                    id="category-name"
                    required
                    autoFocus
                    value={categoryName}
                    onChange={(event) => setCategoryName(event.target.value)}
                    className={inputClass}
                    placeholder="Ex. Événement corporate"
                  />
                </div>
                {categoryError && (
                  <p role="alert" className="text-sm text-red-400">
                    {categoryError}
                  </p>
                )}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCategoryForm(false)}
                    className="rounded border border-border px-4 py-2 text-sm font-semibold hover:border-primary"
                  >
                    Annuler
                  </button>
                  <button
                    disabled={categorySaving}
                    className="rounded bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                  >
                    {categorySaving ? "Ajout…" : "Ajouter"}
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog
            open={showForm || Boolean(editing)}
            onOpenChange={(open) => {
              if (!open) {
                setShowForm(false);
                setEditing(null);
              }
            }}
          >
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
              <ProjectForm
                initial={editing}
                categories={categories}
                defaultOrder={
                  projects.reduce((max, project) => Math.max(max, project.order ?? -1), -1) + 1
                }
                onCancel={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
                onSaved={handleSaved}
              />
            </DialogContent>
          </Dialog>
          <div className="mt-10 overflow-hidden rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h2 className="font-display text-xl font-bold">Bibliothèque</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Les changements sont enregistrés dans Supabase.
                </p>
              </div>
              <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                {projects.length} éléments
              </span>
            </div>
            {loading ? (
              <div className="p-8 text-sm text-muted-foreground" aria-busy="true">
                Chargement des projets…
              </div>
            ) : projects.length === 0 ? (
              <div className="p-10 text-center">
                <ImagePlus className="mx-auto h-8 w-8 text-primary" />
                <h3 className="mt-3 font-display text-xl font-bold">Votre bibliothèque est vide</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Ajoutez votre première réalisation pour la rendre visible sur le site.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {sortProjects(projects).map((project, index, orderedProjects) => (
                  <ProjectRow
                    key={project.id}
                    project={project}
                    onEdit={() => {
                      setEditing(project);
                      setShowForm(false);
                    }}
                    onDelete={() => void handleDelete(project)}
                    isFirst={index === 0}
                    isLast={index === orderedProjects.length - 1}
                    onMoveTop={() => void moveProject(project, "top")}
                    onMoveBottom={() => void moveProject(project, "bottom")}
                    onToggle={async () => {
                      const updated = await updateProject(project.id, {
                        published: !project.published,
                      });
                      setProjects((current) =>
                        current.map((item) => (item.id === updated.id ? updated : item)),
                      );
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="rounded border border-border bg-card px-5 py-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-2 font-display text-3xl font-bold ${accent ? "text-primary" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function ProjectRow({
  project,
  onEdit,
  onDelete,
  onToggle,
  isFirst,
  isLast,
  onMoveTop,
  onMoveBottom,
}: {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
  isFirst: boolean;
  isLast: boolean;
  onMoveTop: () => void;
  onMoveBottom: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
      <img src={project.image} alt="" className="h-20 w-28 rounded object-cover" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate font-semibold">{project.title}</h3>
          <span
            className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${project.published ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}
          >
            {project.published ? "En ligne" : "Brouillon"}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{project.category}</p>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onMoveTop}
          disabled={isFirst}
          aria-label={`Déplacer ${project.title} en haut`}
          className="rounded p-2 text-muted-foreground hover:bg-background hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ArrowUpToLine className="h-4 w-4" />
        </button>
        <button
          onClick={onMoveBottom}
          disabled={isLast}
          aria-label={`Déplacer ${project.title} en bas`}
          className="rounded p-2 text-muted-foreground hover:bg-background hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ArrowDownToLine className="h-4 w-4" />
        </button>
        <button
          onClick={onToggle}
          aria-label={project.published ? `Dépublier ${project.title}` : `Publier ${project.title}`}
          className="rounded p-2 text-muted-foreground hover:bg-background hover:text-primary"
        >
          {project.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
        <button
          onClick={onEdit}
          className="rounded px-3 py-2 text-sm font-semibold hover:bg-background"
        >
          Modifier
        </button>
        <button
          onClick={onDelete}
          aria-label={`Supprimer ${project.title}`}
          className="rounded p-2 text-muted-foreground hover:bg-background hover:text-red-400"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function ProjectForm({
  initial,
  categories,
  defaultOrder,
  onCancel,
  onSaved,
}: {
  initial: Project | null;
  categories: ProjectCategory[];
  defaultOrder: number;
  onCancel: () => void;
  onSaved: (project: Project) => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(initial?.image ?? "");
  const [published, setPublished] = useState(initial?.published ?? true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!imageFile) return;
    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const uploadedImage = imageFile ? await fileToDataUrl(imageFile) : image;
      if (!uploadedImage) throw new Error("Ajoutez une image avant d’enregistrer.");
      const project = initial
        ? await updateProject(initial.id, {
            title,
            category,
            description,
            image: uploadedImage,
            published,
          })
        : await createProject({
            title,
            category,
            description,
            image: uploadedImage,
            published,
            order: defaultOrder,
          });
      onSaved(project);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Une erreur est survenue.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <form onSubmit={submit} className="grid gap-5">
      <DialogHeader>
        <p className="eyebrow text-left">{initial ? "Modifier" : "Nouveau projet"}</p>
        <DialogTitle className="font-display text-2xl">
          {initial ? initial.title : "Ajouter une réalisation"}
        </DialogTitle>
        <DialogDescription>
          Ajoutez les informations qui seront visibles sur la page Projets / Events.
        </DialogDescription>
      </DialogHeader>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="project-title" className="mb-2 block text-sm font-semibold">
            Nom du projet
          </label>
          <input
            id="project-title"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className={inputClass}
            placeholder="Ex. Soirée de lancement"
          />
        </div>
        <div>
          <label htmlFor="project-category" className="mb-2 block text-sm font-semibold">
            Catégorie
          </label>
          <select
            id="project-category"
            required
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className={inputClass}
          >
            <option value="">Choisir une catégorie</option>
            {initial?.category && !categories.some((item) => item.name === initial.category) && (
              <option value={initial.category}>{initial.category} (actuelle)</option>
            )}
            {categories.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          {categories.length === 0 && !initial && (
            <p className="mt-2 text-xs text-muted-foreground">
              Ajoutez d’abord une catégorie dans la section Organisation.
            </p>
          )}
        </div>
        <div className="md:col-span-2">
          <label htmlFor="project-image" className="mb-2 block text-sm font-semibold">
            Image du projet
          </label>
          <input
            id="project-image"
            required={!image}
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              setImageFile(file);
              if (file) setImage("");
            }}
            className={inputClass}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Choisissez une image depuis votre ordinateur. Elle sera prévisualisée puis stockée
            temporairement en Blob/data URL avant son stockage dans Supabase.
          </p>
          {imagePreview && (
            <div className="mt-4 flex items-center gap-4 rounded border border-border bg-background p-3">
              <img
                src={imagePreview}
                alt="Aperçu du projet"
                className="h-20 w-28 rounded object-cover"
              />
              <div>
                <p className="text-sm font-semibold">{imageFile?.name ?? "Image actuelle"}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {imageFile
                    ? `${Math.ceil(imageFile.size / 1024)} Ko`
                    : "Conservée jusqu’à son remplacement"}
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="md:col-span-2">
          <label htmlFor="project-description" className="mb-2 block text-sm font-semibold">
            Description
          </label>
          <textarea
            id="project-description"
            required
            rows={4}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className={inputClass}
            placeholder="Décrivez l’impact et le rôle de l’agence…"
          />
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
        <label className="inline-flex items-center gap-3 text-sm font-semibold">
          <input
            type="checkbox"
            checked={published}
            onChange={(event) => setPublished(event.target.checked)}
            className="h-4 w-4 accent-[var(--primary)]"
          />{" "}
          Publier sur le site
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-border px-4 py-2 text-sm font-semibold hover:border-primary"
          >
            Annuler
          </button>
          <button
            disabled={saving}
            className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {saving ? (
              "Enregistrement…"
            ) : (
              <>
                <Check className="h-4 w-4" /> Enregistrer
              </>
            )}
          </button>
        </div>
      </div>
      {error && (
        <p role="alert" className="mt-4 text-sm text-red-400">
          {error}
        </p>
      )}
    </form>
  );
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("Impossible de lire cette image."));
    reader.readAsDataURL(file);
  });
}
