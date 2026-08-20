"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type News = {
  _id: string;
  title: string;
  description: string;
  image?: string;
  date: string;
};

export function LatestNews() {
  const t = useTranslations("LatestNews");

  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news");

        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }

        const result = await response.json();

        setNews(result.data.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Heading */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-4xl font-serif font-semibold tracking-[0.2em] text-slate-950">
            {t("title")}
          </h2>

          <Link
            href="/news"
            className="text-sm font-semibold text-rose-900 transition hover:text-rose-950"
          >
            {t("viewAll")} →
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-10 text-center text-sm text-neutral-500">
            {t("loading")}
          </div>
        )}

        {/* News */}
        {!loading && (
          <div className="space-y-4">
            {news.map((item) => (
              <article
                key={item._id}
                className="flex flex-col gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center"
              >

                {/* Image */}
                {item.image && (
                  <div className="relative h-28 w-full overflow-hidden rounded-3xl bg-slate-100 sm:h-24 sm:w-40">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 160px"
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-900/80">
                    {t("label")} ·{" "}
                    {new Date(item.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </p>

                  {/* Backend data - DON'T translate yet */}
                  <h3 className="mt-2 text-lg font-semibold text-slate-950">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                </div>

                {/* View Details */}
                <div className="flex items-center sm:justify-end">
                  <Link
                    href={`/news/${item._id}`}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                  >
                    {t("viewDetails")}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}