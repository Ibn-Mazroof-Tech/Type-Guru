import { Metadata } from "next";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { certifications } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata: Metadata = { title: "Certificates — TypeGuru" };

const CERT_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  govt_typing:  { label: "Govt. Typing Certificate", color: "#FFB800", icon: "🏛️" },
  data_entry:   { label: "Data Entry Proficiency",   color: "#60A5FA", icon: "📊" },
  speed_typist: { label: "Speed Typist Certificate", color: "#00E5FF", icon: "⚡" },
};

export default async function CertificatesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const certs = await db
    .select()
    .from(certifications)
    .where(eq(certifications.userId, session.user.id))
    .orderBy(desc(certifications.issuedAt));

  return (
    <div className="max-w-3xl mx-auto px-5 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">🎓 My Certificates</h1>
        <p className="text-text-muted text-sm">Your earned certificates — shareable on LinkedIn & Naukri</p>
      </div>

      {certs.length === 0 ? (
        <div className="card p-10 text-center border-brand-cyan/20">
          <div className="text-5xl mb-4">🎓</div>
          <h3 className="font-bold text-lg mb-2">No Certificates Yet</h3>
          <p className="text-text-muted text-sm mb-6">
            Complete typing tests and purchase a certificate to get started.
          </p>
          <Link href="/pricing" className="btn-primary text-sm">Browse Certificates →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {certs.map((cert) => {
            const info = CERT_LABELS[cert.certType] ?? { label: cert.certType, color: "#00E5FF", icon: "🏆" };
            return (
              <div key={cert.id}
                className="card p-5 flex items-center gap-4 flex-wrap"
                style={{ borderColor: info.color + "28" }}>
                <div className="text-3xl">{info.icon}</div>
                <div className="flex-1 min-w-[160px]">
                  <div className="font-bold text-sm" style={{ color: info.color }}>{info.label}</div>
                  <div className="text-text-muted text-xs mt-1">
                    {cert.wpmAchieved} WPM · {cert.accuracyAchieved}% Accuracy ·
                    Issued {new Date(cert.issuedAt).toLocaleDateString("en-IN")}
                  </div>
                </div>
                {cert.pdfUrl && (
                  <a href={cert.pdfUrl} target="_blank" rel="noopener noreferrer"
                    className="btn-outline text-xs px-4 py-2">
                    ⬇️ Download PDF
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
