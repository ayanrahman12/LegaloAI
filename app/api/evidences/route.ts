import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const evidences = await prisma.evidence.findMany({
    orderBy: { createdAt: "desc" },
    include: { obligation: true }
  });
  return NextResponse.json({ data: evidences });
}

export async function POST(request: Request) {
  const payload = await request.json();

  const evidence = await prisma.evidence.create({
    data: {
      title: payload.title,
      type: payload.type,
      storageUrl: payload.storageUrl,
      obligationId: payload.obligationId ?? null
    }
  });

  return NextResponse.json({ data: evidence }, { status: 201 });
}
