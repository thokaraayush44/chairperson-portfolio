import React from "react";
import { Container } from "@/components/Container";
import { PageTitleBanner } from "@/components/PageTitleBanner";
import { WorkProjectsSection } from "@/components/WorkProjectsSection";

const page = () => {
  return (
    <main className="pt-18.5 flex flex-col gap-[10px]">
      <Container className="flex flex-col gap-[10px]">
        <PageTitleBanner title="Our Work" breadcrumb="Home > Our Work" />
      </Container>

      <WorkProjectsSection />
    </main>
  );
};

export default page;