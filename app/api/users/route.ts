import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { company: true }
  });
  return NextResponse.json({ data: users });
}

export async function POST(request: Request) {
  const payload = await request.json();

  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      role: payload.role ?? "Compliance Lead",
      companyId: payload.companyId ?? null
    }
  });

  return NextResponse.json({ data: user }, { status: 201 });
}
