import Image from "next/image";

export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mt-5 flex items-center justify-between border border-[#1A1A1A] bg-[#0D0D0D]/60 px-4 py-3 backdrop-blur">
          {/* Logo placeholder (we’ll swap with your real logo image next) */}
          <a href="#top" className="flex items-center">
  	    <Image
    	      src="/brand/stonemedia-logo3.png"
    	      alt="Stone Media"
              width={154}
              height={35.2}
              priority
             />
           </a>
          <nav className="hidden items-center gap-7 text-xs uppercase tracking-[0.2em] md:flex">
            <a className="text-[#A0A0A0] hover:text-[#F5F5F5]" href="#capabilities">
              Capabilities
            </a>
            <a className="text-[#A0A0A0] hover:text-[#F5F5F5]" href="#work">
              Work
            </a>
            <a className="text-[#A0A0A0] hover:text-[#F5F5F5]" href="#contact">
              Contact
            </a>
          </nav>

          <a
            href="#contact"
            className="hidden border border-[#F5F5F5] px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors hover:border-[#7A0E14] hover:bg-[#7A0E14] md:inline-flex"
          >
            Connect
          </a>

          {/* Mobile hint (we’ll add hamburger menu later if you want) */}
          <a
            href="#contact"
            className="inline-flex border border-[#F5F5F5] px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors hover:border-[#7A0E14] hover:bg-[#7A0E14] md:hidden"
          >
            Connect
          </a>
        </div>
      </div>
    </header>
  );
}