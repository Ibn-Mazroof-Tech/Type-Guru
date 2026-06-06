import { Suspense } from "react";
import LoginForm from "./LoginForm";

// Force dynamic rendering — prevents Next.js from trying to
// statically generate this page, which breaks useSearchParams()
export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[320px] flex items-center justify-center text-text-muted text-sm">
          Loading...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
