import { NextRequest, NextResponse } from "next/server";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  name:     z.string().min(2).max(60),
  email:    z.string().email(),
  password: z.string().min(8).max(100),
});

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input." }, { status: 400 });

    const { name, email, password } = parsed.data;
    const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
    if (existing) return NextResponse.json({ error: "Email already registered." }, { status: 409 });

    const passwordHash = await bcrypt.hash(password, 12);
    await db.insert(users).values({ name, email, passwordHash, plan: "free" });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
