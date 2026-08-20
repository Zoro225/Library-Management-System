import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { PageHeader, TableCard, StatusBadge } from "@/components/ui";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default async function MyRequestsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const requests = await prisma.borrowRequest.findMany({
    where: { studentId: session.user.id },
    include: { book: true },
    orderBy: { requestedAt: "desc" },
  });

  const now = new Date();

  return (
    <div className="space-y-6">
      <PageHeader
        title="My books"
        description="Track the status of your requests and what you currently have out."
      />

      <TableCard>
        <table className="w-full min-w-[560px] text-sm">
          <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Book</th>
              <th className="px-4 py-3">Requested</th>
              <th className="px-4 py-3">Due date</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.map((req) => {
              const overdue =
                req.status === "APPROVED" && req.dueDate ? req.dueDate < now : false;
              return (
                <tr key={req.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{req.book.title}</p>
                    <p className="text-xs text-slate-500">{req.book.author}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatDate(req.requestedAt)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {req.dueDate ? formatDate(req.dueDate) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={overdue ? "OVERDUE" : req.status}
                      label={overdue ? "Overdue" : req.status}
                    />
                  </td>
                </tr>
              );
            })}
            {requests.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-slate-400">
                  You haven&apos;t requested any books yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
}
