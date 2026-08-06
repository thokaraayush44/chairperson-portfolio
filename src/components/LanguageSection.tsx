import React from "react";

export function LanguageSection() {
  const langs = ["Nepali", "English", "Khas", "Hindi"];

  return (
    <section className="mx-auto w-full max-w-[1440px] px-12 py-6">
      <h3 className="mb-4 text-3xl font-bold text-slate-900">Languages Spoken</h3>
      <div className="flex flex-wrap gap-3">
        {langs.map((l) => (
          <span
            key={l}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700"
          >
            {l}
          </span>
        ))}
      </div>
    </section>
  );
}
