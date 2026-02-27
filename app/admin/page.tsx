import Link from "next/link";

export default function AdminHome() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-semibold">CMS Dashboard</h1>
      <p className="mt-2 text-white/70">Manage demos, ordering, and uploads.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/projects"
          className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10"
        >
          <div className="text-lg font-semibold">Projects</div>
          <div className="mt-1 text-sm text-white/70">
            Filter by service/category, reorder, publish.
          </div>
        </Link>
      </div>
    </main>
  );
}