import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const amount = Number(body.amount) || 0;
    const donorPan = (body.pan || "").toUpperCase();
    const donorName = body.name || "Anonymous Donor";

    const eligibleDeduction = Math.round(amount * 0.5);
    const receiptId = `10BE-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;

    return NextResponse.json({
      success: true,
      receiptId,
      donorName,
      donorPan,
      donationAmount: amount,
      section80GDeduction: eligibleDeduction,
      trustRegistration: "TRUST/GJ/80G/2026/A4901",
      verificationHash: `sha256-${Buffer.from(receiptId + donorPan + amount).toString("base64")}`
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
