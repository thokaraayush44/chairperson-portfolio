import Image from "next/image";
import Link from "next/link";

const newsItems = [
  {
    id: "health-post",
    label: "KALTIPUR · JUL 20, 2026",
    title: "Chairperson Inaugurates New Health Post in Ward 9",
    description: "The facility will serve over 2,000 residents across three remote wards...",
    image: "/images/News1.jpg",
  },
  {
    id: "annual-budget",
    label: "GORAKHPATRA · JUL 12, 2026",
    title: "District Coordination Committee Approves Annual Budget",
    description: "The approved budget prioritizes rural roads, drinking water, and health infrastructure...",
    image: "/images/News2.jpg",
  },
  {
    id: "road-progress",
    label: "SETOPATI · JUL 06, 2026",
    title: "Chairperson Meets Ward Chairs to Review Rural Road Progress",
    description: "A coordination meeting reviewed timelines for the ongoing blacktopping project...",
    image: "/images/News3.jpg",
  },
];

export function LatestNews() {
  return (
    <section className="mt-16 bg-white px-6 py-12 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-4xl font-serif font-semibold tracking-[0.3em] text-blackground">Latest News</p>
          </div>
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 font-semibold text-rose-900"
          >
            View All News
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                d="M5 12h14m0 0l-6-6m6 6l-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        <div className="space-y-4">
          {newsItems.map((item) => (
            <article
              key={item.id}
              className="flex flex-col gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center"
            >
              <div className="relative h-28 w-full overflow-hidden rounded-3xl bg-slate-100 sm:h-24 sm:w-40">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-900/80">
                  {item.label}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              </div>

              <div className="flex items-center sm:justify-end">
                <Link
                  href={`/news/${item.id}`}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                >
                  View Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
