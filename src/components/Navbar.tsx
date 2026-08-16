"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import LanguageSwitch from "@/components/LanguageSwitch";

export default function Navbar() {
  const t = useTranslations("Navbar");

  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;

      // navbar shadow after scrolling
      setScrolled(currentScrollY > 8);

      // hide navbar while scrolling down
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNavbar(false);
      }
      // show navbar while scrolling up
      else {
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    // show navbar when mouse reaches top
    const onMouseMove = (e: MouseEvent) => {
      if (e.clientY < 50) {
        setShowNavbar(true);
      }
    };

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [lastScrollY]);

  const getLinkClass = (href: string) =>
    `font-medium font-semibold transition ${
      pathname === href ? "text-primary-100" : "text-primary"
    } hover:text-primary-100/80`;

  return (
    <header>
      <nav
        className={`
          fixed top-3 left-1/2 -translate-x-1/2 z-50
          w-full max-w-6xl
          bg-white/90 backdrop-blur-xl
          rounded-3xl
          px-6 py-3
          flex items-center justify-between gap-6
          text-black
          border border-gray-200/70
          transition-all duration-300 ease-in-out

          ${showNavbar ? "translate-y-0" : "-translate-y-32"}

          ${scrolled ? "shadow-xl" : "shadow-md"}
        `}
      >
        {/* Logo / Title */}
        <div className="font-semibold text-lg whitespace-nowrap">
          Chairperson, Kalikot
        </div>

        {/* Navigation Links */}
        <ul className="hidden md:flex items-center gap-8 text-sm">
          <li>
            <Link href="/" className={getLinkClass("/")}>
              {t("home")}
            </Link>
          </li>

          <li>
            <Link href="/about" className={getLinkClass("/about")}>
              {t("about")}
            </Link>
          </li>

          <li>
            <Link href="/journey" className={getLinkClass("/journey")}>
              {t("journey")}
            </Link>
          </li>

          <li>
            <Link href="/work" className={getLinkClass("/work")}>
              {t("work")}
            </Link>
          </li>

          <li>
            <Link href="/news" className={getLinkClass("/news")}>
              {t("news")}
            </Link>
          </li>
        </ul>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <LanguageSwitch />

          {/* Contact Button */}
          <Link
            href="/contact"
            className="
              ml-2
              rounded-full
              bg-[#8a1538]
              px-4 py-2
              text-sm
              font-medium
              text-white
              transition
              hover:opacity-90
            "
          >
            {t("contact")}
          </Link>
        </div>
      </nav>
    </header>
  );
}