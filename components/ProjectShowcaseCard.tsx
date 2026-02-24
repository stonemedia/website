import ShakaVideo from "./ShakaVideo";

type Project = {
  slug: string;
  category: string;
  year: string | number;
  title: string;
  meta: string;
  // Add this field in your projects data if you want per-project streams
  hlsSrc?: string;
};

export default function ProjectShowcaseCard({
  project,
  showTitle = true,
  className = "",
}: {
  project: Project;
  showTitle?: boolean;
  className?: string;
}) {
  const src =
    project.hlsSrc ??
    "https://stonemediawebsite.web.app/hls/project1/master.m3u8"; // fallback (keeps current behavior)

  return (
    <div className={`border border-[#1A1A1A] bg-[#0A0A0A] ${className}`}>
      {showTitle && (
        <div className="p-6 border-b border-[#1A1A1A]">
          <p className="text-xs uppercase tracking-[0.22em] text-[#A0A0A0]">
            {project.category} · {project.year}
          </p>
          <h3 className="mt-3 text-xl md:text-2xl uppercase tracking-[0.14em]">
            {project.title}
          </h3>
          <p className="mt-3 max-w-3xl text-sm md:text-base text-[#A0A0A0]">
            {project.meta}
          </p>
        </div>
      )}

      <div className="p-6">
        <ShakaVideo src={src} />
      </div>
    </div>
  );
}