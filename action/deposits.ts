"use server";

import { db } from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

// Zod validation schema
const formSchema = z.object({
  paymentMethod: z.enum(["CHEQUE", "ONLINE_TRANSFER", "CASH"], {
    required_error: "Please select a payment method",
  }),
  chequeNumber: z.string().optional(),
  chequeDate: z.date().optional(),
  transactionId: z.string().optional(),
  paymentDate: z.date({
    required_error: "Payment date is required",
  }),
});

// Infer TypeScript type from Zod schema
type FormValues = z.infer<typeof formSchema>;

interface UpdateDepositParams extends FormValues {
  depositId: string;
}

export async function updateDepositStatus(params: UpdateDepositParams) {
  try {
    // Validate input against schema
    const validatedData = formSchema.parse({
      paymentMethod: params.paymentMethod,
      chequeNumber: params.chequeNumber,
      chequeDate: params.chequeDate,

      paymentDate: params.paymentDate,
    });

    // Update the deposit with validated data
    await db.secrutityDeposit.update({
      where: { id: params.depositId },
      data: {
        paymentstatus: "paid",
        paymentDate: validatedData.paymentDate,
        paymentMethod: validatedData.paymentMethod,
        chequeNumber:
          validatedData.paymentMethod === "CHEQUE"
            ? validatedData.chequeNumber
            : undefined,
        chequeDate:
          validatedData.paymentMethod === "CHEQUE"
            ? validatedData.chequeDate
            : undefined,
        // In your TypeScript code
        transactionID:
          validatedData.paymentMethod === "ONLINE_TRANSFER"
            ? validatedData.transactionId
            : undefined,
      },
    });

    // Revalidate cached data
    revalidateTag("security-deposits");
    revalidateTag(`security-deposit-${params.depositId}`);
    revalidatePath("/admindashboard/register/security");

    return { success: true, message: "Deposit status updated successfully" };
  } catch (error) {
    console.error("Error updating deposit status:", error);
    return {
      success: false,
      message:
        error instanceof z.ZodError
          ? error.errors.map((e) => e.message).join(", ")
          : "Failed to update deposit status",
    };
  }
}
