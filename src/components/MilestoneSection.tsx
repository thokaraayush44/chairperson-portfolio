import React from "react";

export function MilestoneSection() {
  const cards = [
    { title: "Youth Volunteer Corps", desc: "Organized youth-led sanitation and literacy campaigns across Ward 3 during his college years.", badge: "Y", color: "bg-rose-900" },
    { title: "Flood Relief Coordination", desc: "Led local relief efforts distributing food and shelter after the 2070 flash floods in Kalikot.", badge: "R", color: "bg-slate-900" },
    { title: "Farmers’ Cooperative", desc: "Co-founded a cooperative connecting smallholder farmers to fair markets across the district.", badge: "F", color: "bg-red-600" },
    { title: "School Committee Secretary", desc: "Served the local school management committee, improving enrollment and infrastructure.", badge: "S", color: "bg-emerald-700" },
  ];

  return (
    <section className="mx-auto max-w-full px-22 py-12 bg-[#F5F2EC]">
      <h3 className="mb-6 text-3xl font-serif font-semibold text-slate-900">Early Milestones</h3>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, idx) => (
          <div key={idx} className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white ${c.color}`}>
                {c.badge}
              </div>
              <div className="text-md font-semibold ">{c.title}</div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">{c.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
