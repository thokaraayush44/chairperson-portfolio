import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";

type Locale = "en" | "ne";

type NewsTranslation = {
  locale: Locale;
  title: string;
  description: string;
};

type News = {
  _id: string;
  translations: NewsTranslation[];
  image?: string;
  date: string;
};

type NewsDetailPageProps = {
  params: Promise<{
    locale: Locale;
    id: string;
  }>;
};

export default async function NewsDetailPage({
  params,
}: NewsDetailPageProps) {
  const { id, locale } = await params;

  const response = await fetch(
    `http://localhost:3000/api/news/${id}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    notFound();
  }

  const result = await response.json();

  const news: News = result.data;

  if (!news) {
    notFound();
  }

  // =====================================================
  // GET CURRENT LANGUAGE TRANSLATION
  // =====================================================

  const translation =
    news.translations?.find(
      (item) => item.locale === locale,
    ) ||
    news.translations?.find(
      (item) => item.locale === "en",
    );

  if (!translation) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-5xl px-6 py-12">

        {/* Back */}
        <div className="mb-8">
          <Link
            href="/news"
            className="text-sm font-semibold text-rose-900 hover:text-rose-950"
          >
            ← Back to News
          </Link>

          <p className="mt-3 text-sm text-neutral-500">
            Home &gt; News &gt; {translation.title}
          </p>
        </div>

        {/* News */}
        <article className="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm">

          {/* Image */}
          {news.image && (
            <div className="relative h-[400px] w-full">
              <Image
                src={news.image}
                alt={translation.title}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8 sm:p-12">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-900">
              Latest News
            </p>

            {/* TITLE */}
            <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight text-neutral-950 sm:text-5xl">
              {translation.title}
            </h1>

            {/* DATE */}
            <p className="mt-4 text-sm text-neutral-500">
              {new Date(news.date).toLocaleDateString(
                locale === "ne" ? "ne-NP" : "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              )}
            </p>

            <div className="my-8 h-px bg-neutral-200" />

            {/* DESCRIPTION */}
            <p className="text-base leading-8 text-neutral-700">
              {translation.description}
            </p>

          </div>
        </article>
      </div>
    </main>
  );
}