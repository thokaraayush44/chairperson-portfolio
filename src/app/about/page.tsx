import React from "react";
import { PageTitleBanner } from "@/components/PageTitleBanner";
import { BiographySection } from "@/components/BiographySection";
import { VisionIdeology } from "@/components/VisionIdeology";
import { EducationSection } from "@/components/EducationSection";
import { LanguageSection } from "@/components/LanguageSection";
import { MilestoneSection } from "@/components/MilestoneSection";
import { AwardsSection } from "@/components/AwardsSection";

const page = () => {
  return (
    <main className="mx-auto max-w-6xl pt-24 px-6 py-12">
      <PageTitleBanner title="About Hon. Bishnu Bahadur Rokaya" breadcrumb="Home > About" />

      <BiographySection />
      <VisionIdeology />
      <EducationSection />
      <LanguageSection />
      <MilestoneSection />
      <AwardsSection />
    </main>
  );
};

export default page;