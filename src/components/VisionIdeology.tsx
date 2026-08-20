import { getTranslations } from "next-intl/server";

export async function VisionIdeology() {
  const t = await getTranslations("VisionIdeology");

  return (
    <section className="mt-8 bg-[#8A1538] text-white">
      <div className="mx-auto max-w-[1440px] px-16 py-12 text-center">
        <p className="font-serif text-6xl leading-none text-[#E4C065]">
          “
        </p>

        <blockquote className="mx-auto max-w-4xl text-lg font-serif leading-8">
          "{t("quote")}"
        </blockquote>

        <div className="mt-6 text-sm text-[#E4C065]">
          {t("author")}
        </div>
      </div>
    </section>
  );
}