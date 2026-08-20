"use client";

import React from "react";
import { useTranslations } from "next-intl";

type ContactInfoAndMapProps = {
  className?: string;
  mapSrc?: string;
};

export function ContactInfoAndMap({
  className = "grid gap-8 border border-slate-200 bg-[#F5F2EC] p-8 shadow-sm md:grid-cols-[1.6fr_1fr] lg:p-10",
  mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3587.323644893247!2d82.16298417565907!3d29.333613682156938!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3995f4ae67dd00db%3A0x9e0f2a0d3de1fabc!2sManma%2C%20Kalikot%2C%20Nepal!5e0!3m2!1sen!2sus!4v1700000000000",
}: ContactInfoAndMapProps) {
  const t = useTranslations("Contact");

  return (
    <section className={className}>
      {/* Contact Information */}
      <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-3xl font-semibold text-slate-900">
          {t("officeContactInformation")}
        </h2>

        <p className="max-w-2xl text-base leading-7 text-slate-600">
          {t("description")}
        </p>

        <div className="space-y-4">
          {/* Office Address */}
          <div>
            <p className="text-sm font-semibold text-amber-700">
              {t("officeAddress.label")}
            </p>

            <p className="mt-2 text-base text-slate-700">
              {t("officeAddress.value")}
            </p>
          </div>

          {/* Office Phone */}
          <div>
            <p className="text-sm font-semibold text-amber-700">
              {t("officePhone.label")}
            </p>

            <p className="mt-2 text-base text-slate-700">
              {t("officePhone.value")}
            </p>
          </div>

          {/* Public Email */}
          <div>
            <p className="text-sm font-semibold text-amber-700">
              {t("publicEmail.label")}
            </p>

            <p className="mt-2 text-base text-slate-700">
              {t("publicEmail.value")}
            </p>
          </div>

          {/* Office Hours */}
          <div>
            <p className="text-sm font-semibold text-amber-700">
              {t("officeHours.label")}
            </p>

            <p className="mt-2 text-base text-slate-700">
              {t("officeHours.value")}
            </p>

            <p className="text-sm text-slate-500">
              {t("officeHours.meetingHours")}
            </p>
          </div>

          {/* Secretary */}
          <div>
            <p className="text-sm font-semibold text-amber-700">
              {t("secretaryContact.label")}
            </p>

            <p className="mt-2 text-base text-slate-700">
              {t("secretaryContact.value")}
            </p>
          </div>
        </div>
      </div>

      {/* Google Map */}
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <p className="text-md tracking-[0.24em] text-slate-500">
            {t("googleMapsEmbed")}
          </p>

          <h3 className="mt-3 text-2xl font-semibold text-slate-900">
            {t("officeLocation")}
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            {t("mapSubtitle")}
          </p>
        </div>

        <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
          <iframe
            title={t("mapIframeTitle")}
            className="h-[320px] w-full"
            loading="lazy"
            src={mapSrc}
          />
        </div>
      </div>
    </section>
  );
}