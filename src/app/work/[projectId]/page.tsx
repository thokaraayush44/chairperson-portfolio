import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { featuredProjects } from "../../../../Projects/Project";

type WorkDetailPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export async function generateStaticParams() {
  return featuredProjects.map((project) => ({
    projectId: project.id,
  }));
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { projectId } = await params;
  const project = featuredProjects.find((item) => item.id === projectId);

  if (!project) {
    notFound();
  }

  const gallery = project.galleryImages?.length
    ? project.galleryImages
    : [project.image];

  return (
    <main className="pt-18.5 flex flex-col gap-[10px] px-4 pb-20 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm transition hover:border-rose-300 hover:text-rose-900"
          >
            ← Back
          </Link>

          <p className="text-sm text-neutral-500">
            Home &gt; Our Work &gt; {project.title}
          </p>
        </div>

        <div className="rounded-[2rem] border border-neutral-200 bg-white px-6 py-8 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase text-amber-800">
                {project.category}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-700">
                {project.ward}
              </span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase text-emerald-800">
                {project.status}
              </span>
            </div>

            <h1 className="text-4xl font-serif font-semibold tracking-tight text-neutral-950 sm:text-5xl">
              {project.title}
            </h1>

            <p className="text-sm text-neutral-500">
              Completed: {project.completedDate ?? project.status}
            </p>

            <div className="overflow-hidden rounded-[1.5rem] bg-slate-200">
              <Image
                src={project.image}
                alt={project.title}
                width={1440}
                height={810}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-4">
              {gallery.slice(0, 4).map((image, index) => (
                <div key={index} className="overflow-hidden rounded-3xl bg-slate-200">
                  <Image
                    src={image}
                    alt={`${project.title} ${index + 1}`}
                    width={328}
                    height={188}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.8fr_0.95fr]">
          <div className="space-y-8">
            <section className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-neutral-950">The Problem</h2>
              <p className="mt-4 text-base leading-8 text-neutral-700">
                {project.problem ?? "No problem description available."}
              </p>
            </section>

            <section className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-neutral-950">The Action</h2>
              <p className="mt-4 text-base leading-8 text-neutral-700">
                {project.action ?? "No action description available."}
              </p>
            </section>

            <section className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-neutral-950">The Outcome</h2>
              <p className="mt-4 text-base leading-8 text-neutral-700">
                {project.outcome ?? "No outcome description available."}
              </p>
            </section>
          </div>

          <aside className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-sm">
            <div className="space-y-6">
              <div>
                <p className="text-lg font-semibold uppercase">
                  Date And Time
                </p>
                <p className="mt-3 text-sm font-semibold text-neutral-500">
                  {project.completedDate ?? "TBD"}
                </p>
              </div>

              <div>
                <p className="text-lg font-semibold uppercase">
                  Location
                </p>
                <p className="mt-3 text-sm font-semibold text-neutral-500">
                  {project.location ?? project.ward}
                </p>
              </div>

              <div>
                <p className="text-lg font-semibold uppercase">
                  Event Types
                </p>
                <p className="mt-3 text-sm font-semibold text-neutral-500">
                  {project.eventTypes ?? "Project Update"}
                </p>
              </div>

              <div>
                <p className="text-lg font-semibold uppercase">
                  Event Category
                </p>
                <p className="mt-3 text-sm font-semibold text-neutral-500">
                  {project.eventCategory ?? project.category}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
