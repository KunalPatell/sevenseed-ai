import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items = body.items || [];
    
    let subtotal = 0;
    const computedItems = items.map((it: any) => {
      const lineCost = (Number(it.qty) || 0) * (Number(it.rate) || 0);
      subtotal += lineCost;
      return { ...it, lineCost };
    });

    const contractorProfit = subtotal * 0.15;
    const gst = (subtotal + contractorProfit) * 0.18;
    const grandTotal = Math.round(subtotal + contractorProfit + gst);

    return NextResponse.json({
      success: true,
      items: computedItems,
      subtotal,
      contractorProfit,
      gst,
      grandTotal
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
