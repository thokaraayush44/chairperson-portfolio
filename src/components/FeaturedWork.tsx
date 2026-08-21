"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ProjectCard } from "./ProjectCard";

type Locale = "en" | "ne";

type WorkTranslation = {
  locale: Locale;
  title: string;
  description: string;
  category: string;
  location: string;
  eventTypes: string;
  eventCategory: string;
  problem: string;
  action: string;
  outcome: string;
};

type Work = {
  projectId: string;

  translations: WorkTranslation[];

  image: string;
  galleryImages: string[];

  ward: string;

  status: "Ongoing" | "Completed";

  completedDate?: string | null;
};

type DisplayWork = {
  projectId: string;

  title: string;
  description: string;

  image: string;
  galleryImages: string[];

  category: string;
  ward: string;

  status: "Ongoing" | "Completed";

  completedDate?: string | null;

  location: string;
  eventTypes: string;
  eventCategory: string;

  problem: string;
  action: string;
  outcome: string;
};

export function FeaturedWork() {
  const t = useTranslations("FeaturedWork");

  const locale = useLocale() as Locale;

  const [projects, setProjects] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH WORK
  // =====================================================

  useEffect(() => {
    const fetchWork = async () => {
      try {
        const response = await fetch("/api/works", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch work");
        }

        const result = await response.json();

        const data = Array.isArray(result)
          ? result
          : result.data;

        // Show only first 3 projects
        setProjects(
          Array.isArray(data)
            ? data.slice(0, 3)
            : [],
        );
      } catch (error) {
        console.error(
          "Failed to fetch featured work:",
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWork();
  }, []);

  // =====================================================
  // LOCALIZE PROJECTS
  // =====================================================

  const localizedProjects = useMemo<DisplayWork[]>(() => {
    return projects
      .map((project) => {
        /*
         * First try current language.
         *
         * /en -> English
         * /ne -> Nepali
         */

        const translation =
          project.translations?.find(
            (item) => item.locale === locale,
          ) ||
          /*
           * Fallback to English if
           * current language doesn't exist.
           */
          project.translations?.find(
            (item) => item.locale === "en",
          );

        /*
         * If no translation exists,
         * don't render the project.
         */

        if (!translation) {
          return null;
        }

        return {
          projectId: project.projectId,

          title: translation.title,
          description: translation.description,

          image: project.image,
          galleryImages:
            project.galleryImages || [],

          category: translation.category,
          ward: project.ward,

          status: project.status,
          completedDate:
            project.completedDate,

          location: translation.location,
          eventTypes: translation.eventTypes,
          eventCategory:
            translation.eventCategory,

          problem: translation.problem,
          action: translation.action,
          outcome: translation.outcome,
        };
      })
      .filter(
        (
          project,
        ): project is DisplayWork =>
          project !== null,
      );
  }, [projects, locale]);

  // =====================================================
  // UI
  // =====================================================

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
        ) : localizedProjects.length === 0 ? (
          <div className="mt-12 text-center text-neutral-600">
            No featured work available.
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {localizedProjects.map((project) => (
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