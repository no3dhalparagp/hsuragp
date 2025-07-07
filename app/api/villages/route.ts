// app/api/villages/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const yearParam = searchParams.get("year");

  try {
    if (yearParam) {
      // If a year is provided, fetch villages with that year's population data
      const year = parseInt(yearParam);
      if (isNaN(year)) {
        return NextResponse.json(
          { success: false, error: "Invalid year parameter" },
          { status: 400 }
        );
      }
      const villages = await db.village.findMany({
        orderBy: { name: "asc" },
        include: {
          yearlyData: {
            where: { year },
          },
        },
      });
      return NextResponse.json({ success: true, data: villages });
    } else {
      // If no year is provided, fetch all village names and IDs
      const villages = await db.village.findMany({
        select: {
          id: true,
          name: true,
        },
        orderBy: { name: "asc" },
      });
      return NextResponse.json({ success: true, data: villages });
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch village data",
      },
      { status: 500 }
    );
  }
}
