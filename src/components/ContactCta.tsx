"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function ContactCta() {
  const t = useTranslations("ContactCta");

  return (
    <section className="mt-16 bg-background px-72 py-64 text-white sm:px-10 sm:py-20">
      <div className="mx-auto flex max-w-[1400px] items-center justify-center rounded-[1rem] bg-[#8a1538] px-12 py-10 shadow-xl shadow-slate-900/20 sm:flex-col sm:px-6 sm:py-8">
        <div className="flex-1 text-center sm:text-center">
          <h2 className="text-4xl font-serif font-semibold text-white sm:text-3xl">
            {t("title")}
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-200">
            {t("description")}
          </p>
        </div>

        <div className="mt-8 flex justify-center sm:mt-6">
          <Link
            href="/contact"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-foreground shadow-lg shadow-rose-900/20 transition hover:bg-slate-100"
          >
            {t("button")}
          </Link>
        </div>
      </div>
    </section>
  );
}