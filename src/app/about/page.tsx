import React from "react";
import { Container } from "@/components/Container";
import { PageTitleBanner } from "@/components/PageTitleBanner";
import { BiographySection } from "@/components/BiographySection";
import { VisionIdeology } from "@/components/VisionIdeology";
import { EducationSection } from "@/components/EducationSection";
import { LanguageSection } from "@/components/LanguageSection";
import { MilestoneSection } from "@/components/MilestoneSection";
import { AwardsSection } from "@/components/AwardsSection";

const page = () => {
  return (
    <main className="pt-18.5 flex flex-col gap-[10px]">

      <Container className="flex flex-col gap-[10px]">
        <PageTitleBanner title="About Hon. Bishnu Bahadur Rokaya" breadcrumb="Home > About" />
        <BiographySection />
        <VisionIdeology />
        <EducationSection />
        <LanguageSection />
        <MilestoneSection />
        <AwardsSection />
      </Container>
    </main>
  );
};

export default page;