"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ProjectCard } from "./ProjectCard";

type Work = {
  projectId: string;
  title: string;
  description: string;
  image: string;
  galleryImages: string[];
  category: string;
  ward: string;
  status: "Ongoing" | "Completed";
  completedDate?: string;
  location: string;
  eventTypes: string;
  eventCategory: string;
  problem: string;
  action: string;
  outcome: string;
};

export function FeaturedWork() {
  const t = useTranslations("FeaturedWork");

  const [projects, setProjects] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWork = async () => {
      try {
        const response = await fetch("/api/works");

        if (!response.ok) {
          throw new Error("Failed to fetch work");
        }

        const result = await response.json();

        // Show only first 3 projects on homepage
        setProjects(result.data.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch featured work:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWork();
  }, []);

  return (
    <section className="bg-[#F5F2EC] px-0 py-20">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <h2 className="text-center font-serif text-4xl font-bold text-neutral-900 sm:text-5xl">
          {t("title")}
        </h2>

        {/* Loading */}
        {loading ? (
          <div className="mt-12 text-center text-neutral-600">
            {t("loading")}
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.projectId}
                project={project}
              />
            ))}
          </div>
        )}

        {/* View All */}
        <div className="mt-10 text-center">
          <Link
            href="/work"
            className="inline-flex items-center gap-1.5 font-semibold text-rose-900"
          >
            {t("viewAll")}

            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                d="M5 12h14m0 0l-6-6m6 6l-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}