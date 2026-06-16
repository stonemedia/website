import Header from "@/components/Header";

export default function AlterDubPage() {
  return (
    <>
      <Header theme="light" />

      <main className="min-h-screen bg-[#FFFFFF] text-[#111111]">
        <section className="mx-auto max-w-6xl px-6 pt-32 pb-24 text-center">

          <p className="text-xs uppercase tracking-[0.35em] text-black/35">
            A Stone Media Technology Initiative
          </p>

          <h1 className="mt-8 text-6xl md:text-8xl font-light uppercase tracking-[0.16em]">
            AlterDub
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-xl md:text-2xl font-light leading-relaxed text-black/70">
            AI-assisted dubbing workflows
            <br />
            for modern studios.
          </p>

          <div className="mt-20 h-px w-full bg-black/10" />

          <div className="mx-auto mt-20 max-w-4xl">
            <p className="text-2xl md:text-4xl font-light leading-relaxed text-black/85">
              Built from two decades of localization experience.
              <br />
              Designed for the next decade of dubbing workflows.
            </p>
          </div>

          <div className="mt-24 flex flex-wrap justify-center gap-8 text-xs uppercase tracking-[0.35em] text-black/60">
            <span>Voice</span>
            <span>Workflow</span>
            <span>QC</span>
            <span>Delivery</span>
          </div>

          <div className="mx-auto mt-24 max-w-3xl">
            <p className="text-lg leading-relaxed text-black/85">
              We believe AI should reduce friction, not creative control.
            </p>

            <p className="mt-8 text-lg leading-relaxed text-black/85">
              AlterDub is being developed to help studios move faster while
              preserving performance, direction, and quality assurance.
            </p>
          </div>

          <p className="mt-16 text-xs uppercase tracking-[0.25em] text-black/50">
            Launching Soon
          </p>

        </section>
      </main>
    </>
  );
}