import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type News = {
  _id: string;
  title: string;
  description: string;
  image?: string;
  date: string;
};

type NewsDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NewsDetailPage({
  params,
}: NewsDetailPageProps) {
  const { id } = await params;

  const response = await fetch(
    `http://localhost:3000/api/news/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    notFound();
  }

  const result = await response.json();

  const news: News = result.data;

  if (!news) {
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
            Home &gt; News &gt; {news.title}
          </p>
        </div>

        {/* News */}
        <article className="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm">

          {/* Image */}
          {news.image && (
            <div className="relative h-[400px] w-full">
              <Image
                src={news.image}
                alt={news.title}
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

            <h1 className="mt-3 text-4xl font-serif font-semibold leading-tight text-neutral-950 sm:text-5xl">
              {news.title}
            </h1>

            <p className="mt-4 text-sm text-neutral-500">
              {new Date(news.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            <div className="my-8 h-px bg-neutral-200" />

            <p className="text-base leading-8 text-neutral-700">
              {news.description}
            </p>

          </div>
        </article>
      </div>
    </main>
  );
}