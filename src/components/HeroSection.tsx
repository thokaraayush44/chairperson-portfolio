import HeroContent from "./HeroContent";

export default function HeroSection() {
  return (
    <section className="relative h-[700px] w-full overflow-hidden">

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
  );
}