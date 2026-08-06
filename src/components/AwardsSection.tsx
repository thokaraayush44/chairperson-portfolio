import React from "react";

export function AwardsSection() {
  const awards = [
    {
      title: "Best Local Governance Award",
      subtitle: "Ministry of Federal Affairs and General Administration",
      year: "2081",
    },
    {
      title: "Outstanding Rural Development Leadership",
      subtitle: "National Association of Rural Municipalities Nepal",
      year: "2080",
    },
    {
      title: "Transparency in Public Office Recognition",
      subtitle: "Transparency International Nepal Chapter",
      year: "2078",
    },
    {
      title: "Community Service Excellence Medal",
      subtitle: "Kalikot District Administration Office",
      year: "2079",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-[1440px] px-12 py-12">
      <h3 className="mb-6 text-3xl font-serif font-semibold text-slate-900">Awards & Recognition</h3>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {awards.map((a, idx) => (
          <div key={idx} className="rounded-3xl border border-slate-200 bg-[#F5F2EC] p-6 shadow-sm">
            <div className="flex items-center justify-center rounded-full border border-rose-600 bg-white h-11 w-11 text-rose-600">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="currentColor" />
              </svg>
            </div>
            <div className="mt-6 space-y-2">
              <div className="text-sm font-semibold text-slate-900">{a.title}</div>
              <div className="text-sm text-slate-500">{a.subtitle}</div>
              <div className="text-sm font-semibold text-rose-700">{a.year}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
