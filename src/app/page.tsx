import HeroContent from "../components/HeroContent";
import SectionHeading from "../components/SectionHeading";
import { FeaturedWork } from "../components/FeaturedWork";

export default function Home() {
  return (
    <main className="min-h-screen w-full overflow-hidden bg-primary">
      <section className="relative min-h-screen w-full">
        <video
          className="absolute inset-0 h-full w-full object-cover object-center"
          src="/video/hero-section.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-slate-950/20" />
        <HeroContent />
      </section>

      <SectionHeading
        label="About the Chairperson"
        title="A Life of Public Service"
        description={
          "Elected in 2079, [Chairperson Name] has dedicated his tenure to rural infrastructure, healthcare access, and transparent local governance across Kalikot’s nine wards."
        }
      />

      <FeaturedWork />
    </main>
  );
}