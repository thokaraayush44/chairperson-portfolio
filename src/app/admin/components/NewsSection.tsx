"use client";

import { useEffect, useMemo, useState } from "react";
import AddNewsModal from "./AddNewsModal";
import EditNewsModal from "./EditNewsModal";

type NewsTranslation = {
  locale: "en" | "ne";
  title: string;
  description: string;
};

type News = {
  _id: string;
  translations: NewsTranslation[];
  image?: string;
  date?: string;
};

export default function NewsSection() {
  const [news, setNews] = useState<News[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);

  async function fetchNews() {
    try {
      setLoading(true);

      const response = await fetch("/api/news");

      if (!response.ok) {
        throw new Error("Failed to fetch news");
      }

      const data = await response.json();

      console.log("News API response:", data);

      if (Array.isArray(data)) {
        setNews(data);
      } else if (Array.isArray(data.data)) {
        setNews(data.data);
      } else {
        setNews([]);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNews();
  }, []);

  // Get English translation
  function getEnglishTranslation(item: News) {
    return item.translations?.find(
      (translation) => translation.locale === "en",
    );
  }

  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      const english = getEnglishTranslation(item);

      return english?.title
        ?.toLowerCase()
        .includes(search.toLowerCase());
    });
  }, [news, search]);

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this news?",
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/news/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete news");
      }

      setNews((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  }

  function handleAddNews() {
    setShowAddModal(true);
  }

  function handleEdit(id: string) {
    const selectedNews = news.find((item) => item._id === id);

    if (!selectedNews) return;

    setEditingNews(selectedNews);
  }

  return (
    <section className="flex flex-col gap-7">
      {/* Header */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-['Libre_Baskerville'] text-[28px] font-bold text-[#221f1a]">
            Manage News
          </h2>

          <p className="mt-1 text-[14px] text-[#4a483f]">
            Create, edit, and remove news entries shown on the public site
          </p>
        </div>

        <button
          onClick={handleAddNews}
          className="rounded-[8px] bg-[#8a1538] px-6 py-[14px] text-[16px] font-semibold text-white transition hover:bg-[#72112f]"
        >
          + Add News
        </button>
      </div>

      {/* Search */}
      <div className="w-full sm:w-[360px]">
        <input
          type="text"
          placeholder="Search news by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            h-[44px]
            w-full
            rounded-[8px]
            border
            border-[#e1d0cf]
            bg-white
            px-4
            text-[14px]
            text-[#221f1a]
            outline-none
            placeholder:text-[#4a483f]
            focus:border-[#8a1538]
          "
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-[12px] border border-[#e1d0cf] bg-white">
        {/* Table Header */}
        <div className="hidden h-[44px] items-center bg-[#f7f6f3] px-5 md:grid md:grid-cols-[64px_280px_1fr_120px_176px] md:gap-3">
          <div />

          <TableHeading>TITLE</TableHeading>

          <TableHeading>DESCRIPTION</TableHeading>

          <TableHeading>DATE</TableHeading>

          <TableHeading>ACTIONS</TableHeading>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="p-8 text-center text-sm text-[#4a483f]">
            Loading news...
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#4a483f]">
            No news found.
          </div>
        ) : (
          filteredNews.map((item) => {
            const english = getEnglishTranslation(item);

            return (
              <div
                key={item._id}
                className="
                  border-t
                  border-[#e1d0cf]
                  bg-white
                  px-5
                  py-4
                  md:grid
                  md:min-h-[88px]
                  md:grid-cols-[64px_280px_1fr_120px_176px]
                  md:items-center
                  md:gap-3
                "
              >
                {/* Image */}
                <div className="mb-3 md:mb-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={english?.title || "News image"}
                      className="h-14 w-14 rounded-[8px] object-cover"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-[8px] bg-[#c8c6bf]" />
                  )}
                </div>

                {/* Title */}
                <div className="mb-2 md:mb-0">
                  <p className="text-[14px] font-semibold text-[#221f1a]">
                    {english?.title || "-"}
                  </p>
                </div>

                {/* Description */}
                <p className="mb-3 text-[13px] text-[#4a483f] md:mb-0">
                  {english?.description || "-"}
                </p>

                {/* Date */}
                <p className="mb-3 text-[13px] text-[#4a483f] md:mb-0">
                  {formatDate(item.date)}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item._id)}
                    className="rounded-[6px] border border-[#0b1f3a] bg-white px-[14px] py-2 text-[13px] font-semibold text-[#0b1f3a]"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="rounded-[6px] border border-[#b3261e] bg-white px-[14px] py-2 text-[13px] font-semibold text-[#b3261e]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showAddModal && (
        <AddNewsModal
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchNews}
        />
      )}

      {editingNews && (
        <EditNewsModal
          news={editingNews}
          onClose={() => setEditingNews(null)}
          onSuccess={fetchNews}
        />
      )}
    </section>
  );
}

function TableHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[12px] font-semibold tracking-[0.4px] text-[#4a483f]">
      {children}
    </p>
  );
}

function formatDate(date?: string) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}