import { getTranslations } from "next-intl/server";

import { Container } from "@/components/Container";
import { PageTitleBanner } from "@/components/PageTitleBanner";
import { WorkProjectsSection } from "@/components/WorkProjectsSection";

const Page = async () => {
  const t = await getTranslations("Work");

  return (
    <main className="pt-18.5 flex flex-col gap-[10px]">
      <Container className="flex flex-col gap-[10px]">
        <PageTitleBanner
          title={t("pageTitle")}
          breadcrumb={t("breadcrumb")}
        />
      </Container>

      <WorkProjectsSection />
    </main>
  );
};

export default Page;