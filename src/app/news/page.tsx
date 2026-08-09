import React from "react";
import { Container } from "@/components/Container";
import { PageTitleBanner } from "@/components/PageTitleBanner";
import { NewsCard } from "@/components/NewsCard";
import { SpeechesSection } from "@/components/SpeechesSection";
import { newsProjects } from "../../../Projects/Project";

const page = () => {
  return (
    <main className="pt-18.5 flex flex-col gap-[10px]">
      <Container className="flex flex-col">
        <PageTitleBanner title="News & Media" breadcrumb="Home > News & Media" />
         <h2 className="mb-3 mt-12 text-4xl font-bold font-serif text-slate-900 mx-auto max-w-7xl w-full text-left">
          Latest News
        </h2>

        <section className="grid gap-12 mx-auto my-10 max-w-7xl max-h-full md:grid-cols-2 xl:grid-cols-2">
          {newsProjects.map((project) => (
            <NewsCard key={project.id} project={project} />
          ))}
        </section>
        <SpeechesSection />
      </Container>
    </main>
  );
};

export default page;