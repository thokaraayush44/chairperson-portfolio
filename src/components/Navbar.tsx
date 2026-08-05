"use client";
import React, { useEffect, useState } from "react";
import Img from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const getLinkClass = (href: string) =>
    `font-medium font-semibold hover:text-primary-100/80 ${pathname === href ? "text-primary-100" : "text-primary"}`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 py-2">
      <nav
        className={`w-full max-w-6xl bg-white/90 backdrop-blur-xl rounded-3xl px-6 py-3 flex items-center justify-between gap-6 text-black border border-gray-200/70 transition-shadow duration-200 ${
          scrolled ? "shadow-xl" : "shadow-md"
        }`}
      >
        <div className="flex items-center gap-4">
          <Img src="/icons/Seal.svg" 
              alt="Seal logo" 
              width={40} 
              height={40} 
          />
          <div className="text-md font-bold">Chairperson, Kalikot</div>
        </div>

        <ul className="hidden md:flex items-center gap-8 text-sm">
          <li>
            <Link href="/" className={getLinkClass("/")}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className={getLinkClass("/about")}>
              About
            </Link>
          </li>
          <li>
            <Link href="/journey" className={getLinkClass("/journey")}>
              Journey
            </Link>
          </li>
          <li>
            <Link href="/work" className={getLinkClass("/work")}>
              Work
            </Link>
          </li>
          <li>
            <Link href="/news" className={getLinkClass("/news")}>
              News
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-0 bg-gray-100 rounded-full px-2 py-1">
            <button className="px-3 py-1 rounded-full bg-primary-100 text-white text-bold text-sm">
              नेपाली
            </button>
            <span className="text-sm px-2">EN</span>
          </div>

          <Link
            href="/contact"
            className="ml-2 rounded-full bg-primary-100 px-4 py-2 text-sm font-medium text-white transition"
          >
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
}
