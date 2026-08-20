import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "./LoginForm";
import { Logo } from "@/components/Logo";

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo className="text-lg" />
          <h1 className="mt-5 text-2xl font-semibold text-slate-900">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Log in to your Folio account
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          New student?{" "}
          <Link href="/signup" className="font-medium text-indigo-600 hover:underline">
            Create an account
          </Link>
        </p>

        <div className="mt-8 space-y-1 border-t border-slate-200 pt-4 text-xs text-slate-400">
          <p className="font-medium text-slate-500">Demo credentials</p>
          <p>Admin: admin@library.com / Admin@123</p>
          <p>Staff: staff@library.com / Staff@123</p>
          <p>Student: student@library.com / Student@123</p>
        </div>
      </div>
    </main>
  );
}
