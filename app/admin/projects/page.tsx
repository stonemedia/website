"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase.client";
import { CATEGORIES_BY_SERVICE, SERVICE_SLUGS } from "@/lib/taxonomy";
import type { ProjectDoc } from "@/lib/types";
import Link from "next/link";

type Row = { id: string; data: ProjectDoc };

export default function AdminProjectsPage() {
  const [serviceSlug, setServiceSlug] = useState<string>("dubbing-localization");
  const [categorySlug, setCategorySlug] = useState<string>("ott-dubbing");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = useMemo(() => {
    return (CATEGORIES_BY_SERVICE as any)[serviceSlug] ?? [];
  }, [serviceSlug]);

  useEffect(() => {
    if (!categories.includes(categorySlug)) setCategorySlug(categories[0] ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceSlug]);

  const load = async () => {
  setLoading(true);

  const q = query(
    collection(db, "projects"),
    where("serviceSlug", "==", serviceSlug),
    where("categorySlug", "==", categorySlug),
    orderBy("order", "asc")
  );

  const snap = await getDocs(q);
  const list: Row[] = snap.docs.map((d) => ({
    id: d.id,
    data: d.data() as ProjectDoc,
  }));

  setRows(list);
  setLoading(false);
};

  useEffect(() => {
    if (!serviceSlug || !categorySlug) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceSlug, categorySlug]);

  const swapOrder = async (a: Row, b: Row) => {
    const aRef = doc(db, "projects", a.id);
    const bRef = doc(db, "projects", b.id);

    const aOrder = a.data.order;
    const bOrder = b.data.order;

    // optimistic UI
    setRows((prev) => {
      const copy = [...prev];
      const ai = copy.findIndex((x) => x.id === a.id);
      const bi = copy.findIndex((x) => x.id === b.id);
      if (ai === -1 || bi === -1) return prev;
      copy[ai] = { ...a, data: { ...a.data, order: bOrder } };
      copy[bi] = { ...b, data: { ...b.data, order: aOrder } };
      copy.sort((x, y) => x.data.order - y.data.order);
      return copy;
    });

    await Promise.all([
      updateDoc(aRef, { order: bOrder }),
      updateDoc(bRef, { order: aOrder }),
    ]);
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="mt-1 text-white/70 text-sm">
            Filter and order demos per service/category.
          </p>
        </div>

        <div className="flex gap-3">
          <div>
            <div className="text-xs text-white/60 mb-1">Service</div>
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

          <div>
            <div className="text-xs text-white/60 mb-1">Category</div>
            <select
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className="rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm"
            >
              {categories.map((c: string) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={load}
            className="h-[40px] self-end rounded-xl border border-white/15 bg-white/10 px-4 text-sm hover:bg-white/15"
          >
            Refresh
          </button>
        </div>
      </div>
      
      <Link
  href="/admin/projects/new"
  className="h-[40px] self-end rounded-xl border border-white/15 bg-white/10 px-4 text-sm hover:bg-white/15 flex items-center"
>
  + New
</Link>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5">
        <div className="grid grid-cols-12 gap-3 border-b border-white/10 px-4 py-3 text-xs text-white/60">
          <div className="col-span-1">Order</div>
          <div className="col-span-5">Title</div>
          <div className="col-span-3">Slug</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>

        {loading ? (
          <div className="px-4 py-10 text-white/70">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="px-4 py-10 text-white/70">
            No projects found in this category yet.
          </div>
        ) : (
          rows.map((r, idx) => (
            <div
              key={r.id}
              className="grid grid-cols-12 gap-3 px-4 py-3 border-t border-white/10"
            >
              <div className="col-span-1 text-sm text-white/70">
                {r.data.order}
              </div>

              <div className="col-span-5">
  		<Link href={`/admin/projects/${r.id}`} className="text-sm font-medium hover:underline">
    		{r.data.title}
  		</Link>
  		<div className="text-xs text-white/60">{r.data.status}</div>
		</div>

              <div className="col-span-3 text-sm text-white/70">
  <Link href={`/admin/projects/${r.id}`} className="hover:underline">
    {r.data.slug}
  </Link>
</div>

              <div className="col-span-3 flex justify-end gap-2">
                <button
                  disabled={idx === 0}
                  onClick={() => swapOrder(r, rows[idx - 1])}
                  className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs hover:bg-white/15 disabled:opacity-40"
                >
                  ↑ Up
                </button>

                <button
                  disabled={idx === rows.length - 1}
                  onClick={() => swapOrder(r, rows[idx + 1])}
                  className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs hover:bg-white/15 disabled:opacity-40"
                >
                  ↓ Down
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}