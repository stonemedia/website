"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";

import { db, storage } from "@/lib/firebase.client";
import { CATEGORIES_BY_SERVICE } from "@/lib/taxonomy";
import { uploadFileToPath } from "@/lib/storageUpload";

type PosterCredit = {
  id: string;
  title?: string;
  categorySlug?: string;
  group?: "movies" | "series" | string;
  imagePath?: string;
  imageUrl?: string;
  services?: string[];
  order?: number;
  status?: "draft" | "published" | "archived" | string;
};

const GROUP_OPTIONS = [
  { value: "movies", label: "Movies" },
  { value: "series", label: "Series" },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function servicesTextToArray(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function servicesArrayToText(value?: string[]) {
  return Array.isArray(value) ? value.join(", ") : "";
}

export default function PosterCreditsPage() {
  const categoryOptions = useMemo(() => {
    const values = Object.values(
      CATEGORIES_BY_SERVICE as Record<string, string[]>
    ).flat();

    return Array.from(new Set(values)).sort();
  }, []);

  const [items, setItems] = useState<PosterCredit[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [categorySlug, setCategorySlug] = useState("ott-dubbing");
  const [group, setGroup] = useState("movies");
  const [servicesText, setServicesText] = useState("");
  const [order, setOrder] = useState<number>(1000);
  const [status, setStatus] = useState<"draft" | "published" | "archived">(
    "draft"
  );

  const [imagePath, setImagePath] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [posterFile, setPosterFile] = useState<File | null>(null);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadItems = async () => {
    setLoading(true);
    setError(null);

    try {
      const snap = await getDocs(collection(db, "posterCredits"));

      const list = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      })) as PosterCredit[];

      list.sort((a, b) => {
        const cat = String(a.categorySlug ?? "").localeCompare(
          String(b.categorySlug ?? "")
        );

        if (cat !== 0) return cat;

        const groupCompare = String(a.group ?? "").localeCompare(
          String(b.group ?? "")
        );

        if (groupCompare !== 0) return groupCompare;

        return (a.order ?? 1000) - (b.order ?? 1000);
      });

      setItems(list);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load poster credits.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setCategorySlug("ott-dubbing");
    setGroup("movies");
    setServicesText("");
    setOrder(1000);
    setStatus("draft");
    setImagePath("");
    setImageUrl("");
    setPosterFile(null);
    setUploadProgress(0);
    setError(null);
  };

  const editItem = (item: PosterCredit) => {
    setEditingId(item.id);
    setTitle(item.title ?? "");
    setCategorySlug(item.categorySlug ?? "ott-dubbing");
    setGroup(item.group ?? "movies");
    setServicesText(servicesArrayToText(item.services));
    setOrder(typeof item.order === "number" ? item.order : 1000);
    setStatus((item.status as any) ?? "draft");
    setImagePath(item.imagePath ?? "");
    setImageUrl(item.imageUrl ?? "");
    setPosterFile(null);
    setUploadProgress(0);
    setError(null);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const uploadPosterIfNeeded = async () => {
    if (!posterFile) {
      return {
        imagePath,
        imageUrl,
      };
    }

    const safeTitle = slugify(title || "poster");
    const ext = posterFile.name.split(".").pop() || "jpg";
    const path = `poster-credits/${safeTitle}-${Date.now()}.${ext}`;

    await uploadFileToPath(path, posterFile, setUploadProgress);

    const url = await getDownloadURL(ref(storage, path));

    return {
      imagePath: path,
      imageUrl: url,
    };
  };

  const saveItem = async () => {
    if (saving) return;

    setSaving(true);
    setError(null);

    try {
      const cleanTitle = title.trim();

      if (!cleanTitle) {
        throw new Error("Title is required.");
      }

      if (!posterFile && !imageUrl.trim()) {
        throw new Error("Please upload a poster image.");
      }

      const uploaded = await uploadPosterIfNeeded();

      const payload = {
        title: cleanTitle,
        categorySlug,
        group,
        services: servicesTextToArray(servicesText),
        order: Number(order),
        status,
        imagePath: uploaded.imagePath,
        imageUrl: uploaded.imageUrl,
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(db, "posterCredits", editingId), payload);
      } else {
        await addDoc(collection(db, "posterCredits"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
      }

      await loadItems();
      resetForm();
    } catch (e: any) {
      setError(e?.message ?? "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const archiveItem = async (item: PosterCredit) => {
    if (!confirm(`Archive "${item.title}"?`)) return;

    try {
      await updateDoc(doc(db, "posterCredits", item.id), {
        status: "archived",
        updatedAt: serverTimestamp(),
      });

      await loadItems();

      if (editingId === item.id) {
        resetForm();
      }
    } catch (e: any) {
      setError(e?.message ?? "Archive failed.");
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Poster Credits</h1>

          <p className="mt-2 max-w-2xl text-sm text-white/70">
            Manage poster grids for selected movies and series. Upload poster
            images, assign category, add scope tags, order them, and publish.
          </p>
        </div>

        <button
          type="button"
          onClick={resetForm}
          className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
        >
          New Poster Credit
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold">
          {editingId ? "Edit Poster Credit" : "Add Poster Credit"}
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-xs text-white/60">Title</label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Dasara"
              className="rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-xs text-white/60">Category</label>

            <select
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className="rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm"
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <label className="text-xs text-white/60">Group</label>

            <select
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm"
            >
              {GROUP_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <label className="text-xs text-white/60">Status</label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm"
            >
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </select>
          </div>

          <div className="grid gap-2">
            <label className="text-xs text-white/60">
              Order lower shows first
            </label>

            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-xs text-white/60">Poster image</label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPosterFile(e.target.files?.[0] ?? null)}
              className="text-sm text-white/80"
            />

            {uploadProgress > 0 && (
              <div className="text-xs text-white/60">
                Upload: {uploadProgress}%
              </div>
            )}
          </div>

          <div className="grid gap-2 md:col-span-2">
            <label className="text-xs text-white/60">
              Scope tags comma-separated
            </label>

            <input
              value={servicesText}
              onChange={(e) => setServicesText(e.target.value)}
              placeholder="Turnkey Hindi Dubbing, Mix, Voice Casting"
              className="rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm"
            />
          </div>
        </div>

        {imageUrl && (
          <div className="mt-6">
            <div className="mb-2 text-xs text-white/60">Current poster</div>

            <img
              src={imageUrl}
              alt={title || "Poster preview"}
              className="h-56 rounded-xl border border-white/10 object-cover"
            />
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={saveItem}
            disabled={saving}
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm hover:bg-white/15 disabled:opacity-50"
          >
            {saving ? "Saving…" : editingId ? "Update Poster Credit" : "Create Poster Credit"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm hover:bg-white/10"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Existing Poster Credits</h2>

        {loading && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
            Loading…
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
            No poster credits yet.
          </div>
        )}

        <div className="mt-4 grid gap-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:grid-cols-[96px_1fr_auto]"
            >
              <div>
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title ?? "Poster"}
                    className="aspect-[2/3] w-24 rounded-xl object-cover"
                  />
                ) : (
                  <div className="aspect-[2/3] w-24 rounded-xl bg-black/40" />
                )}
              </div>

              <div>
                <div className="text-base font-semibold">
                  {item.title ?? "Untitled"}
                </div>

                <div className="mt-1 text-xs uppercase tracking-[0.2em] text-white/45">
                  {item.categorySlug} · {item.group} · {item.status}
                </div>

                <div className="mt-2 text-sm text-white/60">
                  Order: {item.order ?? 1000}
                </div>

                {Array.isArray(item.services) && item.services.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.services.map((service) => (
                      <span
                        key={service}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-white/65"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 md:flex-col">
                <button
                  type="button"
                  onClick={() => editItem(item)}
                  className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
                >
                  Edit
                </button>

                {item.status !== "archived" && (
                  <button
                    type="button"
                    onClick={() => archiveItem(item)}
                    className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200 hover:bg-red-500/15"
                  >
                    Archive
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}