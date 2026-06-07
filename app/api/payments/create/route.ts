import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { createOrder } from "@/lib/razorpay";
import { PLAN_PRICES } from "@/lib/utils";
import { z } from "zod";

const schema = z.object({
  plan:   z.enum(["pro_monthly","pro_yearly","daypass"]),
  amount: z.number().int().positive(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid plan." }, { status: 400 });

  const { plan, amount } = parsed.data;
  if (amount !== PLAN_PRICES[plan]) return NextResponse.json({ error: "Amount mismatch." }, { status: 400 });

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET || !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
    return NextResponse.json({ error: "Payment configuration missing on the server." }, { status: 500 });
  }

  try {
    const order = await createOrder(amount, `tg_${session.user.id}_${Date.now()}`);
    return NextResponse.json({ orderId: order.id, key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, amount });
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    return NextResponse.json({ error: "Unable to create payment order. Please try again later." }, { status: 500 });
  }
}
