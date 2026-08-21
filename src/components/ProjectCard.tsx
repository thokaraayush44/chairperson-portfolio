"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

type Work = {
  projectId: string;

  // Already localized by WorkProjectsSection
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

export function ProjectCard({
  project,
}: {
  project: Work;
}) {
  const t = useTranslations("ProjectCard");

  return (
    <Link href={`/work/${project.projectId}`}>
      <article className="group overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
        {/* IMAGE */}
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={project.image}
            alt={project.title || ""}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        </div>

        <div className="p-5">
          {/* CATEGORY + WARD */}
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-900">
            {project.category} · {project.ward}
          </p>

          {/* LOCALIZED TITLE */}
          <h3 className="mt-2 font-serif text-xl font-semibold leading-snug text-neutral-900">
            {project.title || "Untitled Project"}
          </h3>

          {/* LOCALIZED DESCRIPTION */}
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            {project.description || ""}
          </p>

          {/* VIEW DETAILS */}
          <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-rose-900 transition-colors group-hover:text-rose-950">
            {t("viewDetails")}

            <Image
              src="/icons/Arrow1.svg"
              alt=""
              width={16}
              height={12}
              className="h-4 w-4"
            />
          </div>
        </div>
      </article>
    </Link>
  );
}