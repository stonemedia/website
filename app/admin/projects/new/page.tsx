"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase.client";
import { CATEGORIES_BY_SERVICE, SERVICE_SLUGS } from "@/lib/taxonomy";
import type { ProjectStatus } from "@/lib/types";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function NewProjectPage() {
  const router = useRouter();

  const [serviceSlug, setServiceSlug] = useState("dubbing-localization");
  const categories = useMemo(
    () => ((CATEGORIES_BY_SERVICE as any)[serviceSlug] ?? []) as string[],
    [serviceSlug]
  );
  const [categorySlug, setCategorySlug] = useState("ott-dubbing");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("draft");
  const [year, setYear] = useState<string>("");
  const [meta, setMeta] = useState("");
  const [languages, setLanguages] = useState("hi,bn,ta"); // comma-separated
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categories.includes(categorySlug)) setCategorySlug(categories[0] ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceSlug]);

  useEffect(() => {
    // auto slug from title only if slug empty or matches old slugified title
    if (!title) return;
    if (!slug) setSlug(slugify(title));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  const computeNextOrder = async () => {
    const q = query(
      collection(db, "projects"),
      where("serviceSlug", "==", serviceSlug),
      where("categorySlug", "==", categorySlug),
      orderBy("order", "desc"),
      limit(1)
    );
    const snap = await getDocs(q);
    const last = snap.docs[0]?.data()?.order as number | undefined;
    const base = Number.isFinite(last) ? (last as number) : 0;
    return base + 1000;
  };

  const onCreate = async () => {
    setError(null);

    if (!serviceSlug || !categorySlug) return setError("Select service and category.");
    if (!title.trim()) return setError("Title is required.");
    if (!slug.trim()) return setError("Slug is required.");

    setSaving(true);
    try {
      const nextOrder = await computeNextOrder();

      const langs = languages
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload: any = {
  title: title.trim(),
  slug: slug.trim(),
  serviceSlug,
  categorySlug,
  status,
  order: nextOrder,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
};

const y = year.trim();
if (y) payload.year = Number(y);

const m = meta.trim();
if (m) payload.meta = m;

if (langs.length) payload.languages = langs;

// Firestore is creating successfully for you, but the ack is slow sometimes.
// So: start the write, don’t block the UI, redirect immediately.
addDoc(collection(db, "projects"), payload).catch((e) => {
  console.error("Create failed:", e);
});

router.push("/admin/projects");
    } catch (e: any) {
  console.error("Create failed:", e);
  setError(e?.message ?? "Failed to create project.");
  setSaving(false);
}
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">New Project</h1>
          <p className="mt-1 text-white/70 text-sm">Create a demo item for a service/category.</p>
        </div>
        <button
          onClick={() => router.push("/admin/projects")}
          className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
        >
          Back
        </button>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-xs text-white/60">Service</label>
            <select
              value={serviceSlug}
              onChange={(e) => setServiceSlug(e.target.value)}
              className="rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm"
            >
              {SERVICE_SLUGS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <label className="text-xs text-white/60">Category</label>
            <select
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className="rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <label className="text-xs text-white/60">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Micro Drama 1"
              className="rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-xs text-white/60">Slug (unique)</label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="micro-drama-1"
              className="rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm"
            />
            <div className="text-xs text-white/50">
              URL-safe id. Used for storage folder later: <span className="text-white/70">projects/&lt;slug&gt;/...</span>
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-xs text-white/60">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              className="rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm"
            >
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </select>
          </div>

          <div className="grid gap-2">
            <label className="text-xs text-white/60">Year (optional)</label>
            <input
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2026"
              className="rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-xs text-white/60">Meta (optional)</label>
            <input
              value={meta}
              onChange={(e) => setMeta(e.target.value)}
              placeholder="Hindi + Bengali + Tamil"
              className="rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-xs text-white/60">Languages (comma-separated, optional)</label>
            <input
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
              placeholder="hi,bn,ta"
              className="rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm"
            />
          </div>

          <button
            onClick={onCreate}
            disabled={saving}
            className="mt-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm hover:bg-white/15 disabled:opacity-50"
          >
            {saving ? "Creating…" : "Create Project"}
          </button>
        </div>
      </div>
    </main>
  );
}