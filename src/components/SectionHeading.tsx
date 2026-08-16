import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { libreBaskerville } from "@/app/layout";

type Props = {
  label?: string;
  title: string;
  className?: string;
  description?: string;
};

export default function SectionHeading({
  label = "About the Chairperson",
  title,
  className = "",
  description,
}: Props) {
  return (
    <section id={label?.toLowerCase() ?? "section"} className={`py-20 bg-white ${className}`}>
      <div className="mx-auto max-w-[1100px] px-5 text-center">
        <p className="text-sm font-semibold tracking-wider text-[#D4AF37]">{label}</p>

        <h2 className={`mt-4 text-4xl md:text-5xl ${libreBaskerville.className} font-bold text-slate-900`}>
          {title}
        </h2>

        <p className="mt-6 text-lg text-slate-700 max-w-[780px] mx-auto">
          {description
            ? description
            : "Elected in 2079, [Chairperson Name] has dedicated his tenure to rural infrastructure, healthcare access, and transparent local governance across Kalikot’s nine wards."
          }
        </p>

        <div className="mt-12">
          <Link
            href="/about"
            aria-label="Read more about the chairperson"
            className="inline-flex items-center gap-1.5 font-semibold text-rose-900"
          >
            <span>Read More About the Chairperson</span>
            <Image
              src="/icons/Arrow1.svg"
              alt="arrow"
              width={16}
              height={16}
              className="h-4 w-4 shrink-0"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
