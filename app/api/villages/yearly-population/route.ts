import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { villageId, year, ...rest } = body;

  // Upsert: update if exists, else create
  const data = await db.yearlyPopulationData.upsert({
    where: { villageId_year: { villageId, year: Number(year) } },
    update: { ...rest },
    create: { villageId, year: Number(year), ...rest },
  });

  return NextResponse.json({ success: true, data });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id } = body;

  const data = await db.yearlyPopulationData.update({
    where: { id },
    data: { verified: true },
  });

  return NextResponse.json({ success: true, data });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });

  const data = await db.yearlyPopulationData.findUnique({ where: { id } });
  return NextResponse.json({ success: true, data });
}