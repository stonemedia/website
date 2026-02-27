"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase.client";
import { CATEGORIES_BY_SERVICE, SERVICE_SLUGS } from "@/lib/taxonomy";
import type { ProjectDoc, ProjectStatus } from "@/lib/types";
import { uploadFileToPath } from "@/lib/storageUpload";

type AudioRow = {
  id: string;
  lang: string;
  file: File | null;
  progress: number;
};

export default function EditProjectPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [serviceSlug, setServiceSlug] = useState("dubbing-localization");
  const categories = useMemo(
    () => ((CATEGORIES_BY_SERVICE as any)[serviceSlug] ?? []) as string[],
    [serviceSlug]
  );
  const [categorySlug, setCategorySlug] = useState("ott-dubbing");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("draft");
  const [order, setOrder] = useState<number>(1000);

  const [year, setYear] = useState<string>("");
  const [meta, setMeta] = useState("");
  const [languages, setLanguages] = useState(""); // comma-separated
  const [hlsPath, setHlsPath] = useState("");
  const [building, setBuilding] = useState(false);

  // Source upload state
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioRows, setAudioRows] = useState<AudioRow[]>([
    { id: crypto.randomUUID(), lang: "hi", file: null, progress: 0 },
  ]);
  const [videoProgress, setVideoProgress] = useState(0);
  const [uploadingSources, setUploadingSources] = useState(false);
  const [buildStatus, setBuildStatus] = useState<string>("idle");
  const [buildError, setBuildError] = useState<string>("");

  // Keep category valid when service changes
  useEffect(() => {
    if (!categories.includes(categorySlug)) {
      setCategorySlug(categories[0] ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceSlug, categories]);

  // Load project
  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const ref = doc(db, "projects", id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setError("Project not found.");
          return;
        }

        const data = snap.data() as ProjectDoc;

        setTitle(data.title ?? "");
        setSlug(data.slug ?? "");
        setStatus((data.status ?? "draft") as ProjectStatus);
        setOrder(typeof data.order === "number" ? data.order : 1000);

        setServiceSlug(data.serviceSlug ?? "dubbing-localization");
        setCategorySlug(data.categorySlug ?? "ott-dubbing");

        setYear(data.year ? String(data.year) : "");
        setMeta(data.meta ?? "");
        setLanguages(Array.isArray(data.languages) ? data.languages.join(",") : "");
        setHlsPath(data.hlsPath ?? "");
        setBuildStatus((data as any).buildStatus ?? "idle");
        setBuildError((data as any).buildError ?? "");
      } catch (e: any) {
        setError(e?.message ?? "Failed to load project.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [id]);
useEffect(() => {
  if (buildStatus !== "building") return;

  const interval = setInterval(async () => {
    const snap = await getDoc(doc(db, "projects", id));
    if (snap.exists()) {
      const data: any = snap.data();
      setBuildStatus(data.buildStatus ?? "idle");
      setBuildError(data.buildError ?? "");
    }
  }, 3000);

  return () => clearInterval(interval);
}, [buildStatus, id]);

  // ---------- CMS actions ----------

  const onSave = async () => {
    if (saving) return;
    setSaving(true);
    setError(null);

    try {
      const ref = doc(db, "projects", id);

      const payload: any = {
        title: title.trim(),
        slug: slug.trim(),
        serviceSlug,
        categorySlug,
        status,
        order: Number(order),
        updatedAt: serverTimestamp(),
      };

      const y = year.trim();
      if (y) payload.year = Number(y);

      const m = meta.trim();
      if (m) payload.meta = m;

      const langs = languages
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (langs.length) payload.languages = langs;

      const hp = hlsPath.trim();
      if (hp) payload.hlsPath = hp;

      await updateDoc(ref, payload);
      router.push("/admin/projects");
    } catch (e: any) {
      setError(e?.message ?? "Save failed.");
      setSaving(false);
    }
  };

  const onArchive = async () => {
    if (!confirm("Archive this project? It will disappear from the website list.")) return;

    try {
      await updateDoc(doc(db, "projects", id), {
        status: "archived",
        updatedAt: serverTimestamp(),
      });
      router.push("/admin/projects");
    } catch (e: any) {
      setError(e?.message ?? "Archive failed.");
    }
  };

  const onReplace = async () => {
    const newTitle = prompt("New project title (will replace this in same position):");
    if (!newTitle) return;

    const newSlug = prompt("New slug (unique):", "");
    if (!newSlug) return;

    try {
      // 1) Create new project with SAME service/category/order
      await addDoc(collection(db, "projects"), {
        title: newTitle.trim(),
        slug: newSlug.trim(),
        serviceSlug,
        categorySlug,
        status: "draft", // publish later after build
        order: Number(order),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // 2) Archive old
      await updateDoc(doc(db, "projects", id), {
        status: "archived",
        updatedAt: serverTimestamp(),
      });

      router.push("/admin/projects");
    } catch (e: any) {
      setError(e?.message ?? "Replace failed.");
    }
  };

  // ---------- Source upload helpers ----------

  const addAudioRow = () => {
    setAudioRows((prev) => [
      ...prev,
      { id: crypto.randomUUID(), lang: "bn", file: null, progress: 0 },
    ]);
  };

  const removeAudioRow = (rowId: string) => {
    setAudioRows((prev) => prev.filter((r) => r.id !== rowId));
  };

  const setAudioLang = (rowId: string, lang: string) => {
    setAudioRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, lang } : r)));
  };

  const setAudioFile = (rowId: string, file: File | null) => {
    setAudioRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, file, progress: 0 } : r))
    );
  };

  const onUploadSources = async () => {
    if (uploadingSources) return;
    setError(null);

    const cleanSlug = slug.trim();
    if (!cleanSlug) {
      setError("Slug is required before uploading sources.");
      return;
    }

    if (!videoFile) {
      setError("Please select a video-only file.");
      return;
    }

    const chosen = audioRows.filter((r) => r.file);
    if (chosen.length === 0) {
      setError("Please add at least 1 audio file.");
      return;
    }

    // no duplicate languages
    const langs = chosen.map((r) => r.lang.trim()).filter(Boolean);
    const dup = langs.find((l, i) => langs.indexOf(l) !== i);
    if (dup) {
      setError(`Duplicate language selected: ${dup}. Each audio must have a unique language.`);
      return;
    }

    setUploadingSources(true);
    setVideoProgress(0);

    try {
      // 1) upload video
      const videoExt = videoFile.name.split(".").pop() || "mp4";
      const videoPath = `sources/${cleanSlug}/video.${videoExt}`;

      await uploadFileToPath(videoPath, videoFile, setVideoProgress);

      // 2) upload audio files
      const audioMap: Record<string, string> = {};

      for (const row of chosen) {
        const f = row.file!;
        const ext = f.name.split(".").pop() || "wav";
        const audioPath = `sources/${cleanSlug}/audio/${row.lang}.${ext}`;

        await uploadFileToPath(audioPath, f, (pct) => {
          setAudioRows((prev) =>
            prev.map((r) => (r.id === row.id ? { ...r, progress: pct } : r))
          );
        });

        audioMap[row.lang] = audioPath;
      }

      // 3) store paths on the project doc
      await updateDoc(doc(db, "projects", id), {
        sourceVideoPath: videoPath,
        sourceAudioPaths: audioMap,
        buildStatus: "idle",
        updatedAt: serverTimestamp(),
      });

      // Done
      setVideoProgress(100);
    } catch (e: any) {
      setError(e?.message ?? "Upload sources failed.");
    } finally {
      setUploadingSources(false);
    }
  };

