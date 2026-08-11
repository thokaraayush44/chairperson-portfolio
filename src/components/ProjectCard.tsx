import Image from "next/image";
import Link from "next/link";

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

export function ProjectCard({ project }: { project: Work }) {
  return (
    <Link href={`/work/${project.projectId}`}>
      <article className="group overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        </div>

        <div className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-900">
            {project.category} · {project.ward}
          </p>

          <h3 className="mt-2 font-serif text-xl font-semibold leading-snug text-neutral-900">
            {project.title}
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            {project.description}
          </p>

          <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-rose-900 transition-colors group-hover:text-rose-950">
            View Details

            <Image
              src="/icons/Arrow1.svg"
              alt="arrow"
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