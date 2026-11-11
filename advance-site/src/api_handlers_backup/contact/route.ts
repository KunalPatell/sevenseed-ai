import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("[CONTACT SUBMISSION - NODE.JS API]:", body);

    return NextResponse.json({
      success: true,
      message: "Your inquiry has been logged with Sevenseed Studio. Our partners will reach out within 24 hours.",
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
