import React from "react";

type ContactInfoAndMapProps = {
  className?: string;
  title?: string;
  description?: string;
  officeAddress?: string;
  officePhone?: string;
  publicEmail?: string;
  officeHours?: string;
  publicMeetingHours?: string;
  secretaryContact?: string;
  mapTitle?: string;
  mapSubtitle?: string;
  mapSrc?: string;
};

export function ContactInfoAndMap({
  className = "grid gap-8 border border-slate-200 bg-[#F5F2EC] p-8 shadow-sm md:grid-cols-[1.6fr_1fr] lg:p-10",
  title = "Office Contact Information",
  description = "Reach the Chairperson's Office for inquiries, public meetings, or support services. Our team is available during regular office hours to serve residents and stakeholders across Kalikot.",
  officeAddress = "Chairperson's Office, Kalikot District Coordination Committee, Manma, Ward No. 4, Kalikot",
  officePhone = "+977-89-420123",
  publicEmail = "chairperson@kalikot.gov.np",
  officeHours = "Sunday – Friday, 10:00 AM – 5:00 PM",
  publicMeetingHours = "Public meeting hours: 11:00 AM – 1:00 PM",
  secretaryContact = "Personal Secretary, [Secretary Name] – +977-98XXXXXXXX",
  mapTitle = "Office Location",
  mapSubtitle = "Manma, Kalikot District Coordination Committee Office",
  mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3587.323644893247!2d82.16298417565907!3d29.333613682156938!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3995f4ae67dd00db%3A0x9e0f2a0d3de1fabc!2sManma%2C%20Kalikot%2C%20Nepal!5e0!3m2!1sen!2sus!4v1700000000000"
}: ContactInfoAndMapProps) {
  return (
    <section className={className}>
      <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-3xl font-semibold text-slate-900">{title}</h2>
        <p className="max-w-2xl text-base leading-7 text-slate-600">{description}</p>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-amber-700">Office Address</p>
            <p className="mt-2 text-base text-slate-700">{officeAddress}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-700">Office Phone</p>
            <p className="mt-2 text-base text-slate-700">{officePhone}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-700">Public Email</p>
            <p className="mt-2 text-base text-slate-700">{publicEmail}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-700">Office Hours</p>
            <p className="mt-2 text-base text-slate-700">{officeHours}</p>
            <p className="text-sm text-slate-500">{publicMeetingHours}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-700">Secretary / Staff Contact</p>
            <p className="mt-2 text-base text-slate-700">{secretaryContact}</p>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <p className="text-md tracking-[0.24em] text-slate-500">Google Maps Embed</p>
          <h3 className="mt-3 text-2xl font-semibold text-slate-900">{mapTitle}</h3>
          <p className="mt-2 text-sm text-slate-500">{mapSubtitle}</p>
        </div>
        <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
          <iframe
            title="Kalikot Office Location"
            className="h-[320px] w-full"
            loading="lazy"
            src={mapSrc}
          />
        </div>
      </div>
    </section>
  );
}
