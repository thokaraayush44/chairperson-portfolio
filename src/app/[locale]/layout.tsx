import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {routing} from "@/i18n/routing";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {notFound} from "next/navigation";

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <NextIntlClientProvider>
      <Navbar />

      {children}

      <Footer />
    </NextIntlClientProvider>
  );
}