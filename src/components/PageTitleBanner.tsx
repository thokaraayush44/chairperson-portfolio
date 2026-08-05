type PageTitleBannerProps = {
  title: string;
  breadcrumb?: string;
};

export function PageTitleBanner({ title, breadcrumb }: PageTitleBannerProps) {
  return (
    <section className="bg-[#8A1538] text-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-[10px] px-16 py-10">
        {breadcrumb ? (
          <p className="text-sm uppercase tracking-[0.3em] text-white/80">{breadcrumb}</p>
        ) : null}
        <h1 className="text-4xl font-semibold">{title}</h1>
      </div>
    </section>
  );
}
