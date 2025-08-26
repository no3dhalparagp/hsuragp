import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const workId = req.nextUrl.searchParams.get("workId");
  
  if (!workId || typeof workId !== "string") {
    return NextResponse.json(
      { error: "Valid workId is required" },
      { status: 400 }
    );
  }

  try {
    const [acceptbi, worksDetail] = await Promise.all([
      db.bidagency.findMany({
        where: { worksDetailId: workId },
        select: {
          id: true,
          biddingAmount: true,
          agencydetails: true,
        },
      }),
      db.worksDetail.findUnique({
        where: { id: workId },
        include: {
          nitDetails: true,
          ApprovedActionPlanDetails: true
        },
      }),
    ]);

    if (!worksDetail) {
      return NextResponse.json(
        { error: "Work not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ acceptbi, worksDetail });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
