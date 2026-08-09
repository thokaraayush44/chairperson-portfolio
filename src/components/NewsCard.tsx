import Image from "next/image";
import Link from "next/link";
import { Project } from "../../Projects/Project";
import { StatusBadge } from "./StatusBadge";

export function NewsCard({ project }: { project: Project }) {
  return (
    <article className="w-full overflow-hidden rounded-2xl bg-[#F5F2EC] p-8 shadow-sm ring-1 ring-black/5 transition duration-200 hover:-translate-y-0.5">
      <div className="grid gap-6 md:grid-cols-[1.15fr_1.85fr] md:items-center md:gap-8">
        <div className="relative aspect-[4/3] w-full md:aspect-[5/4]">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover rounded-2xl"
            sizes="(min-width: 1280px) 440px, (min-width: 768px) 45vw, 100vw"
          />
          <StatusBadge status={project.status} />
        </div>

        <div className="p-5 flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-900">
              {project.category} · {project.ward}
            </p>

            <h3 className="font-serif text-2xl font-semibold leading-tight text-neutral-900">
              {project.title}
            </h3>

            <p className="text-sm leading-relaxed text-neutral-600">
              {project.description}
            </p>
          </div>

          <Link
            href={project.href}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-900 transition-colors hover:text-rose-950 hover:underline"
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
      </div>
    </article>
  );
}
