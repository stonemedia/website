import Header from "../../../components/Header";
import { projects } from "../../data/projects";
import ShakaVideo from "../../../components/ShakaVideo";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <main className="min-h-screen bg-[#0D0D0D] text-[#F5F5F5]">
        <Header />
        <section className="pt-28 pb-20">
          <div className="mx-auto w-full max-w-6xl px-6">
            <p className="text-sm text-[#A0A0A0]">Project not found.</p>
            <a
              className="mt-6 inline-flex border border-[#1A1A1A] px-4 py-2 text-xs uppercase tracking-[0.2em]"
              href="/work"
            >
              Back to Work
            </a>
          </div>
        </section>
      </main>
    );
  }

  // ✅ Use per-project HLS if available; otherwise keep your existing working fallback.
  const hlsSrc =
    project.hlsSrc ?? "https://stonemediawebsite.web.app/hls/project1/master.m3u8";

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-[#F5F5F5]">
      <Header />

      <section className="pt-28 pb-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <a
            href="/work"
            className="text-xs uppercase tracking-[0.22em] text-[#A0A0A0] hover:text-[#F5F5F5]"
          >
            ← Back to Work
          </a>

          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.22em] text-[#A0A0A0]">
              {project.category} · {project.year}
            </p>
            <h1 className="mt-3 text-3xl md:text-5xl uppercase tracking-[0.14em]">
              {project.title}
            </h1>
            <p className="mt-5 max-w-2xl text-sm md:text-base text-[#A0A0A0]">
              {project.meta}
            </p>
          </div>

          <ShakaVideo src={hlsSrc} className="mt-12" />

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="border border-[#1A1A1A] bg-[#0A0A0A] p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-[#A0A0A0]">
                Deliverables
              </p>
              <ul className="mt-4 space-y-2 text-sm text-[#A0A0A0]">
                <li>• Dubbing / VO</li>
                <li>• Subtitling / CC</li>
                <li>• Mix / QC</li>
                <li>• Platform-ready exports</li>
              </ul>
            </div>

            <div className="border border-[#1A1A1A] bg-[#0A0A0A] p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-[#A0A0A0]">
                Contact
              </p>
              <p className="mt-4 text-sm text-[#A0A0A0]">
                Want a similar delivery across multiple languages?
              </p>
              <a
                className="mt-6 inline-flex border border-[#1A1A1A] px-4 py-2 text-xs uppercase tracking-[0.2em] hover:border-[#2A2A2A]"
                href="/#contact"
              >
                Connect
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}