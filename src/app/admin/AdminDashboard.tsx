"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const menuItems = [
  {
    title: "News",
    description: "Create, update, and delete news and announcements.",
    href: "/admin/news",
    icon: "📰",
  },
  {
    title: "Work",
    description: "Manage development projects and completed work.",
    href: "/admin/work",
    icon: "🏗️",
  },
];

export default function AdminDashboard() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });

      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F2EC]">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-900">
              Chairperson Portfolio
            </p>

            <h1 className="mt-1 font-serif text-2xl font-bold text-neutral-950">
              Admin Dashboard
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Dashboard */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Welcome */}
        <section className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-rose-900">
            Administration
          </p>

          <h2 className="mt-2 font-serif text-4xl font-bold text-neutral-950">
            Welcome, Admin
          </h2>

          <p className="mt-3 max-w-2xl text-neutral-600">
            Manage the content of the chairperson portfolio from one place.
            Create new content, update existing information, and remove
            outdated content.
          </p>
        </section>

        {/* Management Cards */}
        <section>
          <div className="mb-5">
            <h3 className="font-serif text-2xl font-bold text-neutral-950">
              Content Management
            </h3>

            <p className="mt-1 text-sm text-neutral-600">
              Choose an area you want to manage.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-2xl">
                      {item.icon}
                    </div>

                    <h4 className="font-serif text-2xl font-semibold text-neutral-950">
                      {item.title}
                    </h4>

                    <p className="mt-2 max-w-md text-sm leading-6 text-neutral-600">
                      {item.description}
                    </p>
                  </div>

                  <span className="text-2xl text-rose-900 transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>

                <div className="mt-6 border-t border-neutral-100 pt-4">
                  <span className="text-sm font-semibold text-rose-900">
                    Manage {item.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Information */}
        <section className="mt-10 rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-900">
                Admin Area
              </p>

              <h3 className="mt-2 font-serif text-2xl font-semibold text-neutral-950">
                Portfolio Content Management
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
                Use the management sections above to create, update, and
                delete portfolio content. Changes made here will appear on
                the public chairperson portfolio.
              </p>
            </div>

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-rose-50">
              <span className="text-2xl">⚙️</span>
            </div>
          </div>
        </section>

        {/* Security Information */}
        <section className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
              <span className="text-lg">🔐</span>
            </div>

            <div>
              <h3 className="font-semibold text-emerald-950">
                Secure Admin Session
              </h3>

              <p className="mt-1 text-sm leading-6 text-emerald-800">
                You are currently signed in to the protected administration
                area. Your session is secured using an HTTP-only JWT cookie.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}