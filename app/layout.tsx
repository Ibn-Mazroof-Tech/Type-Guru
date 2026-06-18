import type { Metadata } from "next";
import "./globals.css";
import { Navbar }    from "@/components/ui/Navbar";
import { Providers } from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
  title:       "TypeGuru — Master Typing with AI",
  description: "AI-powered typing coach for government aspirants, developers, and Arabic learners. Join 2.4 lakh+ learners.",
  keywords:    "typing test, SSC typing, RRB typing, WPM test, typing speed, government exam typing",
  openGraph: {
    title:       "TypeGuru — Master Typing with AI",
    description: "India's most advanced AI typing platform",
    type:        "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <footer className="border-t border-border mt-20 py-6 px-6 text-center text-text-muted text-xs">
            <span className="font-brand text-brand-cyan mr-3 text-sm">TYPEGURU</span>
            © {new Date().getFullYear()} TypeGuru · Made in India 🇮🇳 · Empowering 2.4 Lakh+ Typists
          </footer>
        </Providers>
      </body>
    </html>
  );
}
