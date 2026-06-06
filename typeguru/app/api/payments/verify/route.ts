import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { db, subscriptions, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getPlanEndDate } from "@/lib/utils";
import { z } from "zod";

const AMOUNTS: Record<string, number> = { pro_monthly: 29900, pro_yearly: 199900, daypass: 1100 };

const schema = z.object({
  razorpay_order_id:   z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature:  z.string(),
  plan:                z.enum(["pro_monthly","pro_yearly","daypass"]),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid data." }, { status: 400 });

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = parsed.data;
  if (!verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const now = new Date();
  await db.insert(subscriptions).values({
    userId: session.user.id, plan,
    amountPaid: AMOUNTS[plan], startDate: now, endDate: getPlanEndDate(plan),
    razorpayOrderId: razorpay_order_id, razorpayPaymentId: razorpay_payment_id, status: "active",
  });
  await db.update(users)
    .set({ plan: plan.startsWith("pro") ? "pro" : "daypass" })
    .where(eq(users.id, session.user.id));

  return NextResponse.json({ success: true });
}
