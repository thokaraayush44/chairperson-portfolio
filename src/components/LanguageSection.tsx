import React from "react";

export function LanguageSection() {
  const langs = ["Nepali", "English", "Local Dialect"];

  return (
    <section className="mx-auto max-w-6xl px-6 py-6">
      <h3 className="mb-4 text-xl font-semibold text-slate-900">Languages</h3>
      <div className="flex flex-wrap gap-3">
        {langs.map((l) => (
          <span
            key={l}
            className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-800"
          >
            {l}
          </span>
        ))}
      </div>
    </section>
  );
}
