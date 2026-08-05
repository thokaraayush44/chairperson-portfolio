import React from "react";
import { PageTitleBanner } from "@/components/PageTitleBanner";

const page = () => {
  return (
    <>
      <PageTitleBanner title="News & Media" breadcrumb="Home > News & Media" />
      <div className="px-6 py-12">News page content</div>
    </>
  );
};

export default page;