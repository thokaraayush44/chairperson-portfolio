"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const speeches = [
  {
    id: "annual-budget-address",
    translationKey: "annualBudgetAddress",
    image: "/images/news1.jpg",
    href: "/news/annual-budget-address",
  },
  {
    id: "province-development-speech",
    translationKey: "provinceDevelopmentSpeech",
    image: "/images/speeches1.jpg",
    href: "/news/province-development-speech",
  },
  {
    id: "health-post-inauguration",
    translationKey: "healthPostInauguration",
    image: "/images/speeches2.jpg",
    href: "/news/health-post-inauguration",
  },
];

type GalleryPhoto = {
  _id: string;
  title: string;
  image: string;
  description?: string;
  date?: string;
};

export function SpeechesSection() {
  const t = useTranslations("SpeechesSection");

  const [gallery, setGallery] = useState<GalleryPhoto[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch("/api/gallery");

        if (!response.ok) {
          throw new Error("Failed to fetch gallery");
        }

        const result = await response.json();

        setGallery(result.data);
      } catch (error) {
        console.error("Failed to fetch gallery:", error);
      } finally {
        setLoadingGallery(false);
      }
    };

    fetchGallery();
  }, []);

  return (
    <section className="mt-20 bg-white">
      <div className="mx-auto w-full max-w-7xl px-9 sm:px-6 lg:px-8">

        {/* Speeches Section */}
        <div className="mb-8">
          <h2 className="font-serif text-4xl font-semibold tracking-[0.02em] text-slate-950">
            {t("title")}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {speeches.map((speech) => (
            <article
              key={speech.id}
              className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-black/5"
            >
              <Link href={speech.href} className="group block">
                <div className="relative overflow-hidden bg-slate-100">
                  <div className="aspect-[5/3] w-full transition duration-300 group-hover:scale-[1.09]">
                    <Image
                      src={speech.image}
                      alt={t(
                        `cards.${speech.translationKey}.title`
                      )}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1280px) 430px, (min-width: 768px) 33vw, 100vw"
                    />
                  </div>

                  {/* Play Button */}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/80 bg-white/90 shadow-lg">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-slate-900"
                      >
                        <path
                          d="M10 8l6 4-6 4V8Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="space-y-3 px-5 pb-6 pt-5">
                  {/* Date */}
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-900/80">
                    {t(`cards.${speech.translationKey}.date`)}
                  </p>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-slate-950">
                    {t(`cards.${speech.translationKey}.title`)}
                  </h3>

                  {/* Description */}
                  <p className="text-sm leading-6 text-slate-600">
                    {t(
                      `cards.${speech.translationKey}.description`
                    )}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Press Photo Gallery */}
        <div className="mt-16">
          <div className="mb-8">
            <h3 className="font-serif text-3xl font-semibold tracking-[0.02em] text-slate-950">
              {t("gallery.title")}
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              {t("gallery.description")}
            </p>
          </div>

          {/* Gallery */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loadingGallery ? (
              <div className="col-span-full py-10 text-center text-sm text-slate-600">
                {t("gallery.loading")}
              </div>
            ) : gallery.length === 0 ? (
              <div className="col-span-full py-10 text-center text-sm text-slate-600">
                {t("gallery.empty")}
              </div>
            ) : (
              gallery.map((photo) => (
                <article
                  key={photo._id}
                  className="overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-black/5"
                >
                  <div className="relative overflow-hidden bg-slate-100">
                    <div className="aspect-[5/3] w-full">
                      <Image
                        src={photo.image}
                        alt={photo.title}
                        fill
                        className="object-cover transition duration-300 hover:scale-105"
                        sizes="(min-width: 1280px) 420px, (min-width: 768px) 50vw, 100vw"
                      />
                    </div>
                  </div>

                  <div className="px-4 py-4 text-sm text-slate-700">
                    {photo.title}
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Media & Press */}
          <div className="mb-12 mt-12 rounded-[1.5rem] border border-rose-900 bg-rose-50/30 p-6 text-sm text-slate-900 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold text-rose-900/80">
                  {t("media.title")}
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {t("media.officer")}
                </p>
              </div>

              <div className="space-y-2 text-sm text-slate-900 sm:text-right">
                <p>
                  {t("media.phone")}: +977-98XXXXXXXX
                </p>

                <p>
                  {t("media.email")}: press@kalikot.gov.np
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}