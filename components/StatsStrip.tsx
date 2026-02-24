const STATS = [
  { k: "18+", v: "Years in post-production" },
  { k: "10+", v: "Indian languages delivered" },
  { k: "1500h+", v: "Scale-ready content pipelines" },
  { k: "QC", v: "Multi-stage checks + platform specs" },
];

export default function StatsStrip() {
  return (
    <section className="bg-[#07080B]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-3 md:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={i}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <div className="text-2xl font-semibold text-white">{s.k}</div>
              <div className="mt-2 text-sm text-white/65">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}