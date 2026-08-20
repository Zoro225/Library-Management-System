import { prisma } from "@/lib/prisma";
import { PageHeader, StatCard } from "@/components/ui";

export default async function AdminOverviewPage() {
  const [staffCount, bookCount, pendingCount, issuedCount] = await Promise.all([
    prisma.user.count({ where: { role: "STAFF" } }),
    prisma.book.count(),
    prisma.borrowRequest.count({ where: { status: "PENDING" } }),
    prisma.borrowRequest.count({ where: { status: "APPROVED" } }),
  ]);

  const cards = [
    { label: "Staff members", value: staffCount, href: "/admin/staff" },
    { label: "Books in inventory", value: bookCount, href: "/admin/inventory" },
    { label: "Pending requests", value: pendingCount, href: "/admin/requests" },
    { label: "Books checked out", value: issuedCount, href: "/admin/borrowed" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin overview"
        description="A quick snapshot of the library right now."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>
    </div>
  );
}
