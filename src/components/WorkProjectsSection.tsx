"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
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
  _id?: string;
  projectId: string;

  translations: WorkTranslation[];

  image: string;
  galleryImages: string[];

  ward: string;

  status: "Ongoing" | "Completed";

  completedDate?: string | null;
};

/*
 * This is the shape that ProjectCard currently expects.
 *
 * We convert the bilingual database object into the
 * correct language before passing it to ProjectCard.
 */
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

export function WorkProjectsSection() {
  const t = useTranslations("WorkProjects");

  /*
   * Gets the current URL locale.
   *
   * /en/work -> en
   * /ne/work -> ne
   */
  const locale = useLocale() as Locale;

  // =====================================================
  // PROJECTS FROM MONGODB
  // =====================================================

  const [projects, setProjects] = useState<Work[]>([]);

  // =====================================================
  // FILTERS
  // =====================================================

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [selectedWard, setSelectedWard] =
    useState("All Wards");

  const [selectedStatus, setSelectedStatus] =
    useState("All");

  // =====================================================
  // LOADING / ERROR
  // =====================================================

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH PROJECTS
  // =====================================================

  useEffect(() => {
    const fetchWork = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/works",
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch work",
          );
        }

        const result =
          await response.json();

        const data = Array.isArray(
          result,
        )
          ? result
          : result.data;

        setProjects(
          Array.isArray(data)
            ? data
            : [],
        );
      } catch (error) {
        console.error(
          "Failed to fetch work:",
          error,
        );

        setError(t("error"));
      } finally {
        setLoading(false);
      }
    };

    fetchWork();
  }, [t]);

  // =====================================================
  // CONVERT DB DATA TO CURRENT LANGUAGE
  // =====================================================

  const localizedProjects =
    useMemo<DisplayWork[]>(() => {
      return projects
        .map((project) => {
          /*
           * First try the current language.
           *
           * /en/work -> English
           * /ne/work -> Nepali
           */

          const translation =
            project.translations?.find(
              (item) =>
                item.locale === locale,
            ) ||
            /*
             * Fallback to English if the
             * requested translation does
             * not exist.
             */
            project.translations?.find(
              (item) =>
                item.locale === "en",
            );

          /*
           * If there is no translation at all,
           * don't show a broken card.
           */
          if (!translation) {
            return null;
          }

          return {
            projectId:
              project.projectId,

            title:
              translation.title,

            description:
              translation.description,

            image:
              project.image,

            galleryImages:
              project.galleryImages || [],

            category:
              translation.category,

            ward:
              project.ward,

            status:
              project.status,

            completedDate:
              project.completedDate,

            location:
              translation.location,

            eventTypes:
              translation.eventTypes,

            eventCategory:
              translation.eventCategory,

            problem:
              translation.problem,

            action:
              translation.action,

            outcome:
              translation.outcome,
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
  // GET UNIQUE CATEGORIES
  // =====================================================

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          localizedProjects
            .map(
              (project) =>
                project.category,
            )
            .filter(Boolean),
        ),
      ).sort(),
    ],
    [localizedProjects],
  );

  // =====================================================
  // GET UNIQUE WARDS
  // =====================================================

  const wards = useMemo(
    () => [
      "All Wards",
      ...Array.from(
        new Set(
          localizedProjects
            .map(
              (project) =>
                project.ward,
            )
            .filter(Boolean),
        ),
      ).sort(),
    ],
    [localizedProjects],
  );

  // =====================================================
  // FILTER PROJECTS
  // =====================================================

  const filteredProjects =
    useMemo(() => {
      return localizedProjects.filter(
        (project) => {
          const categoryMatch =
            selectedCategory ===
              "All" ||
            project.category ===
              selectedCategory;

          const wardMatch =
            selectedWard ===
              "All Wards" ||
            project.ward ===
              selectedWard;

          const statusMatch =
            selectedStatus ===
              "All" ||
            project.status ===
              selectedStatus;

          return (
            categoryMatch &&
            wardMatch &&
            statusMatch
          );
        },
      );
    }, [
      localizedProjects,
      selectedCategory,
      selectedWard,
      selectedStatus,
    ]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center text-neutral-600">
          {t("loading")}
        </div>
      </section>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center text-red-700">
          {error}
        </div>
      </section>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 py-16">

        {/* HEADING */}

        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-rose-900">
          {t("label")}
        </p>

        <h2 className="mb-8 text-4xl font-semibold text-neutral-900">
          {t("title")}
        </h2>

        {/* ================================================= */}
        {/* CATEGORY FILTER */}
        {/* ================================================= */}

        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map(
            (category) => (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setSelectedCategory(
                    category,
                  )
                }
                className={`rounded-full border px-5 py-2 text-sm font-semibold shadow-sm transition ${
                  selectedCategory ===
                  category
                    ? "border-rose-900 bg-rose-50 text-rose-900"
                    : "border-neutral-200 bg-white text-neutral-700 hover:border-rose-200 hover:text-rose-900"
                }`}
              >
                {category ===
                "All"
                  ? t(
                      "filters.all",
                    )
                  : category}
              </button>
            ),
          )}
        </div>

        {/* ================================================= */}
        {/* WARD + STATUS */}
        {/* ================================================= */}

        <div className="mb-10 grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">

          {/* WARD */}

          <div className="grid gap-3 rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">

            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-neutral-500">
              {t(
                "filters.wardLocation",
              )}
            </p>

            <select
              value={
                selectedWard
              }
              onChange={(
                event,
              ) =>
                setSelectedWard(
                  event.target
                    .value,
                )
              }
              className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-rose-900 focus:ring-1 focus:ring-rose-900/10"
            >
              {wards.map(
                (ward) => (
                  <option
                    key={ward}
                    value={ward}
                  >
                    {ward ===
                    "All Wards"
                      ? t(
                          "filters.allWards",
                        )
                      : ward}
                  </option>
                ),
              )}
            </select>
          </div>

          {/* STATUS */}

          <div className="grid gap-3 rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">

            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-neutral-500">
              {t(
                "filters.status",
              )}
            </p>

            <select
              value={
                selectedStatus
              }
              onChange={(
                event,
              ) =>
                setSelectedStatus(
                  event.target
                    .value,
                )
              }
              className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-rose-900 focus:ring-1 focus:ring-rose-900/10"
            >
              <option value="All">
                {t(
                  "filters.all",
                )}
              </option>

              <option value="Ongoing">
                {t(
                  "filters.ongoing",
                )}
              </option>

              <option value="Completed">
                {t(
                  "filters.completed",
                )}
              </option>
            </select>
          </div>
        </div>

        {/* ================================================= */}
        {/* PROJECTS */}
        {/* ================================================= */}

        {filteredProjects.length ===
        0 ? (
          <div className="rounded-3xl border border-neutral-200 bg-white p-10 text-center text-sm text-neutral-600 shadow-sm">
            {t(
              "noProjects",
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {filteredProjects.map(
              (project) => (
                <ProjectCard
                  key={
                    project.projectId
                  }
                  project={
                    project
                  }
                />
              ),
            )}

          </div>
        )}

      </div>
    </section>
  );
}