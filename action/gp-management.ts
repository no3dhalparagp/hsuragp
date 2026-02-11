"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation schema for GP profile creation
const createGPSchema = z.object({
  gpname: z.string().min(2, "GP name must be at least 2 characters"),
  gpaddress: z.string().min(5, "Address must be at least 5 characters"),
  nameinprodhan: z.string().min(2, "Prodhan name must be at least 2 characters"),
  gpcode: z.string().min(2, "GP code must be at least 2 characters").toUpperCase(),
  gpnameinshort: z.string().min(2, "Short name must be at least 2 characters"),
  blockname: z.string().min(2, "Block name must be at least 2 characters"),
  gpshortname: z.string().min(2, "Short name must be at least 2 characters"),
  gpmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  gptannumber: z.string().optional().or(z.literal("")),
  contactNumber: z.string().optional().or(z.literal("")),
});

// Validation schema for GP approval/rejection
const approveGPSchema = z.object({
  gpId: z.string(),
  status: z.enum(["APPROVED", "REJECTED", "SUSPENDED"]),
  rejectionReason: z.string().optional(),
});

/**
 * Create a new GP account (Super Admin only)
 */
export async function createGPAccount(data: z.infer<typeof createGPSchema>) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== "superadmin") {
      return {
        success: false,
        error: "Unauthorized: Only super admins can create GP accounts",
      };
    }

    // Validate input
    const validatedData = createGPSchema.parse(data);

    // Check if GP code already exists
    const existingGP = await db.gPProfile.findUnique({
      where: { gpcode: validatedData.gpcode },
    });

    if (existingGP) {
      return {
        success: false,
        error: `GP code "${validatedData.gpcode}" already exists`,
      };
    }

    // Create GP profile
    const gpProfile = await db.gPProfile.create({
      data: {
        ...validatedData,
        gpmail: validatedData.gpmail || null,
        gptannumber: validatedData.gptannumber || null,
        contactNumber: validatedData.contactNumber || null,
        status: "PENDING",
        createdBy: session.user.id,
      },
    });

    revalidatePath("/dashboard/gp-management");
    return {
      success: true,
      data: gpProfile,
      message: "GP account created successfully. Waiting for approval.",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || "Validation error",
      };
    }
    console.error("Error creating GP account:", error);
    return {
      success: false,
      error: "Failed to create GP account",
    };
  }
}

/**
 * Approve or reject a GP account (Super Admin only)
 */
export async function approveGPAccount(data: z.infer<typeof approveGPSchema>) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== "superadmin") {
      return {
        success: false,
        error: "Unauthorized: Only super admins can approve GP accounts",
      };
    }

    const validatedData = approveGPSchema.parse(data);

    // Check if GP exists
    const gpProfile = await db.gPProfile.findUnique({
      where: { id: validatedData.gpId },
    });

    if (!gpProfile) {
      return {
        success: false,
        error: "GP account not found",
      };
    }

    // Update GP status
    const updatedGP = await db.gPProfile.update({
      where: { id: validatedData.gpId },
      data: {
        status: validatedData.status,
        approvedBy: session.user.id,
        approvedAt: new Date(),
        rejectionReason: validatedData.status === "REJECTED" 
          ? validatedData.rejectionReason || "No reason provided"
          : null,
      },
    });

    revalidatePath("/dashboard/gp-management");
    return {
      success: true,
      data: updatedGP,
      message: `GP account ${validatedData.status.toLowerCase()} successfully`,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || "Validation error",
      };
    }
    console.error("Error approving GP account:", error);
    return {
      success: false,
      error: "Failed to update GP account status",
    };
  }
}

/**
 * Get all GP accounts (Super Admin only)
 */
export async function getAllGPAccounts() {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== "superadmin") {
      return {
        success: false,
        error: "Unauthorized: Only super admins can view GP accounts",
        data: [],
      };
    }

    const gpAccounts = await db.gPProfile.findMany({
      include: {
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approvedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: gpAccounts,
    };
  } catch (error) {
    console.error("Error fetching GP accounts:", error);
    return {
      success: false,
      error: "Failed to fetch GP accounts",
      data: [],
    };
  }
}

/**
 * Get GP account by ID
 */
export async function getGPAccountById(gpId: string) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== "superadmin") {
      return {
        success: false,
        error: "Unauthorized",
        data: null,
      };
    }

    const gpAccount = await db.gPProfile.findUnique({
      where: { id: gpId },
      include: {
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approvedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!gpAccount) {
      return {
        success: false,
        error: "GP account not found",
        data: null,
      };
    }

    return {
      success: true,
      data: gpAccount,
    };
  } catch (error) {
    console.error("Error fetching GP account:", error);
    return {
      success: false,
      error: "Failed to fetch GP account",
      data: null,
    };
  }
}

/**
 * Update GP account (Super Admin only)
 */
export async function updateGPAccount(
  gpId: string,
  data: Partial<z.infer<typeof createGPSchema>>
) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== "superadmin") {
      return {
        success: false,
        error: "Unauthorized: Only super admins can update GP accounts",
      };
    }

    // Check if GP exists
    const existingGP = await db.gPProfile.findUnique({
      where: { id: gpId },
    });

    if (!existingGP) {
      return {
        success: false,
        error: "GP account not found",
      };
    }

    // If gpcode is being updated, check for duplicates
    if (data.gpcode && data.gpcode !== existingGP.gpcode) {
      const duplicateGP = await db.gPProfile.findUnique({
        where: { gpcode: data.gpcode },
      });

      if (duplicateGP) {
        return {
          success: false,
          error: `GP code "${data.gpcode}" already exists`,
        };
      }
    }

    // Update GP profile
    const updatedGP = await db.gPProfile.update({
      where: { id: gpId },
      data: {
        ...data,
        gpmail: data.gpmail || null,
        gptannumber: data.gptannumber || null,
        contactNumber: data.contactNumber || null,
      },
    });

    revalidatePath("/dashboard/gp-management");
    return {
      success: true,
      data: updatedGP,
      message: "GP account updated successfully",
    };
  } catch (error) {
    console.error("Error updating GP account:", error);
    return {
      success: false,
      error: "Failed to update GP account",
    };
  }
}

/**
 * Delete GP account (Super Admin only)
 */
export async function deleteGPAccount(gpId: string) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== "superadmin") {
      return {
        success: false,
        error: "Unauthorized: Only super admins can delete GP accounts",
      };
    }

    // Check if GP exists
    const existingGP = await db.gPProfile.findUnique({
      where: { id: gpId },
    });

    if (!existingGP) {
      return {
        success: false,
        error: "GP account not found",
      };
    }

    // Delete GP profile
    await db.gPProfile.delete({
      where: { id: gpId },
    });

    revalidatePath("/dashboard/gp-management");
    return {
      success: true,
      message: "GP account deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting GP account:", error);
    return {
      success: false,
      error: "Failed to delete GP account",
    };
  }
}

