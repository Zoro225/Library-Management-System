"use client";

import { useState, type ReactNode, type SVGProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Logo } from "./Logo";

type Role = "ADMIN" | "STAFF" | "STUDENT";

type NavLink = {
  href: string;
  label: string;
  icon: (props: SVGProps<SVGSVGElement>) => ReactNode;
};

function GridIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function UsersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M15.5 5.3c1.3.4 2.2 1.6 2.2 3s-.9 2.6-2.2 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M15.5 14.2c2.1.5 3.7 2.2 3.9 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function BookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M5 4.5C5 3.67 5.67 3 6.5 3H17a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6.5A1.5 1.5 0 0 1 5 19.5v-15Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8 3v18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function InboxIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M3.5 13 6 5.5A1.5 1.5 0 0 1 7.42 4.5h9.16A1.5 1.5 0 0 1 18 5.5L20.5 13" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M3.5 13v4.5A2 2 0 0 0 5.5 19.5h13a2 2 0 0 0 2-2V13h-4.7a2.3 2.3 0 0 0-2.15 1.5c-.3.75-1 1.5-2.15 1.5s-1.85-.75-2.15-1.5A2.3 2.3 0 0 0 8.2 13H3.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M19 19l-3.8-3.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function BookmarkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V20l-6-3.5-6 3.5V4.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M4 6.5h16M4 12h16M4 17.5h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const LINKS_BY_ROLE: Record<Role, NavLink[]> = {
  ADMIN: [
    { href: "/admin", label: "Overview", icon: GridIcon },
    { href: "/admin/staff", label: "Manage Staff", icon: UsersIcon },
    { href: "/admin/inventory", label: "Inventory", icon: BookIcon },
    { href: "/admin/requests", label: "Requests", icon: InboxIcon },
    { href: "/admin/borrowed", label: "Books Taken", icon: ClockIcon },
  ],
  STAFF: [
    { href: "/staff", label: "Overview", icon: GridIcon },
    { href: "/staff/inventory", label: "Inventory", icon: BookIcon },
    { href: "/staff/requests", label: "Requests", icon: InboxIcon },
    { href: "/staff/borrowed", label: "Books Taken", icon: ClockIcon },
  ],
  STUDENT: [
    { href: "/student", label: "Browse Books", icon: SearchIcon },
    { href: "/student/my-requests", label: "My Books", icon: BookmarkIcon },
  ],
};

function findActiveLink(pathname: string, links: NavLink[]) {
  const exact = links.find((link) => link.href === pathname);
  if (exact) return exact;
  const nested = links
    .filter((link) => link.href !== links[0].href && pathname.startsWith(link.href))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return nested ?? links[0];
}

function NavList({
  links,
  pathname,
  onNavigate,
}: {
  links: NavLink[];
  pathname: string;
  onNavigate?: () => void;
}) {
  const active = findActiveLink(pathname, links);
  return (
    <nav className="flex flex-col gap-1 px-3">
      {links.map((link) => {
        const isActive = link.href === active.href;
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardShell({
  role,
  name,
  children,
}: {
  role: Role;
  name: string;
  children: ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const links = LINKS_BY_ROLE[role];
  const activeLink = findActiveLink(pathname, links);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-16 items-center border-b border-slate-200 px-5">
          <Logo />
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <NavList links={links} pathname={pathname} />
        </div>
        <div className="border-t border-slate-200 p-4">
          <p className="truncate text-sm font-medium text-slate-900">{name}</p>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {role.toLowerCase()}
          </p>
        </div>
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setDrawerOpen(false)}
            aria-hidden
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 max-w-[80vw] flex-col bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
              <Logo />
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
              <NavList
                links={links}
                pathname={pathname}
                onNavigate={() => setDrawerOpen(false)}
              />
            </div>
            <div className="border-t border-slate-200 p-4">
              <p className="truncate text-sm font-medium text-slate-900">{name}</p>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {role.toLowerCase()}
              </p>
            </div>
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDrawerOpen(true)}
                aria-label="Open menu"
                className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
              >
                <MenuIcon className="h-5 w-5" />
              </button>
              <h1 className="text-base font-semibold text-slate-900 sm:text-lg">
                {activeLink.label}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium leading-tight text-slate-900">{name}</p>
                <p className="text-xs font-semibold uppercase tracking-wide leading-tight text-slate-400">
                  {role.toLowerCase()}
                </p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:border-red-200 hover:text-red-600"
              >
                Sign out
              </button>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
