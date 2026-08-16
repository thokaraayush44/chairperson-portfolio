import React from "react";
import { Container } from "@/components/Container";
import { PageTitleBanner } from "@/components/PageTitleBanner";
import JourneyTimeline from "@/components/JourneyTimeline";

const page = () => {
  const journeyItems = [
  {
    year: "2068–2075 B.S.",
    category: "Early Life",
    title: "Early Life",
    description:
      "Growing up in a farming family in the mountains, developed an early interest in community welfare.",
    image: "/images/journey/early-life.jpg",
    side: "left" as const,
    color: "gold" as const,
  },

  {
    year: "2005",
    category: "Education",
    title: "Entry into Politics",
    description:
      "Joined political activities and began grassroots community organizing.",
    side: "right" as const,
    color: "blue" as const,
  },

  {
    year: "2010–2015",
    category: "Party Roles",
    title: "Party Roles",
    description:
      "Served in various party roles and became increasingly involved in district-level activities.",
    images: [
      "/images/journey/party-1.jpg",
      "/images/journey/party-2.jpg",
    ],
    side: "left" as const,
    color: "blue" as const,
  },

  {
    year: "2074 B.S.",
    category: "Local Elections",
    title: "Local Elections",
    description:
      "Elected as a local representative with a focus on roads, health and water access.",
    side: "right" as const,
    color: "gold" as const,
  },

  {
    year: "2079–Present",
    category: "Current Term",
    title: "Current Term",
    description:
      "Elected Chairperson and continued working on infrastructure, healthcare and transparent governance.",
    image: "/images/journey/current-term.jpg",
    side: "left" as const,
    color: "gold" as const,
  },

  {
    year: "2025–Present",
    category: "Ongoing Initiatives",
    title: "Ongoing Initiatives",
    description:
      "Continuing rural development, healthcare and livelihood projects across the community.",
    side: "right" as const,
    color: "red" as const,
  },
];

  return (
    <main className="pt-18.5 flex flex-col gap-[10px]">
      <Container className="flex flex-col gap-[10px]">
        <PageTitleBanner title="Political Journey" breadcrumb="Home > Political Journey" />
        <JourneyTimeline items={journeyItems} />
      </Container>
    </main>
  );
};

export default page;