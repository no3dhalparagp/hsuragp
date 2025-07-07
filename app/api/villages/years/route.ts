import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const distinctYears = await db.yearlyPopulationData.findMany({
      select: {
        year: true,
      },
      distinct: ["year"],
      orderBy: {
        year: "desc",
      },
    });

    const years = distinctYears.map((item) => item.year);

    return NextResponse.json({ success: true, data: years });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch distinct years" },
      { status: 500 }
    );
  }
} 