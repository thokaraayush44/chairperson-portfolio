"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type LogoutModalProps = {
  onClose: () => void;
};

export default function LogoutModal({
  onClose,
}: LogoutModalProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to logout");
      }

      router.replace("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to logout. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/10
        px-4
      "
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className="
          flex
          w-[280px]
          flex-col
          items-center
          overflow-hidden
          rounded-[16px]
          bg-white
          shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* =========================
            Modal Content
        ========================== */}
        <div
          className="
            flex
            w-full
            flex-col
            items-center
            gap-[4px]
            px-[24px]
            pb-[16px]
            pt-[23px]
          "
        >
          {/* Heading */}
          <div className="flex w-full flex-col items-center">
            <h2
              className="
                font-['Inter']
                text-center
                text-[17px]
                font-semibold
                leading-[25.5px]
                tracking-[-0.425px]
                text-[#d74c3b]
              "
            >
              Logout
            </h2>
          </div>

          {/* Message */}
          <div className="flex w-full flex-col items-center px-[8px]">
            <p
              className="
                font-['Inter']
                text-center
                text-[13px]
                font-medium
                leading-[16.25px]
                text-[#4b5563]
              "
            >
              Are you sure you want to logout?
            </p>
          </div>
        </div>

        {/* =========================
            Separator
        ========================== */}
        <div className="h-px w-[248px] bg-[#f3f4f6]" />

        {/* =========================
            Buttons
        ========================== */}
        <div className="flex h-[44px] w-full">
          {/* Cancel */}
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              flex
              flex-1
              items-center
              justify-center
              py-[9.75px]
              text-center
              font-['Inter']
              text-[15px]
              font-medium
              leading-[22.5px]
              text-[#9ca3af]
              transition
              hover:bg-gray-50
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          {/* Confirm */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className="
              flex
              flex-1
              items-center
              justify-center
              py-[9.75px]
              text-center
              font-['Inter']
              text-[15px]
              font-medium
              leading-[22.5px]
              text-[#7c5beb]
              transition
              hover:bg-[#f8f6ff]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading ? "..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}