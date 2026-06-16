import ShakaVideo from "@/components/ShakaVideo";
export default function About() {
  return (
    <section className="relative bg-[#030509]">
      <div className="mx-auto w-full max-w-6xl px-6 py-10 md:py-14">
        <div className="grid gap-14 md:grid-cols-2 md:items-center">
          
          {/* Left Content */}
          <div>
            <h1 className="text-base md:text-lg uppercase tracking-[0.28em] text-white/50">
  		About
	    </h1>

            <h2 className="mt-5 text-2xl md:text-4xl font-light uppercase tracking-[0.12em] leading-tight">
              Building for scale. <br className="hidden md:block" />
              Tuning for craft.
            </h2>

            <p className="mt-6 max-w-lg text-sm md:text-base text-white/60 leading-relaxed">
              Stone Media is a modern media ecosystem built to support multilingual storytelling across platforms, markets, and evolving technologies.

Our work spans performance, localization, audio restoration, accessibility, certification, and distribution — connected through structured workflows and production-grade infrastructure.

We operate at the intersection of craft and systems. Creative at heart, but engineered for scale, we design processes that allow stories to move efficiently across languages and screens.

As media continues to evolve, so do we — integrating technology, building smarter workflows, and developing tools that support the next generation of content delivery.

Stone Media isn’t just a studio.
It’s a framework for how stories travel today — and tomorrow.
              {/* <span className="text-white/80"> We engineer it for markets.</span> */}
            </p>

            {/* Info Blocks */}
            <div className="mt-10 grid gap-4">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:bg-white/[0.05]">
                <p className="text-xs uppercase tracking-[0.25em] text-white/40">
                  Built for complex localization
                </p>
                <p className="mt-3 text-sm text-white/60">
                  From adaptation and dubbing to audio finishing and final delivery, our workflows are designed to support high-volume content without compromising creative quality.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:bg-white/[0.05]">
                <p className="text-xs uppercase tracking-[0.25em] text-white/40">
                  Why clients return
                </p>
                <p className="mt-3 text-sm text-white/60">
                  Experienced teams, dependable delivery, consistent quality, and the flexibility to scale from single titles to large-volume localization programs.
                </p>
              </div>
            </div>
          </div>

          {/* Showreel */}
          <div className="relative">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm">
              <ShakaVideo src="https://stonemediawebsite-hls-public-849564114573.storage.googleapis.com/projects/showreel/master.m3u8" />
              <p className="mt-4 text-xs uppercase tracking-[0.25em] text-white/40">
                General Showreel
              </p>
            </div>

            {/* subtle glow */}
            <div className="pointer-events-none absolute -inset-6 bg-gradient-to-tr from-red-500/10 via-transparent to-transparent blur-3xl" />
          </div>

        </div>
      </div>
    </section>
  );
}