import { prisma } from "@/lib/prisma";
import { approveRequestAction, rejectRequestAction } from "@/lib/actions";
import { PageHeader, TableCard, StatusBadge } from "@/components/ui";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export async function RequestsManager() {
  const requests = await prisma.borrowRequest.findMany({
    where: { status: "PENDING" },
    include: { book: true, student: true },
    orderBy: { requestedAt: "asc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Requests"
        description="Review pending borrow requests and assign books to students."
      />

      <TableCard>
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Book</th>
              <th className="px-4 py-3">Requested</th>
              <th className="px-4 py-3">Availability</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.map((req) => (
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
                  {formatDate(req.requestedAt)}
                </td>
                <td className="px-4 py-3">
                  {req.book.availableCopies > 0 ? (
                    <StatusBadge
                      status="AVAILABLE"
                      label={`${req.book.availableCopies} available`}
                    />
                  ) : (
                    <StatusBadge status="UNAVAILABLE" label="None available" />
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <form action={approveRequestAction.bind(null, req.id)}>
                      <button
                        disabled={req.book.availableCopies < 1}
                        className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                      >
                        Assign book
                      </button>
                    </form>
                    <form action={rejectRequestAction.bind(null, req.id)}>
                      <button className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50">
                        Reject
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                  No pending requests right now.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
}
