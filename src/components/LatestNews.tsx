"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

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

type DisplayNews = {
  _id: string;
  title: string;
  description: string;
  image?: string;
  date: string;
};

export function LatestNews() {
  const t = useTranslations("LatestNews");

  const locale = useLocale() as Locale;

  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH NEWS
  // =====================================================

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }

        const result = await response.json();

        const data = Array.isArray(result)
          ? result
          : result.data;

        setNews(
          Array.isArray(data)
            ? data.slice(0, 3)
            : [],
        );
      } catch (error) {
        console.error(
          "Failed to fetch news:",
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // =====================================================
  // LOCALIZE NEWS
  // =====================================================

  const localizedNews = useMemo<DisplayNews[]>(() => {
    return news
      .map((item) => {
        /*
         * First try current language.
         *
         * /en -> English
         * /ne -> Nepali
         */

        const translation =
          item.translations?.find(
            (translation) =>
              translation.locale === locale,
          ) ||
          /*
           * Fallback to English.
           */
          item.translations?.find(
            (translation) =>
              translation.locale === "en",
          );

        if (!translation) {
          return null;
        }

        return {
          _id: item._id,

          title: translation.title,

          description:
            translation.description,

          image: item.image,

          date: item.date,
        };
      })
      .filter(
        (
          item,
        ): item is DisplayNews =>
          item !== null,
      );
  }, [news, locale]);

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
            {localizedNews.map((item) => (
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

                  {/* Label + Date */}

                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-900/80">
                    {t("label")} ·{" "}
                    {new Date(
                      item.date,
                    ).toLocaleDateString(
                      locale === "ne"
                        ? "ne-NP"
                        : "en-US",
                      {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      },
                    )}
                  </p>

                  {/* Localized Title */}

                  <h3 className="mt-2 text-lg font-semibold text-slate-950">
                    {item.title}
                  </h3>

                  {/* Localized Description */}

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