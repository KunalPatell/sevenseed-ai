import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const query = body.query || "";

    return NextResponse.json({
      success: true,
      advice: `Focus on customer willingness-to-pay before scaling engineering headcount. High-growth ventures validate unit retention (>110% NDR) with 10 design partners.`,
      action_items: [
        "Conduct 15 customer discovery interviews this week",
        "Define an ICP with >$100k annual software budget",
        "Implement BYOK zero-margin architecture for transparent billing"
      ]
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
