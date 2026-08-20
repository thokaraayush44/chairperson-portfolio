import { getTranslations } from "next-intl/server";

import { Container } from "@/components/Container";
import { PageTitleBanner } from "@/components/PageTitleBanner";
import { ContactInfoAndMap } from "@/components/ContactInfoAndMap";
import { FeedbackForm } from "@/components/FeedbackForm";

export default async function Page() {
  const t = await getTranslations("Contact");

  return (
    <main className="pt-18.5 flex flex-col gap-[10px]">
      <Container className="flex flex-col">
        <PageTitleBanner
          title={t("pageTitle")}
          breadcrumb={t("breadcrumb")}
        />

        <ContactInfoAndMap />
        <FeedbackForm />
      </Container>
    </main>
  );
}