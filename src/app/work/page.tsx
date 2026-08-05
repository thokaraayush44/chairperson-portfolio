import React from "react";
import { PageTitleBanner } from "@/components/PageTitleBanner";

const page = () => {
  return (
    <>
      <PageTitleBanner title="Our Work" breadcrumb="Home > Our Work" />
      <div className="px-6 py-12">Work page content</div>
    </>
  );
};

export default page;