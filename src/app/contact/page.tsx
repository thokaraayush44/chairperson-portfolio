import React from "react";
import { Container } from "@/components/Container";
import { PageTitleBanner } from "@/components/PageTitleBanner";
import { ContactInfoAndMap } from "@/components/ContactInfoAndMap";
import { FeedbackForm } from "@/components/FeedbackForm";

const page = () => {
  return (
    <main className="pt-18.5 flex flex-col  gap-[10px]">

      <Container className="flex flex-col">
        <PageTitleBanner title="Contact" breadcrumb="Home > Contact" />

        <ContactInfoAndMap />
        <FeedbackForm />
      </Container>
    </main>
  );
};

export default page;
