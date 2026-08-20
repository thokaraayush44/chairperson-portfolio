import React from "react";
import { getTranslations } from "next-intl/server";

import { Container } from "@/components/Container";
import { PageTitleBanner } from "@/components/PageTitleBanner";
import { BiographySection } from "@/components/BiographySection";
import { VisionIdeology } from "@/components/VisionIdeology";
import { EducationSection } from "@/components/EducationSection";
import { LanguageSection } from "@/components/LanguageSection";
import { MilestoneSection } from "@/components/MilestoneSection";
import { AwardsSection } from "@/components/AwardsSection";

const Page = async () => {
  const t = await getTranslations("About");

  return (
    <main className="pt-18.5 flex flex-col gap-[10px]">
      <Container className="flex flex-col">
        <PageTitleBanner
          title={t("pageTitle")}
          breadcrumb={t("breadcrumb")}
        />

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

export default Page;