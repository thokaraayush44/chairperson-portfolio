"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ProjectCard } from "./ProjectCard";
import { featuredProjects } from "../../Projects/Project";

const categories = [
  "All",
  "Infrastructure",
  "Education",
  "Health",
  "Agriculture",
  "Disaster Relief",
  "Youth Programs",
];

export function WorkProjectsSection() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedWard, setSelectedWard] = useState("All Wards");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const wards = useMemo(
    () => [
      "All Wards",
      ...Array.from(new Set(featuredProjects.map((project) => project.ward))).sort(),
    ],
    []
  );

  const filteredProjects = useMemo(
    () =>
      featuredProjects.filter((project) => {
        const categoryMatch =
          selectedCategory === "All" || project.category === selectedCategory;
        const wardMatch =
          selectedWard === "All Wards" || project.ward === selectedWard;
        const statusMatch =
          selectedStatus === "All" || project.status === selectedStatus;

        return categoryMatch && wardMatch && statusMatch;
      }),
    [selectedCategory, selectedWard, selectedStatus]
  );

  return (
    <section className="bg-[#F5F2EC] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-rose-900">
              Our Work
            </p>
            <h2 className="mt-2 text-3xl font-serif font-bold text-neutral-900 sm:text-4xl">
              Featured Projects
            </h2>
          </div>
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
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full border px-5 py-2 text-sm font-semibold transition shadow-sm ${
                selectedCategory === category
                  ? "border-rose-900 bg-rose-50 text-rose-900"
                  : "border-neutral-200 bg-white text-neutral-700 hover:border-rose-200 hover:text-rose-900"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mb-10 grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
          <div className="grid gap-3 rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-neutral-500">
              Ward / Location
            </p>
            <select
              value={selectedWard}
              onChange={(event) => setSelectedWard(event.target.value)}
              className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-rose-900 focus:ring-1 focus:ring-rose-900/10"
            >
              {wards.map((ward) => (
                <option key={ward} value={ward}>
                  {ward}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-3 rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-neutral-500">
              Status
            </p>
            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-rose-900 focus:ring-1 focus:ring-rose-900/10"
            >
              <option value="All">All</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="rounded-3xl border border-neutral-200 bg-white p-10 text-center text-sm text-neutral-600 shadow-sm">
            No projects match the selected filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
