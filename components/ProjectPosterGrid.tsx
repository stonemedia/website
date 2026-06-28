type ProjectPoster = {
  title: string;
  image: string;
  services: string[];
};

export default function ProjectPosterGrid({
  eyebrow = "Selected Projects",
  title = "Films and shows we have contributed to",
  description = "A small selection of projects where Stone Media has contributed to dubbing, localization, or audio workflows.",
  items,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  items: ProjectPoster[];
}) {
  const visibleItems = items.filter((item) => item.image);

  if (visibleItems.length === 0) return null;

  return (
    <section className="mt-14">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.28em] text-white/40">
          {eyebrow}
        </p>

        <h2 className="mt-3 text-2xl font-light text-white md:text-4xl">
          {title}
        </h2>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/55">
          {description}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleItems.map((project) => (
          <article
            key={project.title}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
          >
            <div className="relative aspect-[2/3] overflow-hidden bg-black">
              <img
                src={project.image}
                alt={project.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="p-4">
              <h3 className="text-base font-medium text-white">
                {project.title}
              </h3>

              {project.services.length > 0 && (
                <>
                  <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-white/35">
                    Scope
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.services.map((service) => (
                      <span
                        key={service}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] leading-relaxed text-white/65"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}