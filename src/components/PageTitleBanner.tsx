type PageTitleBannerProps = {
  title: string;
  breadcrumb?: string;
};

export function PageTitleBanner({
  title,
  breadcrumb,
}: PageTitleBannerProps) {
  return (
    <section className="w-full bg-[#8A1538] text-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-[10px] px-4 py-10 sm:px-6 lg:px-16">
        {breadcrumb && (
          <p className="text-[14px] font-normal leading-normal text-[#EDEBE6]">
            {breadcrumb}
          </p>
        )}

        <h1 className="font-serif text-[40px] font-bold leading-normal">
          {title}
        </h1>
      </div>
    </section>
  );
}