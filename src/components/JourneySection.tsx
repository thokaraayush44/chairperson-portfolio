import Image from "next/image";
import Link from "next/link";
import { LatestNews } from "./LatestNews";
import { ContactCta } from "./ContactCta";

export function JourneySection() {
  return (
    <section className="mt-16 bg-white shadow-[0_25px_50px_-25px_rgba(15,23,42,0.35)] ring-1 ring-black/5 sm:p-5">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="text-sm py-4 font-semibold uppercase tracking-[0.2em] text-rose-700">
            Journey of the Chairperson
          </p>
          <h2 className="mt-3 font-serif text-4xl font-bold text-slate-950 sm:text-5xl">
            Journey Through the Years
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Every milestone reflects dedication, perseverance, and a commitment to serving the community.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.9fr]">
          <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-900">
                2040–2056 B.S.
              </span>
            </div>
            <h3 className="font-serif text-2xl font-semibold text-slate-950">Early Life</h3>
            <p className="mt-2 text-sm font-semibold text-slate-700">Growing Up in Mamma, Kalikot</p>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Born and raised in a farming family in Mamma; developed an early interest in community welfare through volunteer work with the Youth Red Cross during the 2058 floods.
            </p>
            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
              <Image
                src="/images/Journey1.jpg"
                alt="Early Life in Mamma"
                width={1200}
                height={700}
                className="h-56 w-full object-cover"
              />
            </div>
          </article>

          <div className="grid gap-6">
            <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
                  2065–2074
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                  🏛️
                </div>
              </div>
              <h3 className="font-serif text-2xl font-semibold text-slate-950">Party Roles</h3>
              <p className="mt-2 text-sm font-semibold text-slate-700">Ward Secretary → District Committee Member</p>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Served as Ward-level Party Secretary before being elected to the District Party Committee, coordinating grassroots organizing efforts.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
                  <Image
                    src="/images/Journey2.jpg"
                    alt="Party committee meeting"
                    width={640}
                    height={480}
                    className="h-36 w-full object-cover"
                  />
                </div>
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
                  <Image
                    src="/images/Journey3.jpg"
                    alt="Community gathering"
                    width={640}
                    height={480}
                    className="h-36 w-full object-cover"
                  />
                </div>
              </div>
            </article>

            <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
                  2062–2065
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                  👥
                </div>
              </div>
              <h3 className="font-serif text-2xl font-semibold text-slate-950">Entry into Politics</h3>
              <p className="mt-2 text-sm font-semibold text-slate-700">Youth Member, [Party Name]</p>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Joined [Party Name] as a youth member, organizing local awareness campaigns on education and rural infrastructure across Kalikot.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-700">
                  Mobilization
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-700">
                  Advocacy
                </span>
              </div>
            </article>
          </div>

          <article className="rounded-[2rem] border border-rose-300 bg-rose-50/80 p-6 shadow-sm lg:col-span-full">
            <div className="mb-4 flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-900">
                2079–Present
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-rose-900">
                🚧
              </div>
            </div>
            <h3 className="font-serif text-2xl font-semibold text-slate-950">Ongoing Initiatives</h3>
            <p className="mt-2 text-sm font-semibold text-rose-900">Rural Development Projects</p>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Currently overseeing the Rural Road Blacktopping Project and Drinking Water Supply Scheme across multiple wards of Kalikot.
            </p>
            <div className="mt-6 rounded-full bg-white/90 p-1 ring-1 ring-rose-200">
              <div className="h-3 rounded-full bg-primary-100" style={{ width: "75%" }} />
            </div>
            <div className="mt-3 flex items-center justify-between text-sm font-semibold text-rose-900">
              <span>Progress</span>
              <span>75% Complete</span>
            </div>
          </article>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/journey"
            className="inline-flex items-center gap-1.5 font-semibold text-rose-900"
          >
            View Journey
            <Image
              src="/icons/Arrow1.svg"
              alt="arrow"
              width={16}
              height={16}
              className="h-4 w-4 shrink-0"
            />
          </Link>
        </div>
      </div>
      <LatestNews />
      <ContactCta />
    </section>
  );
}
