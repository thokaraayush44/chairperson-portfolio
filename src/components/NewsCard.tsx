import Image from "next/image";
import Link from "next/link";

type News = {
  _id: string;
  title: string;
  description: string;
  image?: string;
  date: string;
};

export function NewsCard({ project }: { project: News }) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Image */}
      {project.image && (
        <div className="relative h-64 w-full overflow-hidden bg-neutral-100">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col justify-between gap-4 p-5">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-900">
            News
          </p>

          <h3 className="font-serif text-2xl font-semibold leading-tight text-neutral-900">
            {project.title}
          </h3>

          <p className="text-sm leading-relaxed text-neutral-600">
            {project.description}
          </p>

          <p className="text-xs text-neutral-500">
            {new Date(project.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Details Link */}
        <Link
          href={`/news/${project._id}`}
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
    </article>
  );
}