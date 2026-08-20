import { getTranslations } from "next-intl/server";

export async function EducationSection() {
  const t = await getTranslations("Education");

  const items = [
    {
      title: t("items.masters.title"),
      subtitle: t("items.masters.subtitle"),
      year: t("items.masters.year"),
    },
    {
      title: t("items.bachelors.title"),
      subtitle: t("items.bachelors.subtitle"),
      year: t("items.bachelors.year"),
    },
    {
      title: t("items.higherSecondary.title"),
      subtitle: t("items.higherSecondary.subtitle"),
      year: t("items.higherSecondary.year"),
    },
  ];

  return (
    <section className="py-12">
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-10 xl:px-12">
        
        <h2 className="mb-12 font-serif text-4xl font-bold text-slate-900">
          {t("title")}
        </h2>

        <div>
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between gap-6 py-6 ${
                idx !== items.length - 1
                  ? "border-b border-slate-200"
                  : ""
              }`}
            >
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {item.subtitle}
                </p>
              </div>

              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
                {item.year}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}