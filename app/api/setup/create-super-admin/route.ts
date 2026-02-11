import { NextRequest, NextResponse } from "next/server";
import { createSuperAdminPublic } from "@/action/create-super-admin";
import { z } from "zod";

const createSuperAdminSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().optional(),
  mobileNumber: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = createSuperAdminSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Validation failed",
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const { email, password, name, mobileNumber } = validationResult.data;

    // Create super admin
    const result = await createSuperAdminPublic(email, password, name, mobileNumber);

    if (result.success) {
      return NextResponse.json(
        { 
          success: true, 
          message: result.message,
          data: result.data 
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error 
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in create super admin API:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Internal server error" 
      },
      { status: 500 }
    );
  }
}

