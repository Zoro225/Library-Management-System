import { prisma } from "@/lib/prisma";
import {
  createStaffAction,
  updateStaffAction,
  toggleStaffActiveAction,
} from "@/lib/actions";
import { PageHeader, SectionCard, TableCard, StatusBadge } from "@/components/ui";

export default async function StaffPage() {
  const staff = await prisma.user.findMany({
    where: { role: "STAFF" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Manage staff"
        description="Create staff accounts and control access."
      />

      <SectionCard title="Add new staff member">
        <form action={createStaffAction} className="grid gap-3 sm:grid-cols-3">
          <input
            name="name"
            required
            placeholder="Full name"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="Temporary password"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button className="justify-self-start rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 sm:col-span-3">
            Add staff member
          </button>
        </form>
      </SectionCard>

      <TableCard>
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Update</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {staff.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">
                  {member.name}
                </td>
                <td className="px-4 py-3 text-slate-600">{member.email}</td>
                <td className="px-4 py-3">
                  <StatusBadge
                    status={member.active ? "ACTIVE" : "DEACTIVATED"}
                    label={member.active ? "Active" : "Deactivated"}
                  />
                </td>
                <td className="px-4 py-3">
                  <details>
                    <summary className="cursor-pointer text-sm font-medium text-indigo-600">
                      Edit
                    </summary>
                    <form
                      action={updateStaffAction}
                      className="mt-2 flex max-w-xs flex-col gap-2"
                    >
                      <input type="hidden" name="id" value={member.id} />
                      <input
                        name="name"
                        defaultValue={member.name}
                        className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                      />
                      <input
                        name="email"
                        type="email"
                        defaultValue={member.email}
                        className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                      />
                      <input
                        name="password"
                        type="password"
                        placeholder="Leave blank to keep password"
                        className="rounded-md border border-slate-300 px-2 py-1.5 text-sm placeholder:text-slate-400"
                      />
                      <button className="self-start rounded-md bg-slate-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-900">
                        Save changes
                      </button>
                    </form>
                  </details>
                </td>
                <td className="px-4 py-3 text-right">
                  <form
                    action={toggleStaffActiveAction.bind(
                      null,
                      member.id,
                      !member.active
                    )}
                  >
                    <button
                      className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                        member.active
                          ? "border-red-200 text-red-600 hover:bg-red-50"
                          : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                      }`}
                    >
                      {member.active ? "Deactivate" : "Reactivate"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {staff.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                  No staff members yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
}
