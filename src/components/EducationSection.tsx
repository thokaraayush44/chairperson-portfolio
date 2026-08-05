import React from "react";

export function EducationSection() {
  const items = [
    { year: "Master of Arts in Rural Development", note: "2018" },
    { year: "Bachelor of Arts, Political Science", note: "2008" },
    { year: "Higher Secondary Education (10+2)", note: "2005" },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <h3 className="mb-6 text-xl font-semibold text-slate-900">Education</h3>
      <div className="space-y-4">
        {items.map((it, idx) => (
          <div key={idx} className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-slate-800">{it.year}</div>
              <div className="text-sm text-slate-500">{it.note}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
