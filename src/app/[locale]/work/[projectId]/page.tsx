import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";

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
  _id: string;
  projectId: string;

  translations: WorkTranslation[];

  image: string;
  galleryImages: string[];

  ward: string;

  status: "Ongoing" | "Completed";

  completedDate?: string | null;
};

type WorkDetailPageProps = {
  params: Promise<{
    locale: string;
    projectId: string;
  }>;
};

export default async function WorkDetailPage({
  params,
}: WorkDetailPageProps) {
  const { projectId } = await params;

  const locale = (await getLocale()) as Locale;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/works/${encodeURIComponent(
      projectId,
    )}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    notFound();
  }

  const result = await response.json();

  const work: Work = result.data;

  if (!work) {
    notFound();
  }

  // =====================================================
  // GET CURRENT LANGUAGE TRANSLATION
  // =====================================================

  const translation =
    work.translations?.find(
      (item) => item.locale === locale,
    ) ||
    work.translations?.find(
      (item) => item.locale === "en",
    );

  if (!translation) {
    notFound();
  }

  const gallery =
    work.galleryImages?.length > 0
      ? work.galleryImages
      : work.image
        ? [work.image]
        : [];

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-7xl px-6 py-12">

        {/* BACK */}

        <div className="mb-8">
          <Link
            href="/work"
            className="text-sm font-semibold text-rose-900 hover:text-rose-950"
          >
            ← Back
          </Link>

          <p className="mt-3 text-sm text-neutral-500">
            Home &gt; Our Work &gt;{" "}
            {translation.title}
          </p>
        </div>

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="rounded-[2rem] border border-neutral-200 bg-white px-6 py-8 shadow-sm">
          <div className="flex flex-col gap-4">

            {/* BADGES */}

            <div className="flex flex-wrap items-center gap-2">

              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase text-amber-800">
                {translation.category}
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-700">
                {work.ward}
              </span>

              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase text-emerald-800">
                {work.status}
              </span>

            </div>

            {/* TITLE */}

            <h1 className="text-4xl font-serif font-semibold tracking-tight text-neutral-950 sm:text-5xl">
              {translation.title}
            </h1>

            {/* DATE */}

            <p className="text-sm text-neutral-500">
              {work.completedDate
                ? new Date(
                    work.completedDate,
                  ).toLocaleDateString(
                    locale === "ne"
                      ? "ne-NP"
                      : "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )
                : work.status}
            </p>

            {/* MAIN IMAGE */}

            {work.image && (
              <div className="overflow-hidden rounded-[1.5rem] bg-slate-200">
                <Image
                  src={work.image}
                  alt={translation.title}
                  width={1440}
                  height={810}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {/* GALLERY */}

            {gallery.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-3">
                {gallery
                  .slice(0, 3)
                  .map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="overflow-hidden rounded-3xl bg-slate-200"
                    >
                      <Image
                        src={image}
                        alt={`${translation.title} ${
                          index + 1
                        }`}
                        width={328}
                        height={188}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
              </div>
            )}

          </div>
        </div>

        {/* ================================================= */}
        {/* CONTENT */}
        {/* ================================================= */}

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.8fr_0.95fr]">

          <div className="space-y-8">

            {/* DESCRIPTION */}

            <section className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-sm">

              <h2 className="text-2xl font-semibold text-neutral-950">
                {locale === "ne"
                  ? "विवरण"
                  : "Description"}
              </h2>

              <p className="mt-4 text-base leading-8 text-neutral-700">
                {translation.description ||
                  (locale === "ne"
                    ? "विवरण उपलब्ध छैन।"
                    : "No description available.")}
              </p>

            </section>

            {/* PROBLEM */}

            <section className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-sm">

              <h2 className="text-2xl font-semibold text-neutral-950">
                {locale === "ne"
                  ? "समस्या"
                  : "The Problem"}
              </h2>

              <p className="mt-4 text-base leading-8 text-neutral-700">
                {translation.problem ||
                  (locale === "ne"
                    ? "समस्याको विवरण उपलब्ध छैन।"
                    : "No problem description available.")}
              </p>

            </section>

            {/* ACTION */}

            <section className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-sm">

              <h2 className="text-2xl font-semibold text-neutral-950">
                {locale === "ne"
                  ? "कार्य"
                  : "The Action"}
              </h2>

              <p className="mt-4 text-base leading-8 text-neutral-700">
                {translation.action ||
                  (locale === "ne"
                    ? "कार्यको विवरण उपलब्ध छैन।"
                    : "No action description available.")}
              </p>

            </section>

            {/* OUTCOME */}

            <section className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-sm">

              <h2 className="text-2xl font-semibold text-neutral-950">
                {locale === "ne"
                  ? "नतिजा"
                  : "The Outcome"}
              </h2>

              <p className="mt-4 text-base leading-8 text-neutral-700">
                {translation.outcome ||
                  (locale === "ne"
                    ? "नतिजाको विवरण उपलब्ध छैन।"
                    : "No outcome description available.")}
              </p>

            </section>

          </div>

          {/* ================================================= */}
          {/* SIDEBAR */}
          {/* ================================================= */}

          <aside className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-sm">

            <div className="space-y-6">

              {/* DATE */}

              <div>
                <p className="text-lg font-semibold uppercase">
                  {locale === "ne"
                    ? "मिति"
                    : "Date"}
                </p>

                <p className="mt-3 text-sm font-semibold text-neutral-500">
                  {work.completedDate
                    ? new Date(
                        work.completedDate,
                      ).toLocaleDateString(
                        locale === "ne"
                          ? "ne-NP"
                          : "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )
                    : "TBD"}
                </p>
              </div>

              {/* LOCATION */}

              <div>
                <p className="text-lg font-semibold uppercase">
                  {locale === "ne"
                    ? "स्थान"
                    : "Location"}
                </p>

                <p className="mt-3 text-sm font-semibold text-neutral-500">
                  {translation.location ||
                    work.ward}
                </p>
              </div>

              {/* EVENT TYPE */}

              <div>
                <p className="text-lg font-semibold uppercase">
                  {locale === "ne"
                    ? "कार्यक्रमको प्रकार"
                    : "Event Type"}
                </p>

                <p className="mt-3 text-sm font-semibold text-neutral-500">
                  {translation.eventTypes ||
                    (locale === "ne"
                      ? "आयोजना"
                      : "Project Update")}
                </p>
              </div>

              {/* EVENT CATEGORY */}

              <div>
                <p className="text-lg font-semibold uppercase">
                  {locale === "ne"
                    ? "कार्यक्रमको वर्ग"
                    : "Event Category"}
                </p>

                <p className="mt-3 text-sm font-semibold text-neutral-500">
                  {translation.eventCategory ||
                    translation.category}
                </p>
              </div>

              {/* PROJECT ID */}

              <div>
                <p className="text-lg font-semibold uppercase">
                  Project ID
                </p>

                <p className="mt-3 text-sm font-semibold text-neutral-500">
                  {work.projectId}
                </p>
              </div>

            </div>

          </aside>

        </div>
      </div>
    </main>
  );
}