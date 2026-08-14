"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import NewsSection from "./NewsSection";
import WorkSection from "./WorkSection";
import PressGallerySection from "./PressGallerySection";
import ContactSection from "./ContactSection";

type Section = "news" | "work" | "gallery" | "contact";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<Section>("news");

  return (
    <div className="min-h-screen bg-[#f7f6f3]">
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <main className="min-h-screen lg:ml-[287px]">
        <div className="mx-auto w-full max-w-[1089px] px-6 py-8 lg:px-12 lg:py-12">
          {activeSection === "news" && <NewsSection />}

          {activeSection === "work" && <WorkSection />}

          {activeSection === "gallery" && <PressGallerySection />}

          {activeSection === "contact" && <ContactSection />}
        </div>
      </main>
    </div>
  );
}
