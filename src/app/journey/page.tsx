import React from "react";
import { Container } from "@/components/Container";
import { PageTitleBanner } from "@/components/PageTitleBanner";

const page = () => {
  return (
    <main className="pt-18.5 flex flex-col gap-[10px]">
      <Container className="flex flex-col gap-[10px]">
        <PageTitleBanner title="Political Journey" breadcrumb="Home > Political Journey" />
        Journey page content
      </Container>
    </main>
  );
};

export default page;