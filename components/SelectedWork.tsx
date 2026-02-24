const featured = [
  { title: "Campaign Localization", meta: "Multi-language delivery" },
  { title: "OTT Dubbing", meta: "Performance-led adaptation" },
  { title: "Accessibility Assets", meta: "CC · AD · Sign" },
  { title: "Compliance Support", meta: "Market readiness workflows" },
  { title: "Voice Infrastructure", meta: "Client-ready voice systems" },
  { title: "AI Localization Pipeline", meta: "Systems built for scale" },
];

export default function SelectedWork() {
  return (
    <section id="work" className="py-28">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="flex items-end justify-between gap-6">
          <h2 className="text-2xl md:text-3xl uppercase tracking-[0.2em]">Selected Work</h2>
          <a
            href="/work"
            className="text-xs md:text-sm uppercase tracking-[0.2em] text-[#A0A0A0] hover:text-[#F5F5F5]"
          >
            View All Work
          </a>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((item) => (
            <a
              key={item.title}
              href="#"
              className="group block border border-[#1A1A1A] bg-[#0D0D0D] transition-transform hover:-translate-y-0.5"
            >
              <div className="aspect-video border-b border-[#1A1A1A] bg-[#0A0A0A]" />

              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-sm md:text-base uppercase tracking-[0.14em]">
                    {item.title}
                  </h3>
                  <span className="mt-1 h-[2px] w-8 bg-transparent transition-colors group-hover:bg-[#7A0E14]" />
                </div>

                <p className="mt-2 text-sm text-[#A0A0A0]">{item.meta}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}