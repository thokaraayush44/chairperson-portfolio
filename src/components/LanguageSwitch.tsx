"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Switch } from "@/components/ui/switch";

export default function LanguageSwitch() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const isNepali = locale === "ne";

  const handleLanguageChange = (checked: boolean) => {
    const newLocale = checked ? "ne" : "en";

    // Remove the current locale from the pathname
    const pathnameWithoutLocale = pathname.replace(/^\/(en|ne)/, "") || "/";

    router.push(`/${newLocale}${pathnameWithoutLocale}`);
  };

  return (
    <div className="flex items-center gap-2">
      {/* English */}
      <span
        className={`text-sm font-semibold transition-colors ${
          !isNepali ? "text-[#8A1538]" : "text-[#6B6862]"
        }`}
      >
        EN
      </span>

      {/* Switch */}
      <Switch
        checked={isNepali}
        onCheckedChange={handleLanguageChange}
        size="default"
        aria-label="Change language"
        className="
          data-checked:bg-[#8A1538]
          data-unchecked:bg-[#D6D1CA]
        "
      />

      {/* Nepali */}
      <span
        className={`text-sm font-semibold transition-colors ${
          isNepali ? "text-[#8A1538]" : "text-[#6B6862]"
        }`}
      >
        नेपाली
      </span>
    </div>
  );
}