const onBuildHls = async () => {
  if (building) return;
  setBuilding(true);
  setError(null);

  try {
    const res = await fetch("/api/admin/build-hls", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ projectId: id }),
    });

    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.error || "Build failed");

    router.push("/admin/projects");
  } catch (e: any) {
    setError(e?.message ?? "Build failed");
    setBuilding(false);
  }
};

  // ---------- Render ----------

  if (loading) {
    return <main className="p-10 text-white">Loading…</main>;
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Edit Project</h1>
          <p className="mt-1 text-white/70 text-sm">
            Update metadata, HLS path, status, and ordering.
          </p>
        </div>

        <div className="flex gap-2 flex-wrap justify-end">
          <button
            type="button"
            onClick={() => router.push("/admin/projects")}
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
          >
            Back
          </button>

          <button
            type="button"
            onClick={onReplace}
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
          >
            Replace (same position)
          </button>

          <button
            type="button"
            onClick={onArchive}
            className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm hover:bg-red-500/15 text-red-200"
          >
            Archive
          </button>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
  <span className="text-xs text-white/60">Build:</span>
  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs">
    {buildStatus}
  </span>
  {buildStatus === "error" && buildError ? (
    <span className="text-xs text-red-200">{buildError}</span>
  ) : null}
</div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 grid gap-4">
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
            className="rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-xs text-white/60">Slug</label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm"
          />
          <div className="text-xs text-white/50">
            Used for storage folder: projects/&lt;slug&gt;/...
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
          <label className="text-xs text-white/60">Order (lower shows first)</label>
          <input
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            type="number"
            className="rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-xs text-white/60">Year (optional)</label>
          <input
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-xs text-white/60">Meta (optional)</label>
          <input
            value={meta}
            onChange={(e) => setMeta(e.target.value)}
            className="rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-xs text-white/60">Languages (comma-separated)</label>
          <input
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
            placeholder="hi,bn,ta"
            className="rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-xs text-white/60">HLS Path (Storage path)</label>
          <input
            value={hlsPath}
            onChange={(e) => setHlsPath(e.target.value)}
            placeholder="projects/micro-drama-1/master.m3u8"
            className="rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm"
          />
          <div className="text-xs text-white/50">
            Example: <span className="text-white/70">projects/&lt;slug&gt;/master.m3u8</span>
          </div>
        </div>

        {/* Upload Sources */}
        <div className="mt-2 rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="text-sm font-semibold">Upload Sources</div>
          <div className="mt-1 text-xs text-white/60">
            Upload video-only + per-language audio. HLS will be built automatically in the next step.
          </div>

          <div className="mt-4 grid gap-2">
            <label className="text-xs text-white/60">Video-only file</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
              className="text-sm text-white/80"
            />
            {videoProgress > 0 && (
              <div className="text-xs text-white/60">Video upload: {videoProgress}%</div>
            )}
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/60">Audio files</div>
              <button
                type="button"
                onClick={addAudioRow}
                className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs hover:bg-white/15"
              >
                + Add audio
              </button>
            </div>

            <div className="mt-3 grid gap-3">
              {audioRows.map((r) => (
                <div key={r.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="grid gap-2 md:grid-cols-3 md:items-center">
                    <div>
                      <div className="text-xs text-white/60 mb-1">Language</div>
                      <select
                        value={r.lang}
                        onChange={(e) => setAudioLang(r.id, e.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm"
                      >
                        <option value="hi">hi (Hindi)</option>
                        <option value="bn">bn (Bengali)</option>
                        <option value="ta">ta (Tamil)</option>
                        <option value="en">en (English)</option>
                        <option value="te">te (Telugu)</option>
                        <option value="mr">mr (Marathi)</option>
                        <option value="gu">gu (Gujarati)</option>
                        <option value="kn">kn (Kannada)</option>
                        <option value="ml">ml (Malayalam)</option>
                        <option value="pa">pa (Punjabi)</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <div className="text-xs text-white/60 mb-1">Audio file</div>
                      <div className="flex gap-2 items-center">
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={(e) => setAudioFile(r.id, e.target.files?.[0] ?? null)}
                          className="flex-1 text-sm text-white/80"
                        />

                        <button
                          type="button"
                          onClick={() => removeAudioRow(r.id)}
                          className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs hover:bg-white/15"
                        >
                          Remove
                        </button>
                      </div>

                      {r.progress > 0 && (
                        <div className="text-xs text-white/60 mt-1">Audio upload: {r.progress}%</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={onUploadSources}
              disabled={uploadingSources}
              className="mt-4 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm hover:bg-white/15 disabled:opacity-50"
            >
              {uploadingSources ? "Uploading…" : "Upload Sources"}
            </button>
          </div>
        </div>
<button
  type="button"
  onClick={onBuildHls}
  disabled={building}
  className="mt-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm hover:bg-white/15 disabled:opacity-50"
>
  {building ? "Building HLS…" : "Build HLS"}
</button>

        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="mt-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm hover:bg-white/15 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </main>
  );
}
