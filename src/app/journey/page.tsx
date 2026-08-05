import React from "react";
import { PageTitleBanner } from "@/components/PageTitleBanner";

const page = () => {
  return (
    <>
      <PageTitleBanner title="Political Journey" breadcrumb="Home > Political Journey" />
      <div className="px-6 py-12">Journey page content</div>
    </>
  );
};

export default page;