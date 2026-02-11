"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from "bcryptjs";

// Validation schema for GP admin user creation
const createGPAdminSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  mobileNumber: z.string().optional(),
  gpId: z.string().min(1, "GP selection is required"),
});

// Validation schema for updating GP admin user
const updateGPAdminSchema = z.object({
  userId: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  mobileNumber: z.string().optional(),
  gpId: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  userStatus: z.enum(["active", "inactive"]).optional(),
});

/**
 * Create a GP admin user (Super Admin only)
 */
export async function createGPAdminUser(data: z.infer<typeof createGPAdminSchema>) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== "superadmin") {
      return {
        success: false,
        error: "Unauthorized: Only super admins can create GP admin users",
      };
    }

    // Validate input
    const validatedData = createGPAdminSchema.parse(data);

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email: validatedData.email.toLowerCase() },
    });

    if (existingUser) {
      return {
        success: false,
        error: "Email already exists",
      };
    }

    // Check if GP exists and is approved
    const gp = await db.gPProfile.findUnique({
      where: { id: validatedData.gpId },
    });

    if (!gp) {
      return {
        success: false,
        error: "GP account not found",
      };
    }

    if (gp.status !== "APPROVED" && gp.status !== "ACTIVE") {
      return {
        success: false,
        error: "GP account must be approved before creating admin users",
      };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create GP admin user
    const adminUser = await db.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email.toLowerCase(),
        mobileNumber: validatedData.mobileNumber || null,
        password: hashedPassword,
        role: "admin",
        assignedGPId: validatedData.gpId,
        emailVerified: new Date(), // Auto-verify GP admin email
        userStatus: "active",
      },
      include: {
        assignedGP: {
          select: {
            id: true,
            gpname: true,
            gpcode: true,
          },
        },
      },
    });

    revalidatePath("/dashboard/gp-admin-users");
    return {
      success: true,
      data: adminUser,
      message: "GP admin user created successfully",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || "Validation error",
      };
    }
    console.error("Error creating GP admin user:", error);
    return {
      success: false,
      error: "Failed to create GP admin user",
    };
  }
}

/**
 * Get all GP admin users (Super Admin only)
 */
export async function getAllGPAdminUsers() {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== "superadmin") {
      return {
        success: false,
        error: "Unauthorized: Only super admins can view GP admin users",
        data: [],
      };
    }

    const adminUsers = await db.user.findMany({
      where: {
        role: "admin",
        assignedGPId: { not: null },
      },
      include: {
        assignedGP: {
          select: {
            id: true,
            gpname: true,
            gpcode: true,
            status: true,
          },
        },
      },
    
    });

    return {
      success: true,
      data: adminUsers,
    };
  } catch (error) {
    console.error("Error fetching GP admin users:", error);
    return {
      success: false,
      error: "Failed to fetch GP admin users",
      data: [],
    };
  }
}

/**
 * Get GP admin user by ID
 */
export async function getGPAdminUserById(userId: string) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== "superadmin") {
      return {
        success: false,
        error: "Unauthorized",
        data: null,
      };
    }

    const adminUser = await db.user.findUnique({
      where: { id: userId },
      include: {
        assignedGP: {
          select: {
            id: true,
            gpname: true,
            gpcode: true,
            gpaddress: true,
            status: true,
          },
        },
      },
    });

    if (!adminUser || adminUser.role !== "admin" || !adminUser.assignedGPId) {
      return {
        success: false,
        error: "GP admin user not found",
        data: null,
      };
    }

    return {
      success: true,
      data: adminUser,
    };
  } catch (error) {
    console.error("Error fetching GP admin user:", error);
    return {
      success: false,
      error: "Failed to fetch GP admin user",
      data: null,
    };
  }
}

/**
 * Update GP admin user (Super Admin only)
 */
