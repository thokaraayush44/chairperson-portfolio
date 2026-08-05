import React from "react";

export function AwardsSection() {
  const awards = [
    { title: "Local Governance Medal", year: "2022" },
    { title: "Outstanding Rural Development", year: "2020" },
    { title: "Community Service Award", year: "2019" },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <h3 className="mb-6 text-xl font-semibold text-slate-900">Awards & Recognition</h3>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {awards.map((a, idx) => (
          <div key={idx} className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">{a.title}</div>
            <div className="mt-2 text-sm text-slate-500">{a.year}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
