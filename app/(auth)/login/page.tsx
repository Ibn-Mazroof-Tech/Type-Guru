import { Suspense } from "react";
import LoginForm from "./LoginForm";

// Force dynamic rendering for auth pages that depend on request search params.
export const dynamic = "force-dynamic";

export default function LoginPage({ searchParams }: { searchParams?: { callbackUrl?: string } }) {
  const callbackUrl = searchParams?.callbackUrl ?? "/practice";

  return (
    <Suspense
      fallback={
        <div className="min-h-[320px] flex items-center justify-center text-text-muted text-sm">
          Loading...
        </div>
      }
    >
      <LoginForm callbackUrl={callbackUrl} />
    </Suspense>
  );
}
