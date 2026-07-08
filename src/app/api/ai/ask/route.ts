import { NextResponse } from "next/server";
import { aiResponse } from "@/lib/mock-responses";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const question = typeof body.question === "string" ? body.question : null;

  return NextResponse.json({
    ...aiResponse,
    question,
  });
}
