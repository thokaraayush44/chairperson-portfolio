import { getTranslations } from "next-intl/server";

import HeroSection from "../../components/HeroSection";
import SectionHeading from "../../components/SectionHeading";
import { FeaturedWork } from "../../components/FeaturedWork";
import { JourneySection } from "../../components/JourneySection";
import { LatestNews } from "../../components/LatestNews";
import { ContactCta } from "../../components/ContactCta";

export default async function Home() {
  const t = await getTranslations("Home");

  return (
    <main className="min-h-screen w-full bg-white">

      {/* ================= HERO ================= */}
      <HeroSection />

      {/* ================= STATS ================= */}
      <section className="w-full bg-[#8a1538] py-12">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-5 text-center text-white">

          {/* Years of Service */}
          <div className="flex-1">
            <div className="text-4xl font-semibold">
              {t("stats.yearsOfServiceValue")}
            </div>

            <div className="mt-2 text-sm text-white/80">
              {t("stats.yearsOfService")}
            </div>
          </div>

          {/* Projects Completed */}
          <div className="flex-1">
            <div className="text-4xl font-semibold">
              {t("stats.projectsCompletedValue")}
            </div>

            <div className="mt-2 text-sm text-white/80">
              {t("stats.projectsCompleted")}
            </div>
          </div>

          {/* Wards Covered */}
          <div className="flex-1">
            <div className="text-4xl font-semibold">
              {t("stats.wardsCoveredValue")}
            </div>

            <div className="mt-2 text-sm text-white/80">
              {t("stats.wardsCovered")}
            </div>
          </div>

          {/* Budget Mobilized */}
          <div className="flex-1">
            <div className="text-4xl font-semibold">
              {t("stats.budgetMobilizedValue")}
            </div>

            <div className="mt-2 text-sm text-white/80">
              {t("stats.budgetMobilized")}
            </div>
          </div>

        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <SectionHeading
        label={t("about.label")}
        title={t("about.title")}
        description={t("about.description")}
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