export async function updateGPAdminUser(
  data: z.infer<typeof updateGPAdminSchema>
) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== "superadmin") {
      return {
        success: false,
        error: "Unauthorized: Only super admins can update GP admin users",
      };
    }

    const validatedData = updateGPAdminSchema.parse(data);

    // Check if user exists and is a GP admin
    const existingUser = await db.user.findUnique({
      where: { id: validatedData.userId },
    });

    if (!existingUser || existingUser.role !== "admin" || !existingUser.assignedGPId) {
      return {
        success: false,
        error: "GP admin user not found",
      };
    }

    // If email is being updated, check for duplicates
    if (validatedData.email && validatedData.email !== existingUser.email) {
      const duplicateUser = await db.user.findUnique({
        where: { email: validatedData.email.toLowerCase() },
      });

      if (duplicateUser) {
        return {
          success: false,
          error: "Email already exists",
        };
      }
    }

    // If GP is being updated, verify it exists and is approved
    if (validatedData.gpId && validatedData.gpId !== existingUser.assignedGPId) {
      const gp = await db.gPProfile.findUnique({
        where: { id: validatedData.gpId },
      });

      if (!gp) {
        return {
          success: false,
          error: "GP account not found",
        };
      }

      if (gp.status !== "APPROVED" && gp.status !== "ACTIVE") {
        return {
          success: false,
          error: "GP account must be approved",
        };
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (validatedData.name) updateData.name = validatedData.name;
    if (validatedData.email) updateData.email = validatedData.email.toLowerCase();
    if (validatedData.mobileNumber !== undefined) updateData.mobileNumber = validatedData.mobileNumber || null;
    if (validatedData.gpId) updateData.assignedGPId = validatedData.gpId;
    if (validatedData.userStatus) updateData.userStatus = validatedData.userStatus;
    if (validatedData.password) {
      updateData.password = await bcrypt.hash(validatedData.password, 10);
    }

    // Update user
    const updatedUser = await db.user.update({
      where: { id: validatedData.userId },
      data: updateData,
      include: {
        assignedGP: {
          select: {
            id: true,
            gpname: true,
            gpcode: true,
          },
        },
      },
    });

    revalidatePath("/dashboard/gp-admin-users");
    return {
      success: true,
      data: updatedUser,
      message: "GP admin user updated successfully",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || "Validation error",
      };
    }
    console.error("Error updating GP admin user:", error);
    return {
      success: false,
      error: "Failed to update GP admin user",
    };
  }
}

/**
 * Delete GP admin user (Super Admin only)
 */
export async function deleteGPAdminUser(userId: string) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== "superadmin") {
      return {
        success: false,
        error: "Unauthorized: Only super admins can delete GP admin users",
      };
    }

    // Check if user exists and is a GP admin
    const existingUser = await db.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser || existingUser.role !== "admin" || !existingUser.assignedGPId) {
      return {
        success: false,
        error: "GP admin user not found",
      };
    }

    // Delete user
    await db.user.delete({
      where: { id: userId },
    });

    revalidatePath("/dashboard/gp-admin-users");
    return {
      success: true,
      message: "GP admin user deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting GP admin user:", error);
    return {
      success: false,
      error: "Failed to delete GP admin user",
    };
  }
}

/**
 * Get approved GP accounts for dropdown (Super Admin only)
 */
export async function getApprovedGPAccounts() {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== "superadmin") {
      return {
        success: false,
        error: "Unauthorized",
        data: [],
      };
    }

    const gpAccounts = await db.gPProfile.findMany({
      where: {
        status: {
          in: ["APPROVED", "ACTIVE"],
        },
      },
      select: {
        id: true,
        gpname: true,
        gpcode: true,
        gpaddress: true,
      },
      orderBy: {
        gpname: "asc",
      },
    });

    return {
      success: true,
      data: gpAccounts,
    };
  } catch (error) {
    console.error("Error fetching approved GP accounts:", error);
    return {
      success: false,
      error: "Failed to fetch GP accounts",
      data: [],
    };
  }
}

