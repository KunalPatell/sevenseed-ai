import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const offense = (body.offense || "").toLowerCase();

    const BNS_DB: Record<string, any> = {
      snatching: { section: "Section 304 BNS", desc: "Snatching property with use of sudden physical force.", legacy: "Sec 379/356 IPC", cognizable: true },
      theft: { section: "Section 303 BNS", desc: "Dishonest removal of movable property without consent.", legacy: "Sec 378/379 IPC", cognizable: true },
      cheating: { section: "Section 318 BNS", desc: "Fraudulent inducement causing wrongful loss.", legacy: "Sec 415/420 IPC", cognizable: true },
      intimidation: { section: "Section 351 BNS", desc: "Threatening another person with injury or harm.", legacy: "Sec 503/506 IPC", cognizable: true }
    };

    let matched = BNS_DB["snatching"];
    for (const k in BNS_DB) {
      if (offense.includes(k)) {
        matched = BNS_DB[k];
        break;
      }
    }

    return NextResponse.json({ success: true, ...matched });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
