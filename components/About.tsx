export default function About() {
  return (
    <section className="bg-[#030509]">
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#A0A0A0]">
              About
            </p>

            <h2 className="mt-4 text-3xl md:text-4xl uppercase tracking-[0.14em]">
              Built for scale, tuned for craft.
            </h2>

            <p className="mt-5 text-sm md:text-base text-[#A0A0A0] leading-relaxed">
              Stone Media combines human performance with modern pipelines —
              from creative adaptation to QC to delivery specs. We don’t just
              localize content. We engineer it for markets.
            </p>

            <div className="mt-8 grid gap-3">
              <div className="border border-[#1A1A1A] bg-[#0A0A0A] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[#A0A0A0]">
                  What we optimize for
                </p>
                <p className="mt-2 text-sm text-[#A0A0A0]">
                  Consistency · Sync · QC discipline · Platform readiness
                </p>
              </div>

              <div className="border border-[#1A1A1A] bg-[#0A0A0A] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[#A0A0A0]">
                  Why it matters
                </p>
                <p className="mt-2 text-sm text-[#A0A0A0]">
                  Faster iterations, fewer rejections, and premium viewer experience.
                </p>
              </div>
            </div>
          </div>

          {/* Showreel placeholder box - replace with your Shaka showreel later */}
          <div className="border border-[#1A1A1A] bg-[#0A0A0A] p-4">
            <div className="aspect-video w-full bg-black/40" />
            <p className="mt-3 text-xs uppercase tracking-[0.22em] text-[#A0A0A0]">
              General Showreel
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}