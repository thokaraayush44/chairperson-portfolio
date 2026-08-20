import { getTranslations } from "next-intl/server";

export async function LanguageSection() {
  const t = await getTranslations("Languages");

  const langs = [
    t("items.nepali"),
    t("items.english"),
    t("items.khas"),
    t("items.hindi"),
  ];

  return (
    <section className="mx-auto w-full max-w-[1440px] px-12 py-6">
      <h3 className="mb-4 text-3xl font-bold text-slate-900">
        {t("title")}
      </h3>

      <div className="flex flex-wrap gap-3">
        {langs.map((language) => (
          <span
            key={language}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700"
          >
            {language}
          </span>
        ))}
      </div>
    </section>
  );
}