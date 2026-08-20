import { prisma } from "@/lib/prisma";
import { createBookAction, updateBookAction, deleteBookAction } from "@/lib/actions";
import { PageHeader, SectionCard, TableCard, Chip } from "@/components/ui";

export async function InventoryManager() {
  const [books, categories] = await Promise.all([
    prisma.book.findMany({
      include: { category: true, tags: { include: { tag: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Inventory"
        description="Add books, set categories and tags, and track copies."
      />

      <SectionCard title="Add a new book">
        <form action={createBookAction} className="grid gap-3 sm:grid-cols-2">
          <input
            name="title"
            required
            placeholder="Title"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="author"
            required
            placeholder="Author"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="isbn"
            placeholder="ISBN (optional)"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="category"
            list="category-options"
            placeholder="Category e.g. Action, Sci-Fi"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <datalist id="category-options">
            {categories.map((c) => (
              <option key={c.id} value={c.name} />
            ))}
          </datalist>
          <input
            name="tags"
            placeholder="Tags, comma separated e.g. Bestseller, Series"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:col-span-2"
          />
          <textarea
            name="description"
            placeholder="Short description (optional)"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:col-span-2"
            rows={2}
          />
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-600">Copies</label>
            <input
              name="totalCopies"
              type="number"
              min={1}
              defaultValue={1}
              className="w-20 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-600">Cover color</label>
            <input
              name="coverColor"
              type="color"
              defaultValue="#6366f1"
              className="h-9 w-14 rounded-md border border-slate-300"
            />
          </div>
          <button className="justify-self-start rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 sm:col-span-2">
            Add book
          </button>
        </form>
      </SectionCard>

      <TableCard>
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Book</th>
              <th className="px-4 py-3">Category / Tags</th>
              <th className="px-4 py-3">Copies</th>
              <th className="px-4 py-3">Update</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {books.map((book) => (
              <tr key={book.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-11 w-8 shrink-0 rounded-sm"
                      style={{ backgroundColor: book.coverColor }}
                    />
                    <div>
                      <p className="font-medium text-slate-800">{book.title}</p>
                      <p className="text-xs text-slate-500">{book.author}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex max-w-xs flex-wrap gap-1">
                    {book.category && <Chip tone="accent">{book.category.name}</Chip>}
                    {book.tags.map(({ tag }) => (
                      <Chip key={tag.id}>{tag.name}</Chip>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700">
                  <span className="font-medium">{book.availableCopies}</span>
                  <span className="text-slate-400"> / {book.totalCopies}</span>
                </td>
                <td className="px-4 py-3">
                  <details>
                    <summary className="cursor-pointer text-sm font-medium text-indigo-600">
                      Edit
                    </summary>
                    <form
                      action={updateBookAction}
                      className="mt-2 flex max-w-xs flex-col gap-2"
                    >
                      <input type="hidden" name="id" value={book.id} />
                      <input
                        name="title"
                        defaultValue={book.title}
                        className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                      />
                      <input
                        name="author"
                        defaultValue={book.author}
                        className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                      />
                      <input
                        name="isbn"
                        defaultValue={book.isbn ?? ""}
                        placeholder="ISBN"
                        className="rounded-md border border-slate-300 px-2 py-1.5 text-sm placeholder:text-slate-400"
                      />
                      <input
                        name="category"
                        defaultValue={book.category?.name ?? ""}
                        list="category-options"
                        placeholder="Category"
                        className="rounded-md border border-slate-300 px-2 py-1.5 text-sm placeholder:text-slate-400"
                      />
                      <input
                        name="tags"
                        defaultValue={book.tags.map((t) => t.tag.name).join(", ")}
                        placeholder="Tags, comma separated"
                        className="rounded-md border border-slate-300 px-2 py-1.5 text-sm placeholder:text-slate-400"
                      />
                      <textarea
                        name="description"
                        defaultValue={book.description ?? ""}
                        rows={2}
                        className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                      />
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-slate-500">Total copies</label>
                        <input
                          name="totalCopies"
                          type="number"
                          min={1}
                          defaultValue={book.totalCopies}
                          className="w-16 rounded-md border border-slate-300 px-2 py-1 text-sm"
                        />
                        <input
                          name="coverColor"
                          type="color"
                          defaultValue={book.coverColor}
                          className="h-8 w-10 rounded-md border border-slate-300"
                        />
                      </div>
                      <button className="self-start rounded-md bg-slate-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-900">
                        Save changes
                      </button>
                    </form>
                  </details>
                </td>
                <td className="px-4 py-3 text-right">
                  <form action={deleteBookAction.bind(null, book.id)}>
                    <button className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50">
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {books.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                  No books in inventory yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
}
