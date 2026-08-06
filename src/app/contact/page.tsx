import React from "react";
import { Container } from "@/components/Container";
import { PageTitleBanner } from "@/components/PageTitleBanner";

const page = () => {
  return (
    <main className="pt-18.5 flex flex-col gap-[10px]">

      <Container className="flex flex-col gap-[10px]">
        <PageTitleBanner title="Contact" breadcrumb="Home > Contact" />
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <section className="space-y-8">
            <p className="text-lg leading-8 text-slate-700">
              If you have questions, suggestions, or ideas for ward development, please reach out.
              Our office is ready to support residents, partners, and local organizations across Kalikot.
            </p>

            <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">Send a Message</h2>
              <p className="mt-3 text-base leading-7 text-slate-600">
                Use the information below to get in touch directly, or visit our office during working hours.
              </p>

              <div className="mt-8 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Office</h3>
                  <p className="mt-2 text-base text-slate-700">Ward Office, Kalikot Municipality</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Phone</h3>
                  <p className="mt-2 text-base text-slate-700">+977 1234 567890</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Email</h3>
                  <p className="mt-2 text-base text-slate-700">office@kalikotward.gov.np</p>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-10 rounded-3xl bg-slate-50 p-10 shadow-sm">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Office Hours</h2>
              <ul className="mt-6 space-y-3 text-slate-600">
                <li className="rounded-2xl bg-white p-4 shadow-sm">
                  <span className="font-medium text-slate-800">Monday – Friday</span>
                  <p className="text-sm text-slate-500">10:00 AM — 5:00 PM</p>
                </li>
                <li className="rounded-2xl bg-white p-4 shadow-sm">
                  <span className="font-medium text-slate-800">Saturday</span>
                  <p className="text-sm text-slate-500">10:00 AM — 2:00 PM</p>
                </li>
                <li className="rounded-2xl bg-white p-4 shadow-sm">
                  <span className="font-medium text-slate-800">Sunday</span>
                  <p className="text-sm text-slate-500">Closed</p>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Visit Us</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Ward Office, Kalikot Municipality
                <br />
                Main Road, District Headquarters
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </main>
  );
};

export default page;
