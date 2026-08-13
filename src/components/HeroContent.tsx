import Image from "next/image";

export default function HeroContent() {
  return (
    <>
      {/* Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(74,10,23,0.28),rgba(26,3,10,0.56))]" />

      {/* Hero Content */}
      <div className="relative z-10 mx-auto grid h-full w-full max-w-[1300px] grid-cols-1 items-end gap-10 px-4 lg:grid-cols-[1.1fr_0.9fr] lg:px-6 xl:px-0">

        {/* Portrait */}
        <div className="relative h-[590px] w-full">
          <Image
            src="/images/image2.png"
            alt="Bishnu Bahadur Rokaya"
            fill
            priority
            className="object-contain object-bottom"
          />
        </div>

        {/* Right Content */}
        <div className="z-20 flex flex-col items-start justify-center pb-16 lg:pb-24">

          {/* Affiliation */}
          <div className="mb-5 flex items-center gap-2">
            <Image
              src="/icons/logo1.png"
              alt="Affiliation"
              width={20}
              height={20}
            />

            <span className="text-sm text-white">
              Affiliation: Maoist
            </span>
          </div>

          {/* Subtitle */}
          <p className="mb-4 text-sm font-semibold tracking-wider text-[#D4AF37]">
            Chairperson, Kalikot District Coordination Committee
          </p>

          {/* Title */}
          <h1 className="mb-5 font-serif text-5xl font-semibold leading-[1.15] text-white lg:text-6xl">
            Hon. Bishnu
            <br />
            Bahadur Rokaya
          </h1>

          {/* Description */}
          <p className="mb-8 text-base leading-8 text-white/90">
            Serving the people of Kalikot with integrity,
            <br />
            transparency, and dedication.
          </p>

          {/* Buttons */}
          <div className="flex gap-4">
            <a
              href="/work"
              className="rounded-md bg-primary-100 px-6 py-3 font-medium text-white transition hover:bg-primary"
            >
              View My Work
            </a>

            <a
              href="/contact"
              className="rounded-md border border-black bg-white px-6 py-3 font-semibold text-foreground transition hover:bg-gray-100"
            >
              Contact Me
            </a>
          </div>

        </div>
      </div>
    </>
  );
}