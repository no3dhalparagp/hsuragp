"use server"

import { createAgreement } from "@/action/create-agrement";
import { register } from "@/lib/register";
import { bidagencybyid } from "@/lib/auth";
import { db } from "@/lib/db";
import { sentAwardedNotification } from "@/lib/mail";
import { CreateAgreementInput } from "@/types/agreement";

export const addAoCdetails = async (data: FormData) => {
  try {
    const workodermenonumber = data.get("memono") as string;
    const workordeermemodate = new Date(data.get("memodate") as string);
    const worksDetailId = data.get("workId") as string;
    const bidagencyId = data.get("acceptbidderId") as string | null;

    // Ensure necessary fields are provided
    if (!workodermenonumber || !worksDetailId) {
      return { error: "Missing required fields: memono or workId" };
    }

    if (!bidagencyId) {
      return { error: "Missing required field: bidagencyId" };
    }

  
    const aoc = await db.awardofContract.create({
      data: {
        workodermenonumber,
        workordeermemodate,
      },
    });

    // Create the workorderdetails record and link it to the AOC and Bidagency
    const workorderDetails = await db.workorderdetails.create({
      data: {
        awardofContractId: aoc.id, // Link to the AOC
        bidagencyId, // Use bidagencyId directly
      },
    });

    // Update WorksDetail to associate with the newly created AOC and update tenderStatus
    const work = await db.worksDetail.update({
      where: {
        id: worksDetailId,
      },
      data: {
        workStatus: "workorder",
        tenderStatus: "AOC", // Updating the tender status to AOC
        AwardofContract: {
          connect: { id: aoc.id }, // Connect the AOC to WorksDetail
        },
      },
    });

    const inputdata: CreateAgreementInput = {
      aggrementno: `AGR-${aoc.workordeermemodate.getFullYear()}-${String(
        aoc.workodermenonumber
      ).padStart(4, "0")}/${work.workslno}`,
      aggrementdate: aoc.workordeermemodate.toISOString(),
      approvedActionPlanDetailsId: work.approvedActionPlanDetailsId,
      bidagencyId: bidagencyId,
    };

    const fetchnitdetais = await db.nitDetails.findUnique({
      where: {
        id: work.nitDetailsId,
      },
    });
    const agrement = await createAgreement(inputdata);
    await register(bidagencyId, work.earnestMoneyFee);
    const bidder = await bidagencybyid(bidagencyId);
    if (!bidder) {
      return { error: "Bidder not found." };
    }
    if (bidder.agencydetails.email) {
      await sentAwardedNotification(
        bidder.agencydetails.email,
        fetchnitdetais?.memoNumber || 0,
        fetchnitdetais?.memoDate || new Date(),
        work.workslno,
        bidder.agencydetails.name
      );
    }
    return { success: "Work order finalized successfully." };
    
  } catch (error) {
    console.log(error);
    
    return { error: "Failed to create work order. Please try again later." };
  } finally {
    await db.$disconnect();
  }
};