import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const companies = await prisma.company.findMany({
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ data: companies });
}

export async function POST(request: Request) {
  const payload = await request.json();

  const company = await prisma.company.create({
    data: {
      name: payload.name,
      industry: payload.industry,
      location: payload.location
    }
  });

  return NextResponse.json({ data: company }, { status: 201 });
}
