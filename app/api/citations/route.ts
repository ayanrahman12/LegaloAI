import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const citations = await prisma.citation.findMany({
    orderBy: { createdAt: "desc" },
    include: { obligation: true }
  });
  return NextResponse.json({ data: citations });
}

export async function POST(request: Request) {
  const payload = await request.json();

  const citation = await prisma.citation.create({
    data: {
      title: payload.title,
      section: payload.section,
      summary: payload.summary,
      obligationId: payload.obligationId ?? null
    }
  });

  return NextResponse.json({ data: citation }, { status: 201 });
}
