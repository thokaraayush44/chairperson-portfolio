"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function HeroContent() {
  const t = useTranslations("Hero");

  return (
    <>
      {/* Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(74,10,23,0.28),rgba(26,3,10,0.56))]" />

      {/* Hero Content */}
      <div className="relative z-10 mx-auto grid h-full w-full max-w-[1300px] grid-cols-1 items-end gap-10 px-4 lg:grid-cols-[1.1fr_0.9fr] lg:px-6 xl:px-0">

        {/* Portrait */}
        <div className="relative h-[590px] w-full">
          <Image
            src="/images/image2.png"
            alt="Bishnu Bahadur Rokaya"
            fill
            priority
            className="object-contain object-bottom"
          />
        </div>

        {/* Right Content */}
        <div className="z-20 flex flex-col items-start justify-center pb-16 lg:pb-24">

          {/* Affiliation */}
          <div className="mb-5 flex items-center gap-2">
            <Image
              src="/icons/logo1.png"
              alt="Affiliation"
              width={20}
              height={20}
            />

            <span className="text-sm text-white">
              {t("affiliation")}
            </span>
          </div>

          {/* Subtitle */}
          <p className="mb-4 text-sm font-semibold tracking-wider text-[#D4AF37]">
            {t("subtitle")}
          </p>

          {/* Title */}
          <h1 className="mb-5 font-serif text-5xl font-semibold leading-[1.15] text-white lg:text-6xl">
            {t("titleFirst")}
            <br />
            {t("titleLast")}
          </h1>

          {/* Description */}
          <p className="mb-8 text-base leading-8 text-white/90">
            {t("descriptionFirst")}
            <br />
            {t("descriptionSecond")}
          </p>

          {/* Buttons */}
          <div className="flex gap-4">
            <Link
              href="/work"
              className="rounded-md bg-[#8a1538] px-6 py-3 font-medium text-white transition hover:bg-primary"
            >
              {t("viewWork")}
            </Link>

            <Link
              href="/contact"
              className="rounded-md border border-black bg-white px-6 py-3 font-semibold text-foreground transition hover:bg-gray-100"
            >
              {t("contact")}
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}