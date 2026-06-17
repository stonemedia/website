import Image from "next/image";

export default function Header({
  theme = "dark",
}: {
  theme?: "dark" | "light";
}) {
  return (
    <header className="fixed top-0 z-50 w-full">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div
          className={`mt-5 flex items-center justify-between px-4 py-3 backdrop-blur ${
            theme === "light"
              ? "border border-black/10 bg-[#F7F7F5]/80"
              : "border border-[#1A1A1A] bg-[#0D0D0D]/60"
          }`}
        >
          <a href="/" className="flex items-center" aria-label="Go to Stone Media homepage">
          <Image
  src={
    theme === "light"
      ? "/brand/stonemedia-logo-dark.png"
      : "/brand/stonemedia-logo-light.png"
  }
  alt="Stone Media"
  width={180}
  height={41}
  className="h-auto w-[162px] md:w-[180px]"
  priority
/>
          </a>

          <nav className="hidden items-center gap-7 text-xs uppercase tracking-[0.2em] md:flex" />

          <a
            href="/#contact"
            className={`hidden px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors md:inline-flex ${
              theme === "light"
                ? "border border-black/15 text-black/80 hover:bg-black hover:text-white"
                : "border border-[#F5F5F5] text-[#F5F5F5] hover:border-[#7A0E14] hover:bg-[#7A0E14]"
            }`}
          >
            Connect
          </a>

          <a
            href="/#contact"
            className={`inline-flex px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors md:hidden ${
              theme === "light"
                ? "border border-black/15 text-black/80 hover:bg-black hover:text-white"
                : "border border-[#F5F5F5] text-[#F5F5F5] hover:border-[#7A0E14] hover:bg-[#7A0E14]"
            }`}
          >
            Connect
          </a>
        </div>
      </div>
    </header>
  );
}