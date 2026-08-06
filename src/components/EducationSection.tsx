import React from "react";

export function EducationSection() {
  const items = [
    {
      title: "Master of Arts in Rural Development",
      subtitle: "Tribhuvan University",
      year: "2071",
    },
    {
      title: "Bachelor of Arts, Political Science",
      subtitle: "Mahendra Multiple Campus, Surkhet",
      year: "2066",
    },
    {
      title: "Higher Secondary Education (10+2)",
      subtitle: "Kalikot Secondary School",
      year: "2062",
    },
  ];

  return (
    <section className="py-12">
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-10 xl:px-12">
        <h2 className="mb-12 text-4xl font-bold font-serif text-slate-900">
          Education
        </h2>

        <div>
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between gap-6 py-6 ${
                idx !== items.length - 1 ? "border-b border-slate-200" : ""
              }`}
            >
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {item.subtitle}
                </p>
              </div>

              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium font-bold text-slate-700">
                {item.year}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}