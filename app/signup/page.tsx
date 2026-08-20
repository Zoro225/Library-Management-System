import Link from "next/link";
import { SignupForm } from "./SignupForm";
import { Logo } from "@/components/Logo";

export default function SignupPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo className="text-lg" />
          <h1 className="mt-5 text-2xl font-semibold text-slate-900">
            Create your student account
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Sign up to browse the catalog and request books
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <SignupForm />
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-indigo-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
