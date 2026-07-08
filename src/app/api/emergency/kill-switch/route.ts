import { NextResponse } from "next/server";
import { killSwitchResponse } from "@/lib/mock-responses";

export async function POST() {
  return NextResponse.json(killSwitchResponse);
}
