
"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getLatestMemoNumber(year: number): Promise<number> {
  try {
    if (year < 1900 || year > 9999 || !Number.isInteger(year)) {
      throw new Error(
        "Invalid year: must be a 4-digit integer between 1900 and 9999"
      );
    }

    const latestMemo = await db.warishApplication.findFirst({
      where: {
        warishRefNo: {
          endsWith: `/${year}`,
        },
      },
      orderBy: {
        warishRefNo: "desc",
      },
      select: {
        warishRefNo: true,
      },
    });

    if (!latestMemo || !latestMemo.warishRefNo) {
      return 0;
    }

    const parts = latestMemo.warishRefNo.split("/");
    if (parts.length !== 4) {
      throw new Error(`Invalid memo number format: ${latestMemo.warishRefNo}`);
    }

    const numberPart = parseInt(parts[0], 10);
    if (isNaN(numberPart)) {
      throw new Error(`Invalid number part in memo number: ${parts[0]}`);
    }

    return numberPart;
  } catch (error) {
    console.error("Error in getLatestMemoNumber:", error);
    throw error;
  }
}

export async function renewWarishApplication(id: string) {
  try {
    const today = new Date();
    const currentYear = today.getFullYear();

    // Get the latest memo number for the current year
    const latestMemoNumber = await getLatestMemoNumber(currentYear);

    // Generate the new warishRefNo
    const newMemoNumber = latestMemoNumber + 1;
    const newWarishRefNo = `${newMemoNumber
      .toString()
      .padStart(3, "0")}/DGP/(LH)/${currentYear}`;

    // Calculate initial renewal date (6 months from today)
    const renewdate = new Date(today);
    renewdate.setMonth(renewdate.getMonth() + 6);

    // Ensure renewdate stays within current year
    if (renewdate.getFullYear() > currentYear) {
      renewdate.setFullYear(currentYear);
      renewdate.setMonth(11); // December
      renewdate.setDate(31); // Last day of December
    }

    // Update database record
    await db.warishApplication.update({
      where: { id },
      data: {
        warishRefNo: newWarishRefNo,
        warishRefDate: today,
        renewdate: renewdate,
        approvalYear: currentYear.toString(),
        warishApplicationStatus:"renewed",
      },
    });

    revalidatePath("/warish-renewal");
    return { success: true, message: "Application renewed successfully" };
  } catch (error) {
    console.error("Failed to renew application:", error);
    return { success: false, message: "Failed to renew application" };
  }
}
