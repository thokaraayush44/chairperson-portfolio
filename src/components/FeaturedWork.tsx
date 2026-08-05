import Link from "next/link";
import { featuredProjects } from "../../Projects/Project";
import { ProjectCard } from "./ProjectCard";
import { JourneySection } from "./JourneySection";


export function FeaturedWork() {
  return (
    <section className="bg-[#F5F2EC] px-0 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-serif text-4xl font-bold text-neutral-900 sm:text-5xl">
          Featured Work
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 font-semibold text-rose-900"
          >
            View All Projects
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

      <JourneySection />
    </section>
    
  );
}