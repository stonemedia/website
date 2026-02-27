import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustedByStrip from "@/components/TrustedByStrip";
import StatsStrip from "@/components/StatsStrip";
import About from "@/components/About";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="bg-[#0B0B0F] text-white">
      <Header />
      <Hero />
      <About />
      <TrustedByStrip />
      <StatsStrip />
      <Contact />
    </main>
  );
}