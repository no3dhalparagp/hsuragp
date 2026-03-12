import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ requestId: string }> }) {
  try {
    const { requestId } = await params
    const body = await req.json()
    const { approve, reviewedBy, reviewComments } = body

    if (typeof approve !== "boolean" || !reviewedBy) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: approve (boolean) and reviewedBy",
        },
        { status: 400 },
      )
    }

    const request = await db.warishModificationRequest.findUnique({
      where: { id: requestId },
    })

    if (!request) {
      return NextResponse.json(
        {
          success: false,
          message: "Request not found",
        },
        { status: 404 },
      )
    }

    if (request.status !== "pending") {
      return NextResponse.json(
        {
          success: false,
          message: "Request has already been reviewed",
        },
        { status: 400 },
      )
    }

    // If approved, apply the changes
    if (approve) {
      try {
        if (request.targetType === "detail" && request.warishDetailId) {
          // Validate field exists and update

       
          const updateData: any = {}
          updateData[request.fieldToModify] = request.proposedValue
          
          await db.warishDetail.update({
            where: { id: request.warishDetailId },
            data: updateData,
          })
        } else if (request.targetType === "application" && request.warishApplicationId) {
          // Validate field exists and update
          const updateData: any = {}
          updateData[request.fieldToModify] = request.proposedValue

          const warishdata = await db.warishApplication.update({
            where: { id: request.warishApplicationId },
            data: updateData,
          })

    

          const warisholdcertificate = await db.warishDocument.deleteMany({
            where: {
              warishId: warishdata.id
            }
          })
        } else {
          return NextResponse.json(
            {
              success: false,
              message: "Invalid correction request target",
            },
            { status: 400 },
          )
        }
      } catch (updateError: any) {
        console.error("Error applying correction:", updateError)
        return NextResponse.json(
          {
            success: false,
            message: `Failed to apply correction: ${updateError.message}`,
          },
          { status: 500 },
        )
      }
    }

    // Update the request status
    const updatedRequest = await db.warishModificationRequest.update({
      where: { id: requestId },
      data: {
        status: approve ? "approved" : "rejected",
        reviewedBy,
        reviewedDate: new Date(),
        reviewComments: reviewComments || null,
      },
    })

    return NextResponse.json({
      success: true,
      message: approve ? "Correction approved and applied" : "Correction rejected",
      data: updatedRequest,
    })
  } catch (error: any) {
    console.error("Error reviewing correction request:", error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to review correction request",
      },
      { status: 500 },
    )
  }
}
