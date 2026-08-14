"use client";

import { useState } from "react";
import LogoutModal from "./LogoutModal";

type Section = "news" | "work" | "gallery" | "contact";

type AdminSidebarProps = {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
};

const logoutIcon =
  "https://www.figma.com/api/mcp/asset/279b33db-530b-4d8c-83f6-f1d70d79e9ab.svg";

export default function AdminSidebar({
  activeSection,
  onSectionChange,
}: AdminSidebarProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navItems = [
    {
      id: "news" as Section,
      label: "News",
    },
    {
      id: "work" as Section,
      label: "Work",
    },
    {
      id: "gallery" as Section,
      label: "Press Gallery",
    },
    {
      id: "contact" as Section,
      label: "Contact",
    }
  ];

  return (
    <>
      <aside
        className="
          border-[#e1d0cf]
          bg-white
          lg:fixed
          lg:left-0
          lg:top-0
          lg:h-screen
          lg:w-[287px]
          lg:border-r
        "
      >
        <div className="flex min-h-screen flex-col px-6 py-8">
          {/* Admin Panel Title */}
          <h1 className="font-['Libre_Baskerville'] text-[20px] font-bold text-[#221f1a]">
            Admin Panel
          </h1>

          <div className="h-8" />

          {/* Navigation */}
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => {
              const active = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSectionChange(item.id)}
                  className={`
                    flex
                    h-[44px]
                    w-full
                    items-center
                    rounded-[8px]
                    px-[19px]
                    text-left
                    text-[15px]
                    font-semibold
                    transition
                    ${
                      active
                        ? "bg-[#8a1538] text-white"
                        : "bg-[#fafafa] text-[#221f1a] hover:bg-[#f2f0ed]"
                    }
                  `}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Push Logout to Bottom */}
          <div className="flex-1" />

          {/* Logout Button */}
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="
              flex
              items-center
              gap-2
              text-[16px]
              font-semibold
              text-[#d4171d]
              transition
              hover:opacity-80
            "
          >
            <span className="h-6 w-6">
              <img
                src={logoutIcon}
                alt=""
                className="h-full w-full object-contain"
              />
            </span>

            logout
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <LogoutModal
          onClose={() => setShowLogoutModal(false)}
        />
      )}
    </>
  );
}