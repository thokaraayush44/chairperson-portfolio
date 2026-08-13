"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/Container";
import { PageTitleBanner } from "@/components/PageTitleBanner";
import { NewsCard } from "@/components/NewsCard";
import { SpeechesSection } from "@/components/SpeechesSection";

type News = {
  _id: string;
  title: string;
  description: string;
  image?: string;
  date: string;
};

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news");

        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }

        const result = await response.json();

        setNews(result.data);
      } catch (error) {
        console.error("Failed to fetch news:", error);
        setError("Failed to load news.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <main>
        <Container>
          <div className="py-20 text-center text-neutral-600">
            Loading news...
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
    <main className="pt-18.5 flex flex-col  gap-[10px]">
      <PageTitleBanner
        title="News"
        breadcrumb="Home > News"
      />

      <Container>
        <h1 className="mt-10 text-center text-4xl font-serif font-semibold text-neutral-900">
          Latest News
        </h1>

        {news.length === 0 ? (
          <div className="my-10 rounded-3xl border border-neutral-200 bg-white p-10 text-center text-neutral-600">
            No news available.
          </div>
        ) : (
          <section className="mx-auto my-10 grid max-w-7xl gap-12 md:grid-cols-2 xl:grid-cols-2">
            {news.map((item) => (
              <NewsCard
                key={item._id}
                project={item}
              />
            ))}
          </section>
        )}

        <SpeechesSection />
      </Container>
    </main>
  );
}