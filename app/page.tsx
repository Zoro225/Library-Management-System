import Link from "next/link";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";

const roleHome: Record<string, string> = {
  ADMIN: "/admin",
  STAFF: "/staff",
  STUDENT: "/student",
};

const features = [
  {
    title: "Browse the catalog",
    description:
      "Search the full collection by title or author, and filter by category or tag to find the right book fast.",
  },
  {
    title: "Request and track loans",
    description:
      "Send a borrow request in one click and follow its status from pending to approved, returned, or overdue.",
  },
  {
    title: "Run the front desk",
    description:
      "Staff and admins approve requests, manage inventory and copies, and keep tabs on everything checked out.",
  },
];

export default async function Home() {
  const session = await getSession();
  if (session?.user) {
    redirect(roleHome[session.user.role] ?? "/login");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-4 pt-16 pb-14 text-center sm:px-6 sm:pt-24 sm:pb-20">
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
            Library management, without the spreadsheets
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Run your library&apos;s books, loans, and staff in one place.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
            Folio gives students a fast way to find and request books, and
            gives staff and admins a clear workflow for approvals, inventory,
            and returns — all from a single, focused dashboard.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/login"
              className="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Sign up as a student
            </Link>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="grid gap-8 sm:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <span className="h-2 w-2 rounded-full bg-indigo-600" />
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-slate-400 sm:flex-row sm:px-6">
          <span>© {new Date().getFullYear()} Folio. All rights reserved.</span>
          <span>Built for libraries that outgrew the spreadsheet.</span>
        </div>
      </footer>
    </div>
  );
}
