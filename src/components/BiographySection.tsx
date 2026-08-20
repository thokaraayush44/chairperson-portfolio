import { getTranslations } from "next-intl/server";

export async function BiographySection() {
  const t = await getTranslations("Biography");

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-17">

        {/* Portrait */}
        <div className="col-span-1 flex flex-col items-center gap-4">
          <div className="flex h-120 w-100 items-center justify-center overflow-hidden rounded-lg bg-slate-200">
            <p className="text-center text-sm text-slate-500">
              {t("portrait")}
            </p>
          </div>
        </div>

        {/* Biography */}
        <div className="space-y-4 lg:col-span-2">

          <p className="text-sm font-bold uppercase text-primary-100">
            {t("label")}
          </p>

          <h2 className="font-serif text-3xl font-bold text-slate-900">
            {t("title")}
          </h2>

          <p className="text-base leading-7 text-slate-700">
            {t("paragraph1")}
          </p>

          <p className="text-base leading-7 text-slate-700">
            {t("paragraph2")}
          </p>

          <p className="text-base leading-7 text-slate-700">
            {t("paragraph3")}
          </p>

        </div>
      </div>
    </section>
  );
}