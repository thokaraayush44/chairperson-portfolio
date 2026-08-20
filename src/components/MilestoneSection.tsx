import { getTranslations } from "next-intl/server";

export async function MilestoneSection() {
  const t = await getTranslations("Milestones");

  const cards = [
    {
      title: t("cards.youthVolunteer.title"),
      desc: t("cards.youthVolunteer.desc"),
      badge: t("cards.youthVolunteer.badge"),
      color: "bg-rose-900",
    },
    {
      title: t("cards.floodRelief.title"),
      desc: t("cards.floodRelief.desc"),
      badge: t("cards.floodRelief.badge"),
      color: "bg-slate-900",
    },
    {
      title: t("cards.farmersCooperative.title"),
      desc: t("cards.farmersCooperative.desc"),
      badge: t("cards.farmersCooperative.badge"),
      color: "bg-red-600",
    },
    {
      title: t("cards.schoolCommittee.title"),
      desc: t("cards.schoolCommittee.desc"),
      badge: t("cards.schoolCommittee.badge"),
      color: "bg-emerald-700",
    },
  ];

  return (
    <section className="mx-auto max-w-full bg-[#F5F2EC] px-22 py-12">
      <h3 className="mb-6 font-serif text-3xl font-semibold text-slate-900">
        {t("title")}
      </h3>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="rounded-3xl bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white ${card.color}`}
              >
                {card.badge}
              </div>

              <div className="text-md font-semibold">
                {card.title}
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              {card.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}