import { getTranslations } from "next-intl/server";

export async function AwardsSection() {
  const t = await getTranslations("Awards");

  const awards = [
    {
      title: t("items.governance.title"),
      subtitle: t("items.governance.subtitle"),
      year: t("items.governance.year"),
    },
    {
      title: t("items.ruralDevelopment.title"),
      subtitle: t("items.ruralDevelopment.subtitle"),
      year: t("items.ruralDevelopment.year"),
    },
    {
      title: t("items.transparency.title"),
      subtitle: t("items.transparency.subtitle"),
      year: t("items.transparency.year"),
    },
    {
      title: t("items.communityService.title"),
      subtitle: t("items.communityService.subtitle"),
      year: t("items.communityService.year"),
    },
  ];

  return (
    <section className="mx-auto w-full max-w-[1440px] px-12 py-12">
      <h3 className="mb-6 font-serif text-3xl font-semibold text-slate-900">
        {t("title")}
      </h3>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {awards.map((award, idx) => (
          <div
            key={idx}
            className="rounded-3xl border border-slate-200 bg-[#F5F2EC] p-6 shadow-sm"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-rose-600 bg-white text-rose-600">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                  fill="currentColor"
                />
              </svg>
            </div>

            <div className="mt-6 space-y-2">
              <div className="text-sm font-semibold text-slate-900">
                {award.title}
              </div>

              <div className="text-sm text-slate-500">
                {award.subtitle}
              </div>

              <div className="text-sm font-semibold text-rose-700">
                {award.year}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}