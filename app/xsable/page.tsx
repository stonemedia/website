import Header from "@/components/Header";

export default function XsAblePage() {
  return (
    <>
      <Header theme="light" />

      <main className="min-h-screen bg-[#FFFFFF] text-[#111111]">
        <section className="mx-auto max-w-6xl px-6 pt-36 pb-24 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-black/35">
            A Stone Media Accessibility Technology Initiative
          </p>

          <h1 className="mt-8 text-7xl font-light tracking-[0.10em] md:text-[9rem]">
            XsAble
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-xl font-light leading-relaxed text-black/70 md:text-2xl">
            Accessibility assets that stay in sync.
          </p>

          <div className="mt-20 h-px w-full bg-black/10" />

          <div className="mx-auto mt-20 max-w-4xl">
            <p className="text-2xl font-light leading-relaxed text-black/85 md:text-4xl">
              A companion accessibility experience for cinema, streaming,
              broadcast, and beyond.
            </p>
          </div>

          <div className="mx-auto mt-20 max-w-3xl space-y-8 text-lg leading-relaxed text-black/60">
            <p>
              XsAble is being developed to help audio description, captions,
              and accessibility assets align with program audio using audio
              recognition and synchronization workflows.
            </p>

            <p>
              The goal is simple: make accessible viewing feel natural,
              reliable, and beautifully timed — without disturbing the main
              content experience.
            </p>
          </div>

          <div className="mt-24 flex flex-wrap justify-center gap-8 text-xs uppercase tracking-[0.35em] text-black/40">
            <span>Audio Description</span>
            <span>Captions</span>
            <span>Sync</span>
            <span>Access</span>
          </div>

          <p className="mt-20 text-xs uppercase tracking-[0.25em] text-black/30">
            Launching Soon
          </p>
        </section>
      </main>
    </>
  );
}