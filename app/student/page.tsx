import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { requestBookAction } from "@/lib/actions";
import type { Prisma } from "@/app/generated/prisma/client";
import { PageHeader, Chip, EmptyState } from "@/components/ui";

function buildQuery(
  current: { category?: string; tag?: string; q?: string },
  overrides: { category?: string | null; tag?: string | null }
) {
  const params = new URLSearchParams();
  const category =
    overrides.category === undefined ? current.category : overrides.category;
  const tag = overrides.tag === undefined ? current.tag : overrides.tag;

  if (category) params.set("category", category);
  if (tag) params.set("tag", tag);
  if (current.q) params.set("q", current.q);

  const qs = params.toString();
  return qs ? `/student?${qs}` : "/student";
}

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function StudentBrowsePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedParams = await searchParams;
  const category =
    typeof resolvedParams.category === "string" ? resolvedParams.category : undefined;
  const tag = typeof resolvedParams.tag === "string" ? resolvedParams.tag : undefined;
  const q = typeof resolvedParams.q === "string" ? resolvedParams.q : undefined;

  const session = await getSession();

  const where: Prisma.BookWhereInput = {};
  if (category) where.category = { name: category };
  if (tag) where.tags = { some: { tag: { name: tag } } };
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { author: { contains: q } },
    ];
  }

  const [books, categories, tags, myPendingRequests] = await Promise.all([
    prisma.book.findMany({
      where,
      include: { category: true, tags: { include: { tag: true } } },
      orderBy: { title: "asc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    session?.user
      ? prisma.borrowRequest.findMany({
          where: { studentId: session.user.id, status: "PENDING" },
          select: { bookId: true },
        })
      : Promise.resolve([]),
  ]);

  const pendingBookIds = new Set(myPendingRequests.map((r) => r.bookId));
  const hasFilters = Boolean(category || tag || q);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Browse books"
        description="Search by title or author, or filter by category and tag."
      />

      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <form action="/student" className="flex max-w-md gap-2">
          {category && <input type="hidden" name="category" value={category} />}
          {tag && <input type="hidden" name="tag" value={tag} />}
          <input
            name="q"
            defaultValue={q}
            placeholder="Search title or author..."
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700">
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          <Link
            href={buildQuery({ category, tag, q }, { category: null })}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              !category
                ? "border-indigo-600 bg-indigo-600 text-white"
                : "border-slate-300 text-slate-600 hover:bg-slate-100"
            }`}
          >
            All categories
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={buildQuery({ category, tag, q }, { category: c.name })}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                category === c.name
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-slate-300 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <Link
                key={t.id}
                href={buildQuery(
                  { category, tag, q },
                  { tag: tag === t.name ? null : t.name }
                )}
                className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                  tag === t.name
                    ? "border-slate-800 bg-slate-800 text-white"
                    : "border-slate-200 text-slate-500 hover:bg-slate-100"
                }`}
              >
                #{t.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {books.length === 0 ? (
        <EmptyState
          title="No books match your search."
          description={
            hasFilters
              ? "Try clearing a filter or searching for something else."
              : "There are no books in the catalog yet."
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => {
            const alreadyPending = pendingBookIds.has(book.id);
            const available = book.availableCopies > 0;
            return (
              <div
                key={book.id}
                className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div
                  className="h-2"
                  style={{ backgroundColor: book.coverColor }}
                />
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="h-14 w-10 shrink-0 rounded-md"
                      style={{ backgroundColor: book.coverColor }}
                    />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">
                        {book.title}
                      </p>
                      <p className="text-sm text-slate-500">{book.author}</p>
                    </div>
                  </div>

                  {book.description && (
                    <p className="line-clamp-2 text-sm text-slate-500">
                      {book.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1.5">
                    {book.category && (
                      <Chip tone="accent">{book.category.name}</Chip>
                    )}
                    {book.tags.map(({ tag: t }) => (
                      <Chip key={t.id}>{t.name}</Chip>
                    ))}
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                    <span
                      className={`text-xs font-semibold ${
                        available ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {available
                        ? `${book.availableCopies} available`
                        : "Unavailable"}
                    </span>
                    <form action={requestBookAction.bind(null, book.id)}>
                      <button
                        disabled={!available || alreadyPending}
                        className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                      >
                        {alreadyPending
                          ? "Requested"
                          : available
                          ? "Request to borrow"
                          : "Unavailable"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
