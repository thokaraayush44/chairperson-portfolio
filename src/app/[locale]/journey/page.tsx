import { getTranslations } from "next-intl/server";

import { Container } from "@/components/Container";
import { PageTitleBanner } from "@/components/PageTitleBanner";
import JourneyTimeline from "@/components/JourneyTimeline";

export default async function Page() {
  const t = await getTranslations("Journey");

  const journeyItems = [
    {
      year: "2068–2075 B.S.",
      category: t("items.earlyLife.category"),
      title: t("items.earlyLife.title"),
      description: t("items.earlyLife.description"),
      image: "/images/journey/early-life.jpg",
      side: "left" as const,
      color: "gold" as const,
    },

    {
      year: "2005",
      category: t("items.politics.category"),
      title: t("items.politics.title"),
      description: t("items.politics.description"),
      side: "right" as const,
      color: "blue" as const,
    },

    {
      year: "2010–2015",
      category: t("items.partyRoles.category"),
      title: t("items.partyRoles.title"),
      description: t("items.partyRoles.description"),
      images: [
        "/images/journey/party-1.jpg",
        "/images/journey/party-2.jpg",
      ],
      side: "left" as const,
      color: "blue" as const,
    },

    {
      year: "2074 B.S.",
      category: t("items.localElections.category"),
      title: t("items.localElections.title"),
      description: t("items.localElections.description"),
      side: "right" as const,
      color: "gold" as const,
    },

    {
      year: "2079–Present",
      category: t("items.currentTerm.category"),
      title: t("items.currentTerm.title"),
      description: t("items.currentTerm.description"),
      image: "/images/journey/current-term.jpg",
      side: "left" as const,
      color: "gold" as const,
    },

    {
      year: "2025–Present",
      category: t("items.initiatives.category"),
      title: t("items.initiatives.title"),
      description: t("items.initiatives.description"),
      side: "right" as const,
      color: "red" as const,
    },
  ];

  return (
    <main className="pt-18.5 flex flex-col gap-[10px]">
      <Container className="flex flex-col gap-[10px]">

        <PageTitleBanner
          title={t("pageTitle")}
          breadcrumb={t("breadcrumb")}
        />

        <JourneyTimeline items={journeyItems} />

      </Container>
    </main>
  );
}