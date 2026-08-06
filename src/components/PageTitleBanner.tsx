type PageTitleBannerProps = {
  title: string;
  breadcrumb?: string;
};

export function PageTitleBanner({ title, breadcrumb }: PageTitleBannerProps) {
  return (
    <section className="bg-[#8A1538] font-serif text-white flex w-full flex-col items-start justify-center gap-4 bg-[url('/images/banner-bg.png')] bg-cover bg-center bg-no-repeat">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-[10px] px-4 sm:px-6 lg:px-8 py-10">
        {breadcrumb ? (
          <p className="text-sm tracking-[0.3em] text-white/80">{breadcrumb}</p>
        ) : null}
        <h1 className="text-4xl font-semibold">{title}</h1>
      </div>
    </section>
  );
}
