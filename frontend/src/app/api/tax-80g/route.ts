import { NextResponse } from "next/server";

// 80G deduction estimate only. Only the Trust can issue a Form 10BE certificate, after it
// receives a donation, so this never returns a receipt or registration number.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const amount = Math.max(0, Number(body.amount) || 0);
    return NextResponse.json({
      success: true,
      donationAmount: amount,
      section80GDeduction: Math.round(amount * 0.5),
      note: "Estimate only, not a receipt. Your deduction is based on the Form 10BE the Trust issues after it receives your donation.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
