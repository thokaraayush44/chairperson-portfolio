import Image from "next/image";
import Link from "next/link";

const speeches = [
  {
    id: "annual-budget-address",
    date: "JUL 12, 2026",
    title: "Annual Budget Address to the District Assembly",
    image: "/images/news1.jpg",
    href: "/news/annual-budget-address",
  },
  {
    id: "province-development-speech",
    date: "JUN 15, 2026",
    title: "Speech at Karnali Province Development Forum",
    image: "/images/speeches1.jpg",
    href: "/news/province-development-speech",
  },
  {
    id: "health-post-inauguration",
    date: "JUL 20, 2026",
    title: "Health Post Inauguration Remarks, Ward 9",
    image: "/images/speeches2.jpg",
    href: "/news/health-post-inauguration",
  },
];

const pressPhotos = [
  {
    id: "health-post-inauguration-ward-9",
    title: "Health Post Inauguration, Ward 9",
    image: "/images/news5.jpg",
  },
  {
    id: "annual-budget-session",
    title: "Annual Budget Session, DCC Hall",
    image: "/images/news1.jpg",
  },
  {
    id: "rural-road-site-visit",
    title: "Rural Road Site Visit, Ward 4",
    image: "/images/news4.jpg",
  },
  {
    id: "drinking-water-launch",
    title: "Drinking Water Scheme Launch",
    image: "/images/news7.jpg",
  },
  {
    id: "community-meeting-ward-2",
    title: "Community Meeting, Ward 2",
    image: "/images/news6.jpg",
  },
  {
    id: "province-development-forum",
    title: "Karnali Province Development Forum",
    image: "/images/news2.jpg",
  },
];

export function SpeechesSection() {
  return (
    <section className="mt-20 bg-white">
      <div className="mx-auto max-w-7xl w-full px-9 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-4xl font-serif font-semibold tracking-[0.02em] text-slate-950">
            Speeches & Public Appearances
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {speeches.map((speech) => (
            <article key={speech.id} className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-black/5">
              <Link href={speech.href} className="group block">
                <div className="relative overflow-hidden bg-slate-100">
                  <div className="aspect-[5/3] w-full transition duration-300 group-hover:scale-[1.09]">
                    <Image
                      src={speech.image}
                      alt={speech.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1280px) 430px, (min-width: 768px) 33vw, 100vw"
                    />
                  </div>

                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/80 bg-white/90 shadow-lg">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-900">
                        <path d="M10 8l6 4-6 4V8Z" fill="currentColor" />
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="space-y-3 px-5 pb-6 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-900/80">
                    {speech.date}
                  </p>
                  <h3 className="text-lg font-semibold text-slate-950">
                    {speech.title}
                  </h3>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-16">
          <div className="mb-8">
            <h3 className="text-3xl font-serif font-semibold tracking-[0.02em] text-slate-950">
              Press Photo Gallery
            </h3>
            <p className="mt-2 text-sm text-slate-600">Click any photo to view full size</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pressPhotos.map((photo) => (
              <article key={photo.id} className="overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-black/5">
                <div className="relative overflow-hidden bg-slate-100">
                  <div className="aspect-[5/3] w-full">
                    <Image
                      src={photo.image}
                      alt={photo.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1280px) 420px, (min-width: 768px) 50vw, 100vw"
                    />
                  </div>
                </div>

                <div className="px-4 py-4 text-sm text-slate-700">
                  {photo.title}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 mb-12 rounded-[1.5rem] border border-rose-900 bg-rose-50/30 p-6 text-sm text-slate-900 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold text-rose-900/80">
                  Media & Press Inquiries
                </p>
                <p className="mt-1 font-semibold text-slate-900">[Press/Media Officer Name], Media Coordinator</p>
              </div>

              <div className="space-y-2 text-sm text-slate-900 sm:text-right">
                <p>Phone: +977-98XXXXXXXX</p> 
                <p>Email: press@kalikot.gov.np</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
