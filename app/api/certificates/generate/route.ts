import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db, certifications } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  certType: z.enum(["govt_typing","data_entry","speed_typist"]),
  wpm:      z.number().int().min(1),
  accuracy: z.number().int().min(0).max(100),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid data." }, { status: 400 });

  const { certType, wpm, accuracy } = parsed.data;
  const [cert] = await db.insert(certifications).values({
    userId: session.user.id, certType,
    wpmAchieved: wpm, accuracyAchieved: accuracy, pdfUrl: null,
  }).returning();

  return NextResponse.json({ success: true, certId: cert.id });
}
