import Image from "next/image";
import { libreBaskerville } from "@/app/layout";

export default function HeroContent() {
  return (
    <>
      {/* Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(74,10,23,0.28),rgba(26,3,10,0.56))]" />

      {/* Hero Content */}
      <div className="relative z-10 mx-auto flex min-h-[500px] w-full max-w-[1100px] items-end px-5">
        {/* Portrait */}
        <Image
          src="/images/image2.png"
          alt="Bishnu Bahadur Rokaya"
          width={700}
          height={687}
          className="h-[687px] w-[700px] object-contain"
        />

        {/* Right Content */}
        <div className="absolute right-[7px] top-[200px] z-20 w-[400px]">
          {/* Affiliation */}
          <div className="mb-4 flex items-center gap-2">
            <Image
              src="/icons/logo1.png"
              alt="Affiliation"
              width={20}
              height={20}
            />
            <span className="text-sm text-white">Affiliation: Maoist</span>
          </div>

          {/* Subtitle */}
          <p className="mb-3 text-sm font-semibold tracking-wider text-[#D4AF37]">
            Chairperson, Kalikot District Coordination Committee
          </p>

          {/* Title */}
          <h1
            className={`mb-5 text-6xl font-serif font-semibold text-white`}
          >
            Hon. Bishnu
            <br />
            Bahadur Rokaya
          </h1>

          {/* Description */}
          <p className="mb-8 text-md leading-8 text-white/90">
            Serving the people of Kalikot with integrity,
            <br />
            transparency, and dedication.
          </p>

          {/* Buttons */}
          <div className="flex gap-4">
            <a
              href="work"
              className="rounded-md bg-primary-100 px-6 py-3 font-medium text-white transition hover:bg-primary"
            >
              View My Work
            </a>

            <a
              href="contact"
              className="rounded-md border border-black bg-white px-6 py-3 font-semibold text-foreground transition hover:bg-gray-100"
            >
              Contact Me
            </a>
          </div>
        </div>
      </div>
      {/* Stats Section (below hero) */}
      <div className="relative z-20 mt-8 w-full bg-primary-100 py-12">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-5 text-center text-white">
          <div className="flex-1">
            <div className="text-4xl font-semibold">12+</div>
            <div className="mt-2 text-sm text-white/80">Years of Service</div>
          </div>

          <div className="flex-1">
            <div className="text-4xl font-semibold">148</div>
            <div className="mt-2 text-sm text-white/80">Projects Completed</div>
          </div>

          <div className="flex-1">
            <div className="text-4xl font-semibold">9</div>
            <div className="mt-2 text-sm text-white/80">Wards Covered</div>
          </div>

          <div className="flex-1">
            <div className="text-4xl font-semibold">NPR 42 Cr</div>
            <div className="mt-2 text-sm text-white/80">Budget Mobilized</div>
          </div>
        </div>
      </div>
    </>
  );
}
