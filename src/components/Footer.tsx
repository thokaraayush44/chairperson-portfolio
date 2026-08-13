import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#6C1511] text-white">

      {/* Main Footer Content */}
      <div className="mx-auto flex max-w-[1170px] items-end justify-center gap-[30px] px-5 pb-[22px] pt-[43px] lg:px-0">

        {/* Left Content + Links + Contact */}
        <div className="flex w-full flex-col gap-[47px] md:flex-row md:items-start">

          {/* Brand */}
          <div className="w-full shrink-0 md:w-[336px]">
            <div className="flex items-center">
              <Image
                src="/icons/logo1.png"
                alt="Logo"
                width={25}
                height={25}
                className="h-[25px] w-[25px]"
              />

              <span className="pl-2 text-[18px] font-bold leading-7 text-white">
                Bishnu Bahadur Rokaya
              </span>
            </div>

            <p className="mt-4 w-full text-[14px] leading-normal text-[#EDEBE6]">
              Official portfolio of the Chairperson, serving the people of
              Kalikot.
            </p>
          </div>

          {/* Quick Links */}
          <div className="w-full shrink-0 md:w-[171px]">
            <h3 className="mb-3 text-[15px] font-bold leading-normal text-[#C9982A]">
              Quick Links
            </h3>

            <ul className="space-y-3 text-[14px] leading-normal">

              <li>
                <Link
                  href="/"
                  className="text-[#EDEBE6] transition hover:text-white"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="text-[#EDEBE6] transition hover:text-white"
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  href="/journey"
                  className="text-[#EDEBE6] transition hover:text-white"
                >
                  Timeline
                </Link>
              </li>

              <li>
                <Link
                  href="/work"
                  className="text-[#EDEBE6] transition hover:text-white"
                >
                  Work
                </Link>
              </li>

              <li>
                <Link
                  href="/news"
                  className="text-[#EDEBE6] transition hover:text-white"
                >
                  News
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="text-[#EDEBE6] transition hover:text-white"
                >
                  Contact
                </Link>
              </li>

            </ul>
          </div>

          {/* Contact */}
          <div className="w-full shrink-0 md:w-[259px]">

            <h3 className="text-[14px] font-semibold uppercase leading-5 tracking-[0.7px] text-[#C9982A]">
              Contact
            </h3>

            <div className="mt-4 space-y-3 text-[14px]">

              {/* Phone */}
              <div className="flex items-center gap-2">
                <Image
                  src="/icons/Phone.svg"
                  alt="Phone"
                  width={16}
                  height={16}
                  className="h-4 w-4 shrink-0"
                />

                <span className="text-[#EDEBE6]">
                  +977 9700066129
                </span>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2">
                <Image
                  src="/icons/Email.svg"
                  alt="Email"
                  width={16}
                  height={16}
                  className="h-4 w-4 shrink-0"
                />

                <span className="text-[#EDEBE6]">
                  bishnurokaya@gmail.com
                </span>
              </div>

              {/* YouTube */}
              <div className="flex items-center gap-2">
                <Image
                  src="/icons/Youtube.svg"
                  alt="YouTube"
                  width={16}
                  height={16}
                  className="h-4 w-4 shrink-0"
                />

                <span className="text-[#EDEBE6]">
                  youtube.com/bishnurokaya
                </span>
              </div>

              {/* Instagram */}
              <div className="flex items-center gap-2">
                <Image
                  src="/icons/Instagram.svg"
                  alt="Instagram"
                  width={16}
                  height={16}
                  className="h-4 w-4 shrink-0"
                />

                <span className="text-[#EDEBE6]">
                  @bishnurokaya
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Newsletter / Campaign */}
        <div className="w-[280px] shrink-0 rounded-[24px] border border-white/10 bg-white/10 p-[24px]">

          <h3 className="text-[16px] font-semibold leading-normal text-[#C9982A]">
            Join our campaign
          </h3>

          <p className="mt-3 w-[231px] text-[16px] leading-normal text-[#90A1B9]">
            Sign up for our newsletter for the latest updates and important
            information.
          </p>

          <Link
            href="/contact"
            className="mt-4 flex h-[58px] w-[232px] items-center justify-center rounded-[18px] bg-white text-[18px] font-semibold text-[#8A1538] transition hover:bg-slate-100"
          >
            Join Now
          </Link>

        </div>

      </div>

      {/* Divider */}
      <div className="mx-[69px] border-t border-[#C9C6BF]" />

      {/* Copyright */}
      <div className="px-5 py-[18px] text-center text-[13px] leading-normal text-[#C9C6BF]">
        © 2026 Office of the Chairperson, Kalikot District Coordination
        Committee. All rights reserved. This is an official government
        portfolio website.
      </div>

    </footer>
  );
}