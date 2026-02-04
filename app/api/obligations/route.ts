import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const obligations = await prisma.obligation.findMany({
    orderBy: { createdAt: "desc" },
    include: { citations: true, evidences: true }
  });
  return NextResponse.json({ data: obligations });
}

export async function POST(request: Request) {
  const payload = await request.json();

  const obligation = await prisma.obligation.create({
    data: {
      title: payload.title,
      description: payload.description,
      status: payload.status ?? "Open",
      owner: payload.owner,
      dueDate: payload.dueDate ? new Date(payload.dueDate) : null
    }
  });

  return NextResponse.json({ data: obligation }, { status: 201 });
}
