"use server";
import * as z from "zod";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { leaveSchema } from "@/schema/leaveSchema";

export const leaveApplication = async (values: z.infer<typeof leaveSchema>) => {
  try {
    const validateField = leaveSchema.safeParse(values);

    if (!validateField.success) {
      return { error: "Invalid fields !" };
    }
    const { startDate, endDate, reason } = validateField.data;

    const user = await currentUser();
    if (!user) {
      throw new Error("User not found");
    }

    if (startDate >= endDate) {
      throw new Error("End date must be after start date.");
    }

    const userId = user.id || ""; // Provide a fallback value for userId if it's undefined

    const leaveApp = await db.leave.create({
      data: {
        startDate,
        endDate,

        reason,
        userId,
      },
    });
    console.log(leaveApp);
    return { success: "leave applied suceffuly" };
  } catch (error) {
    console.log(error);
    return { error: "Error" };
  }
};
