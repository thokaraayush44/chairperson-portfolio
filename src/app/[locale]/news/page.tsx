"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { Container } from "@/components/Container";
import { PageTitleBanner } from "@/components/PageTitleBanner";
import { NewsCard } from "@/components/NewsCard";
import { SpeechesSection } from "@/components/SpeechesSection";

type NewsTranslation = {
  locale: "en" | "ne";
  title: string;
  description: string;
};

type News = {
  _id: string;

  translations: NewsTranslation[];

  image?: string;

  date: string;
};

export default function NewsPage() {
  const t = useTranslations("News");

  const locale = useLocale() as "en" | "ne";

  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

        if (Array.isArray(result)) {
          setNews(result);
        } else if (Array.isArray(result.data)) {
          setNews(result.data);
        } else {
          setNews([]);
        }
      } catch (error) {
        console.error("Failed to fetch news:", error);

        setError(t("errors.loadFailed"));
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [t]);

  if (loading) {
    return (
      <main>
        <Container>
          <div className="py-20 text-center text-neutral-600">
            {t("loading")}
          </div>
        </Container>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <Container>
          <div className="py-20 text-center text-red-600">
            {error}
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="pt-18.5 flex flex-col gap-[10px]">
      <PageTitleBanner
        title={t("pageTitle")}
        breadcrumb={t("breadcrumb")}
      />

      <section className="bg-white px-16 py-16">
        <h1 className="font-serif text-[36px] font-bold text-[#221F1A]">
          {t("latestNews")}
        </h1>

        {news.length === 0 ? (
          <div className="my-10 rounded-3xl border border-neutral-200 bg-white p-10 text-center text-neutral-600">
            {t("noNews")}
          </div>
        ) : (
          <section className="mt-9 grid grid-cols-1 gap-x-[59px] gap-y-[39px] md:grid-cols-2">
            {news.map((item) => {
              const translation =
                item.translations?.find(
                  (itemTranslation) =>
                    itemTranslation.locale === locale,
                );

              return (
                <NewsCard
                  key={item._id}
                  project={{
                    _id: item._id,
                    title:
                      translation?.title || "",
                    description:
                      translation?.description || "",
                    image: item.image,
                    date: item.date,
                  }}
                />
              );
            })}
          </section>
        )}

        <SpeechesSection />
      </section>
    </main>
  );
}