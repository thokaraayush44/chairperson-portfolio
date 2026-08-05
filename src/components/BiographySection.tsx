import React from "react";

export function BiographySection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-8 lg:grid-cols-3 items-start">
        <div className="col-span-1">
          <div className="h-64 w-full overflow-hidden rounded-lg bg-slate-200" />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">A Life Rooted in Kalikot</h2>
          <p className="text-base leading-7 text-slate-700">
            Bishnu Bahadur Rokaya has served the people of Kalikot with a focus on rural
            infrastructure, healthcare access, and transparent local governance. Elected in
            2079, his tenure emphasizes inclusive development and strengthening community-led
            services across the district.
          </p>

          <p className="text-base leading-7 text-slate-700">
            Over decades of public service, he has worked closely with local leaders and
            civil society to deliver practical solutions tailored to the needs of each ward.
            This biography highlights key roles, early life, and the commitments guiding his
            public work.
          </p>
        </div>
      </div>
    </section>
  );
}
