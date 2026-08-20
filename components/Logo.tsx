import Link from "next/link";

export function LogoMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <path
          d="M5 4.5C5 3.67 5.67 3 6.5 3H17a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6.5A1.5 1.5 0 0 1 5 19.5v-15Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M8 3v18"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export function Logo({
  className = "",
  href,
}: {
  className?: string;
  href?: string;
}) {
  const content = (
    <span
      className={`inline-flex items-center gap-2 font-semibold tracking-tight text-slate-900 ${className}`}
    >
      <LogoMark />
      Folio
    </span>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}
