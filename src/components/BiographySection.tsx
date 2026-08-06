import React from "react";

export function BiographySection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-17">
        <div className="col-span-1 flex flex-col items-center gap-4">
          <div className="flex h-120 w-100 items-center justify-center overflow-hidden rounded-lg bg-slate-200">
            <p className="text-center text-sm text-slate-500">Portrait Photograph</p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4 ">
          <p className="font-bold text-primary-100 uppercase text-sm">
            Early Life & Background
          </p>
          <h2 className="text-3xl font-serif font-bold text-slate-900">A Life Rooted in Kalikot</h2>
          <p className="text-base leading-7 text-slate-700">
            Born in a small farming household in Ward 3 of Kalikot, [Chairperson Name] grew up amid the district’s rugged hills, where access to schools, health posts, and roads was scarce. His father worked as a school teacher and his mother managed the family’s land, instilling in him early values of discipline, service, and community responsibility.
          </p>

          <p className="text-base leading-7 text-slate-700">
            As the eldest of four siblings, he took on early responsibility for his family, walking several hours daily to attend school in the neighboring ward. These formative years, shaped by hardship and resilience, would later define his commitment to rural development and equitable access to public services.
          </p>
          <p className="text-base leading-7 text-slate-700">
            His early exposure to the everyday struggles of Kalikot’s farmers and laborers laid the foundation for a lifelong dedication to grassroots governance and community-driven development.
          </p>
        </div>
      </div>
    </section>
  );
}
