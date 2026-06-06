import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[320px] flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
