"use server";

import { db } from "@/lib/db";

export async function getWorkDetailsAction(workId: string) {
  try {
    const workDetails = await db.worksDetail.findUnique({
      where: {
        id: workId,
      },
      include: {
        nitDetails: true,
        ApprovedActionPlanDetails: true,
        biddingAgencies: {
          include: {
            agencydetails: true,
          },
          
        },
      },
    });

    if (!workDetails) {
      return { error: "Work details not found" };
    }

    return { data: workDetails };
  } catch (error) {
    console.error("Error fetching work details:", error);
    return { error: "Failed to fetch work details" };
  }
}
