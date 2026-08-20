import { prisma } from "@/lib/prisma";
import { markReturnedAction } from "@/lib/actions";
import { PageHeader, TableCard, StatusBadge } from "@/components/ui";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export async function BorrowedList() {
  const issued = await prisma.borrowRequest.findMany({
    where: { status: "APPROVED" },
    include: { book: true, student: true },
    orderBy: { dueDate: "asc" },
  });

  const now = new Date();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Books taken"
        description="Books currently issued to students. Mark as returned once they come back."
      />

      <TableCard>
        <table className="w-full min-w-[680px] text-sm">
          <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Book</th>
              <th className="px-4 py-3">Due date</th>
              <th className="px-4 py-3"></th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {issued.map((req) => {
              const overdue = req.dueDate ? req.dueDate < now : false;
              return (
                <tr key={req.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{req.student.name}</p>
                    <p className="text-xs text-slate-500">{req.student.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{req.book.title}</p>
                    <p className="text-xs text-slate-500">{req.book.author}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {req.dueDate ? formatDate(req.dueDate) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {overdue && <StatusBadge status="OVERDUE" />}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={markReturnedAction.bind(null, req.id)}>
                      <button className="rounded-md bg-slate-800 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-slate-900">
                        Mark returned
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
            {issued.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                  No books currently checked out.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
}
