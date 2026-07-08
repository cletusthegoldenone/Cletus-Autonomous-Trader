import { NextResponse } from "next/server";
import { scanResponse } from "@/lib/mock-responses";

export async function POST() {
  return NextResponse.json(scanResponse);
}
