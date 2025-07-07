"use server";

import { WarishApplication, WarishDetail } from "@prisma/client";

import { db } from "@/lib/db";

export async function verifyWarishApplication(refNo: string) {
  try {
    // First, find the application by reference number only
    const application = await db.warishApplication.findFirst({
      where: {
        warishRefNo: refNo,
      },
    });

    console.log("Application found:", application);

    if (application) {
      // Check if the reference date matches
      // Simulate a check for genuineness
      const isGenuine = application.warishApplicationStatus === "approved";
      return {
        success: true,
        id: application.id,
        isGenuine,
        message: isGenuine
          ? "Application verified successfully."
          : "Application found, but not approved.",
      };
    } else {
      return {
        success: false,
        message: "Application found, but the reference date does not match.",
      };
    }
  } catch (error) {
    console.error("Error verifying Warish application:", error);
    throw new Error("Failed to verify Warish application");
  }
}

export async function getWarishApplicationDetails(id: string) {
  try {
    const application = await db.warishApplication.findUnique({
      where: { id },
      include: { warishDetails: true },
    });

    if (application) {
      return {
        success: true,
        application: application as WarishApplication & {
          warishDetails: WarishDetail[];
        },
      };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.error("Error fetching Warish application details:", error);
    throw new Error("Failed to fetch Warish application details");
  }
}
