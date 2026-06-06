export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm">
        {children}
      </div>
    </div>
  );
}
