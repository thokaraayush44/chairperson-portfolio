import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="bg-primary-100 text-white"
      style={{ padding: "43px 59px 20px 69px" }}
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 sm:px-0 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-white">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
              <Image src="/icons/logo1.png" alt="Logo" width={20} height={20} />
            </span>
            <span className="text-sm font-semibold">Bishnu Bahadur Rokaya</span>
          </div>
          <p className="max-w-sm text-sm text-white/80">
            Official portfolio of the Chairperson, serving the people of
            Kalikot.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-[0.2em] text-[#C9982A]">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm text-white/90">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-white">
                  Work
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-white">
                  News
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#C9982A]">
              Contact
            </h3>
            <div className="space-y-3 text-sm text-white/90">
              <div className="flex items-center gap-3">
                <Image
                  src="/icons/Phone.svg"
                  alt="Phone"
                  width={18}
                  height={18}
                />
                <span>+977 9700066129</span>
              </div>
              <div className="flex items-center gap-3">
                <Image
                  src="/icons/Email.svg"
                  alt="Email"
                  width={18}
                  height={18}
                />
                <span>bishnurokaya@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Image
                  src="/icons/Youtube.svg"
                  alt="YouTube"
                  width={18}
                  height={18}
                />
                <span>youtube.com/bishnurokaya</span>
              </div>
              <div className="flex items-center gap-3">
                <Image
                  src="/icons/Instagram.svg"
                  alt="Instagram"
                  width={18}
                  height={18}
                />
                <span>@bishnurokaya</span>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#C9982A]">
              Join our campaign
            </h3>
            <p className="text-sm leading-6 text-white/90">
              Sign up for our newsletter for the latest updates and important
              information.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-rose-900 transition hover:bg-slate-100"
            >
              Join Now
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-6 text-center text-sm text-white/60 sm:px-8">
        © 2026 Office of the Chairperson, Kalikot District Coordination
        Committee. All rights reserved.
      </div>
    </footer>
  );
}
