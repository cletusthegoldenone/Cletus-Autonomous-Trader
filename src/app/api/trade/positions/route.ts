import { NextResponse } from "next/server";
import { positionsResponse } from "@/lib/mock-responses";

export async function GET() {
  return NextResponse.json(positionsResponse);
}
