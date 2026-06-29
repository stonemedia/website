const DEFAULT_LOGOS = [
  "Rajshri Entertainment",
  "Sony",
  "Zee",
  "TATA Play",
  "Hungama",
  "Briliant Wellness TV",
  "Sa Re Ga Ma",
  "Tata Consultancy Services",
  "GREY",
  "Dora Digs",
  "Ele Pictures",
  "Dashverse",
];

export default function TrustedByStrip({ items = DEFAULT_LOGOS }: { items?: string[] }) {
  const row = [...items, ...items];

  return (
    <section className="border-y border-white/10 bg-black/20">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="mb-3 text-xs tracking-widest text-white/50">TRUSTED BY</div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="flex w-max gap-3 py-4 [animation:marquee_22s_linear_infinite]">
            {row.map((t, i) => (
              <div
                key={`${t}-${i}`}
                className="shrink-0 rounded-full border border-white/10 bg-black/25 px-4 py-2 text-sm text-white/70"
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}