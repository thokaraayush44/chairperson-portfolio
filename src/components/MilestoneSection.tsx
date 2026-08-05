import React from "react";

export function MilestoneSection() {
  const cards = [
    { title: "Youth Volunteer Corps", desc: "Local volunteer mobilization for health camps" },
    { title: "Forest Health Coordination", desc: "Community forestry support programs" },
    { title: "Farmers' Cooperatives", desc: "Support to local cooperatives and markets" },
    { title: "School Construction", desc: "Upgraded classrooms across wards" },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <h3 className="mb-6 text-xl font-semibold text-slate-900">Early Milestones</h3>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, idx) => (
          <div key={idx} className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">{c.title}</div>
            <p className="mt-2 text-sm text-slate-600">{c.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
