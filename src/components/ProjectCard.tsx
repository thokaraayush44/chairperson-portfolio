import Image from "next/image";
import Link from "next/link";
import { Project } from "../../Projects/Project";
import { StatusBadge } from "./StatusBadge";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        <StatusBadge status={project.status} />
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

        <Link
          href={project.href}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-rose-900 transition-colors hover:text-rose-950 hover:underline"
        >
          View Details
          <Image
            src="/icons/Arrow1.svg"
            alt="arrow"
            width={16}
            height={12}
            className="h-4 w-4"
          />
        </Link>
      </div>
    </article>
  );
}