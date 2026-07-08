import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    status: "PENDING_IMPLEMENTATION",
    message: "Trade execution is not wired up yet in this compile-ready scaffold.",
  });
}
