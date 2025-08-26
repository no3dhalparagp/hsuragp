"use server"

import { createAgreement } from "@/action/create-agrement";
import { register } from "@/lib/register";
import { bidagencybyid } from "@/lib/auth";
import { db } from "@/lib/db";
import { sentAwardedNotification } from "@/lib/mail";
import { CreateAgreementInput } from "@/types/agreement";
import { z } from "zod";

// Validation schema
const AocSchema = z.object({
  workodermenonumber: z.string().min(1, "Memo number is required"),
  workordeermemodate: z.string().min(1, "Memo date is required"),
  worksDetailId: z.string().min(1, "Work ID is required"),
  bidagencyId: z.string().min(1, "Bid agency ID is required"),
});

export const addAoCdetails = async (data: FormData) => {
  try {
    // Extract and validate data
    const formData = {
      memono: data.get("memono") as string,
      memodate: data.get("memodate") as string,
      workId: data.get("workId") as string,
      acceptbidderId: data.get("acceptbidderId") as string,
    };

    const validation = AocSchema.safeParse({
      workodermenonumber: formData.memono,
      workordeermemodate: formData.memodate,
      worksDetailId: formData.workId,
      bidagencyId: formData.acceptbidderId,
    });

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      return { error: "Validation failed", details: errors };
    }

    const { workodermenonumber, worksDetailId, bidagencyId } = validation.data;
    const workordeermemodate = new Date(validation.data.workordeermemodate);

    // Use transaction for all database operations
    const result = await db.$transaction(async (tx) => {
      // Create AoC
      const aoc = await tx.awardofContract.create({
        data: {
          workodermenonumber,
          workordeermemodate,
        },
      });

      // Create work order details
      await tx.workorderdetails.create({
        data: {
          awardofContractId: aoc.id,
          bidagencyId,
        },
      });

      // Update work details
      const work = await tx.worksDetail.update({
        where: { id: worksDetailId },
        data: {
          workStatus: "workorder",
          tenderStatus: "AOC",
          AwardofContract: {
            connect: { id: aoc.id },
          },
        },
        include: {
          nitDetails: true,
          ApprovedActionPlanDetails: true,
        },
      });

      return { aoc, work };
    });

    const { aoc, work } = result;

    // Create agreement
    const inputdata: CreateAgreementInput = {
      aggrementno: `AGR-${aoc.workordeermemodate.getFullYear()}-${String(
        aoc.workodermenonumber
      ).padStart(4, "0")}/${work.workslno}`,
      aggrementdate: aoc.workordeermemodate.toISOString(),
      approvedActionPlanDetailsId: work.approvedActionPlanDetailsId,
      bidagencyId: bidagencyId,
    };

    const [agrement, bidder] = await Promise.all([
      createAgreement(inputdata),
      bidagencybyid(bidagencyId),
    ]);

    if (!bidder) {
      throw new Error("Bidder not found");
    }

    // Register bid agency and send notification
    await Promise.all([
      register(bidagencyId, work.earnestMoneyFee),
      bidder.agencydetails.email
        ? sentAwardedNotification(
            bidder.agencydetails.email,
            work.nitDetails?.memoNumber || 0,
            work.nitDetails?.memoDate || new Date(),
            work.workslno,
            bidder.agencydetails.name
          )
        : Promise.resolve(),
    ]);

    return { success: "Work order finalized successfully." };
  } catch (error) {
    console.error("Failed to create work order:", error);
    
    // Provide more specific error messages
    if (error instanceof z.ZodError) {
      return { error: "Invalid input data" };
    }
    
    return { 
      error: error instanceof Error 
        ? error.message 
        : "Failed to create work order. Please try again later." 
    };
  }
};
