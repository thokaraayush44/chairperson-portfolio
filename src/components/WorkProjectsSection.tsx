"use client";

import { useEffect, useMemo, useState } from "react";
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

export function WorkProjectsSection() {
  // Projects coming from MongoDB
  const [projects, setProjects] = useState<Work[]>([]);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedWard, setSelectedWard] = useState("All Wards");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch projects from API
  useEffect(() => {
    const fetchWork = async () => {
      try {
        const response = await fetch("/api/works");

        if (!response.ok) {
          throw new Error("Failed to fetch work");
        }

        const result = await response.json();

        setProjects(result.data);
      } catch (error) {
        console.error("Failed to fetch work:", error);
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchWork();
  }, []);

  // Get unique categories from MongoDB
  const categories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(projects.map((project) => project.category))
      ).sort(),
    ],
    [projects]
  );

  // Get unique wards from MongoDB
  const wards = useMemo(
    () => [
      "All Wards",
      ...Array.from(
        new Set(projects.map((project) => project.ward))
      ).sort(),
    ],
    [projects]
  );

  // Filter projects
  const filteredProjects = useMemo(
    () =>
      projects.filter((project) => {
        const categoryMatch =
          selectedCategory === "All" ||
          project.category === selectedCategory;

        const wardMatch =
          selectedWard === "All Wards" ||
          project.ward === selectedWard;

        const statusMatch =
          selectedStatus === "All" ||
          project.status === selectedStatus;

        return categoryMatch && wardMatch && statusMatch;
      }),
    [projects, selectedCategory, selectedWard, selectedStatus]
  );

  // Loading state
  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center text-neutral-600">
          Loading projects...
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center text-red-700">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-rose-900">
          Our Work
        </p>

        <h2 className="mb-8 text-4xl font-semibold text-neutral-900">
          Featured Projects
        </h2>

        {/* Category Filter */}
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

        {/* Ward + Status Filters */}
        <div className="mb-10 grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
          {/* Ward */}
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

          {/* Status */}
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

        {/* Projects */}
        {filteredProjects.length === 0 ? (
          <div className="rounded-3xl border border-neutral-200 bg-white p-10 text-center text-sm text-neutral-600 shadow-sm">
            No projects match the selected filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.projectId}
                project={project}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}