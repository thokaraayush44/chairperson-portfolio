import HeroSection from "../components/HeroSection";
import SectionHeading from "../components/SectionHeading";
import { FeaturedWork } from "../components/FeaturedWork";
import { JourneySection } from "../components/JourneySection";
import { LatestNews } from "../components/LatestNews";
import { ContactCta } from "../components/ContactCta";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-white">

      {/* ================= HERO ================= */}
      <HeroSection />

      {/* ================= STATS ================= */}
      <section className="w-full bg-primary-100 py-12">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-5 text-center text-white">

          {/* Years of Service */}
          <div className="flex-1">
            <div className="text-4xl font-semibold">
              12+
            </div>

            <div className="mt-2 text-sm text-white/80">
              Years of Service
            </div>
          </div>

          {/* Projects Completed */}
          <div className="flex-1">
            <div className="text-4xl font-semibold">
              148
            </div>

            <div className="mt-2 text-sm text-white/80">
              Projects Completed
            </div>
          </div>

          {/* Wards Covered */}
          <div className="flex-1">
            <div className="text-4xl font-semibold">
              9
            </div>

            <div className="mt-2 text-sm text-white/80">
              Wards Covered
            </div>
          </div>

          {/* Budget Mobilized */}
          <div className="flex-1">
            <div className="text-4xl font-semibold">
              NPR 42 Cr
            </div>

            <div className="mt-2 text-sm text-white/80">
              Budget Mobilized
            </div>
          </div>

        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <SectionHeading
        label="About the Chairperson"
        title="A Life of Public Service"
        description="Elected in 2079, [Chairperson Name] has dedicated his tenure to rural infrastructure, healthcare access, and transparent local governance across Kalikot’s nine wards."
      />

      {/* ================= FEATURED WORK ================= */}
      <FeaturedWork />

      {/* ================= JOURNEY ================= */}
      <JourneySection />

      {/* ================= LATEST NEWS ================= */}
      <LatestNews />

      {/* ================= CONTACT ================= */}
      <ContactCta />

    </main>
  );
}