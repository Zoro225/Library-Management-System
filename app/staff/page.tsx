import { prisma } from "@/lib/prisma";
import { PageHeader, StatCard } from "@/components/ui";

export default async function StaffOverviewPage() {
  const [bookCount, pendingCount, issuedCount] = await Promise.all([
    prisma.book.count(),
    prisma.borrowRequest.count({ where: { status: "PENDING" } }),
    prisma.borrowRequest.count({ where: { status: "APPROVED" } }),
  ]);

  const cards = [
    { label: "Books in inventory", value: bookCount, href: "/staff/inventory" },
    { label: "Pending requests", value: pendingCount, href: "/staff/requests" },
    { label: "Books checked out", value: issuedCount, href: "/staff/borrowed" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Staff overview"
        description="A quick snapshot of the library right now."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>
    </div>
  );
}
