"use server";

import { db } from "@/lib/db";
import { approvedSchema, ApprovedSchemaType } from "@/schema/approveschema";
import {
  WarishDetailInput,
  WarishFormValuesType,
  warishFormSchema,
} from "@/schema/warishSchema";
import { Prisma, User, WarishApplication } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import * as z from "zod";
import { createNotification } from "@/lib/auth";
import { currentUser } from "@/lib/auth"; // Assuming this is where your auth function is exported from
import { addMonths, isAfter, subDays } from "date-fns";
import { sentWarishAssignNotification } from "@/lib/mail";

async function generateAcknowledgmentNumber() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  // Get the latest application for the current year
  const latestApplication = await db.warishApplication.findFirst({
    where: {
      createdAt: {
        gte: new Date(currentYear, 0, 1), // Start of the current year
        lt: new Date(currentYear + 1, 0, 1), // Start of the next year
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  let sequenceNumber;

  if (latestApplication) {
    // Extract the sequence number from the latest application's acknowledgment number
    const match = latestApplication.acknowlegment.match(/\/(\d+)$/);
    sequenceNumber = match ? parseInt(match[1], 10) + 1 : 1;
  } else {
    // If no applications for the current year, start from 1
    sequenceNumber = 1;
  }

  const acknowledgmentNumber = `ACK/LH/${currentYear}/${sequenceNumber
    .toString()
    .padStart(4, "0")}`;

  return acknowledgmentNumber;
}

export async function createNestedWarishDetails(
  data: WarishFormValuesType
): Promise<{
  success: boolean;
  message: string;
  data?: Prisma.WarishApplicationGetPayload<{
    include: { warishDetails: { include: { children: true } } };
  }>;
  errors?: { [key: string]: string[] };
}> {
  const user = await currentUser();
  if (!user || !user.id) {
    throw new Error("User not authenticated");
  }

  try {
    // Validate the input data
    const acknowlegment = await generateAcknowledgmentNumber();
    const validatedData = warishFormSchema.parse(data);

    // Create the main WarishApplication
    const application = await db.warishApplication.create({
      data: {
        reportingDate: validatedData.reportingDate,
        applicantName: validatedData.applicantName,
        acknowlegment: acknowlegment,
        applicantMobileNumber: validatedData.applicantMobileNumber,
        nameOfDeceased: validatedData.nameOfDeceased,
        dateOfDeath: validatedData.dateOfDeath,
        gender: validatedData.gender,
        relationwithdeceased: validatedData.relationwithdeceased,
        maritialStatus: validatedData.maritialStatus,
        fatherName: validatedData.fatherName,
        spouseName: validatedData.spouseName,
        villageName: validatedData.villageName,
        postOffice: validatedData.postOffice,
        userId: user.id,
      },
    });

    // Recursively create WarishDetails
    const createWarishDetail = async (
      detail: WarishDetailInput,
      parentId?: string
    ): Promise<void> => {
      const createdDetail = await db.warishDetail.create({
        data: {
          name: detail.name,
          gender: detail.gender,
          relation: detail.relation,
          livingStatus: detail.livingStatus,
          maritialStatus: detail.maritialStatus,
          hasbandName: detail.husbandName,
          warishApplication: { connect: { id: application.id } },
          parent: parentId ? { connect: { id: parentId } } : undefined,
        },
      });
      console.log(createWarishDetail);
      // Recursively create children
      if (detail.children && Array.isArray(detail.children)) {
        await Promise.all(
          detail.children.map((child: WarishDetailInput) =>
            createWarishDetail(child, createdDetail.id)
          )
        );
      }
    };

    // Create top-level WarishDetails
    await Promise.all(
      validatedData.warishDetails.map((detail) => createWarishDetail(detail))
    );

    // Fetch the created application with all its details
    const warishApplication = await db.warishApplication.findUnique({
      where: { id: application.id },
      include: {
        warishDetails: {
          include: {
            children: true,
          },
        },
      },
    });

    if (!warishApplication) {
      throw new Error("Failed to create WarishApplication");
    }

    // Create a notification for the current user
    await createNotification(
      user.id,
      `Your Warish application has been successfully created with acknowledgment number ${warishApplication.acknowlegment}.`
    );

    return {
      success: true,
      message: "WarishApplication created successfully",
      data: warishApplication,
    };
  } catch (error) {
    console.error("Error creating WarishApplication:", error);
    if (error instanceof ZodError) {
      return {
        success: false,
        message: "Validation error",
      };
    }
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  } finally {
    await db.$disconnect();
  }
}

export async function submitEnquiryReport(formData: FormData) {
  const user = await currentUser();
  if (!user || !user.id) {
    throw new Error("User not authenticated");
  }

  console.log(formData);
  const report = formData.get("report") as string;
  const applicationId = formData.get("applicationId") as string;

  if (!report || !applicationId) {
    return { success: false, message: "Missing required fields" };
  }

  try {
    // Update the WarishApplication with the enquiry report
    const data = await db.warishApplication.update({
      where: {
        id: applicationId,
      },
      data: {
        fieldreportRemark: report,
        warishApplicationStatus: "pending",
      },
    });

    console.log(data);

    // Create a notification for the current user
    await createNotification(
      user.id,
      "An enquiry report has been submitted for your Warish application."
    );

    // Revalidate the cache after the operation
    revalidatePath(`/employeedashboard/warish/view-assigned/`);
    return { success: true, message: "Enquiry report submitted successfully" };
  } catch (error) {
    console.error("Error submitting enquiry report:", error);
    return {
      success: false,
      message: "An error occurred while submitting the report",
    };
  }
}

export async function approvedWarishApplication(
  values: ApprovedSchemaType,
  applicationId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const user = await currentUser();
    if (!user || !user.id) {
      throw new Error("User not authenticated");
    }

    if (!applicationId) {
      return { success: false, message: "Invalid application ID" };
    }

    const validatedData = approvedSchema.parse(values);

    const updateData = prepareUpdateData(validatedData);

    const updatedApplication = await updateWarishApplication(
      applicationId,
      updateData
    );

    console.log(updatedApplication);
    return { success: true, message: "Action has been taken" };
  } catch (error) {
    console.error("Error in approvedWarishApplication:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
function calculateRenewalDate(warishmemoDate: Date): Date {
  const sixMonthsLater = addMonths(warishmemoDate, 6);
  const currentYear = new Date().getFullYear();
  const nextYearStart = new Date(currentYear + 1, 0, 1); // January 1st of next year

  if (isAfter(sixMonthsLater, nextYearStart)) {
    // If 6 months later is in the next year, subtract the difference
    const daysToSubtract = Math.floor(
      (sixMonthsLater.getTime() - nextYearStart.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return subDays(sixMonthsLater, daysToSubtract);
  }

  return sixMonthsLater;
}

function prepareUpdateData(
  validatedData: ApprovedSchemaType
): Partial<WarishApplication> {
  const updateData: Partial<WarishApplication> = {
    warishApplicationStatus: validatedData.status,
    adminNoteRemark: validatedData.remarks,
  };

  if (
    validatedData.status === "approved" &&
    validatedData.memonumber &&
    validatedData.memodate
  ) {
    const memoDate = validatedData.memodate;
    updateData.warishRefNo = validatedData.memonumber;
    updateData.warishRefDate = memoDate;
    updateData.renewdate = calculateRenewalDate(memoDate);
    updateData.approvalYear = memoDate.getFullYear().toString();
  }

  return updateData;
}

async function updateWarishApplication(
  applicationId: string,
  updateData: Partial<WarishApplication>
) {
  return await db.warishApplication.update({
    where: { id: applicationId },
    data: updateData,
  });
}

async function createUserNotification(
  userId: string,
  validatedData: ApprovedSchemaType
) {
  const notificationMessage = `Your Warish application has been ${
    validatedData.status
  }.${
    validatedData.status === "approved" && validatedData.memonumber
      ? ` Memo number: ${validatedData.memonumber}`
      : ""
  }`;

  await createNotification(userId, notificationMessage);
}

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

export async function searchWarishApplications(searchParams: {
  deceasedName?: string;
  acknowledgementNo?: string;
  applicantName?: string;
  certificateNo?: string;
}) {
  const { deceasedName, acknowledgementNo, applicantName, certificateNo } =
    searchParams;

  // Create an array to hold conditions
  const conditions: Prisma.WarishApplicationWhereInput[] = [];

  if (deceasedName) {
    conditions.push({
      nameOfDeceased: { contains: deceasedName, mode: "insensitive" },
    });
  }
  if (acknowledgementNo) {
    conditions.push({
      acknowlegment: { contains: acknowledgementNo, mode: "insensitive" },
    });
  }
  if (applicantName) {
    conditions.push({
      applicantName: { contains: applicantName, mode: "insensitive" },
    });
  }
  if (certificateNo) {
    conditions.push({
      warishRefNo: { contains: certificateNo, mode: "insensitive" },
    });
  }

  const warish = await db.warishApplication.findMany({
    where: {
      OR: conditions.length > 0 ? conditions : undefined,
    },
    include: {
      warishDetails: true,
      WarishDocument: true,
    },
  });

  return warish;
}

export async function assignStaff(formData: FormData) {
  const user = await currentUser();
  if (!user || !user.id) {
    throw new Error("User not authenticated");
  }

  const applicationId = formData.get("applicationId") as string;
  const staffId = formData.get("staffId") as string;

  if (!applicationId || !staffId) {
    throw new Error("Missing required fields");
  }

  try {
    // Get staff details and application details
    const staff = await db.user.findUnique({
      where: { id: staffId },
      select: { email: true, name: true },
    });

    const application = await db.warishApplication.findUnique({
      where: { id: applicationId },
      select: { acknowlegment: true },
    });

    if (
      !staff ||
      !application ||
      !application.acknowlegment ||
      !staff.email ||
      !staff.name
    ) {
      throw new Error("Staff or application not found");
    }

    // Update application status
    await db.warishApplication.update({
      where: { id: applicationId },
      data: {
        assingstaffId: staffId,
        warishApplicationStatus: "process",
      },
    });

    // Send email notification
    try {
      console.log("Attempting to send email to:", staff.email);
      const emailResponse = await sentWarishAssignNotification(
        staff.email,
        staff.name,
        application.acknowlegment,
        new Date()
      );
      console.log("Email sent successfully:", emailResponse);
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      throw new Error("Failed to send notification email");
    }

    revalidatePath("/admindashboard/manage-warish/asingwarishtostaff");
    return { success: true, message: "Staff assigned successfully" };
  } catch (error) {
    console.error("Error in assignStaff:", error);
    throw error;
  }
}

import { WarishApplicationPayloadProps, WarishDetailProps } from "@/types";

export async function updateWarishDetails() {}

// Update the getWarishByAck function in warishApplicationAction.ts
export async function getWarishByAck(
  id: string
): Promise<WarishFormValuesType | null> {
  try {
    const application = await db.warishApplication.findUnique({
      where: { id: id },
      include: {
        warishDetails: {
          include: {
            children: {
              include: {
                children: true,
              },
            },
          },
        },
      },
    });

    if (!application) return null;

    const transformDetails = (details: any[]): any[] =>
      details.map((d) => ({
        id: d.id,
        name: d.name,
        gender: d.gender,
        relation: d.relation,
        livingStatus: d.livingStatus,
        maritialStatus: d.maritialStatus,
        husbandName: d.hasbandName ?? undefined, // Convert null to undefined
        children: d.children ? transformDetails(d.children) : [],
      }));

    return {
      // Convert all nullable fields to undefined
      reportingDate: application.reportingDate,
      applicantName: application.applicantName,
      applicantMobileNumber: application.applicantMobileNumber ?? undefined,
      relationwithdeceased: application.relationwithdeceased,
      nameOfDeceased: application.nameOfDeceased,
      dateOfDeath: application.dateOfDeath,
      gender: application.gender,
      maritialStatus: application.maritialStatus,
      fatherName: application.fatherName ?? undefined,
      spouseName: application.spouseName ?? undefined, // Fix here
      villageName: application.villageName ?? undefined,
      postOffice: application.postOffice ?? undefined,
      warishDetails: transformDetails(application.warishDetails),
    };
  } catch (error) {
    console.error("Error fetching application:", error);
    return null;
  }
}

export async function updateNestedWarishDetails(
  ackNumber: string,
  data: WarishFormValuesType
) {
  const user = await currentUser();
  if (!user?.id) throw new Error("User not authenticated");

  try {
    const validatedData = warishFormSchema.parse(data);

    return await db.$transaction(async (tx) => {
      const application = await tx.warishApplication.update({
        where: { id: ackNumber },
        data: {
          reportingDate: validatedData.reportingDate,
          applicantName: validatedData.applicantName,
          applicantMobileNumber: validatedData.applicantMobileNumber,
          nameOfDeceased: validatedData.nameOfDeceased,
          dateOfDeath: validatedData.dateOfDeath,
          gender: validatedData.gender,
          relationwithdeceased: validatedData.relationwithdeceased,
          maritialStatus: validatedData.maritialStatus,
          fatherName: validatedData.fatherName,
          spouseName: validatedData.spouseName,
          villageName: validatedData.villageName,
          postOffice: validatedData.postOffice,
        },
      });

      const existingDetails = await tx.warishDetail.findMany({
        where: { warishApplicationId: application.id },
      });

      const updateDetails = async (
        details: typeof validatedData.warishDetails,
        parentId?: string
      ) => {
        const existingIds = details.filter((d) => d.id).map((d) => d.id!);

        // Delete removed details
        await tx.warishDetail.deleteMany({
          where: {
            id: { notIn: existingIds },
            parentId: parentId || null,
          },
        });

        for (const detail of details) {
          const detailData = {
            name: detail.name,
            gender: detail.gender,
            relation: detail.relation,
            livingStatus: detail.livingStatus,
            maritialStatus: detail.maritialStatus,
            hasbandName: detail.husbandName,
            parentId: parentId || null,
            warishApplicationId: application.id,
          };

          const operation = detail.id
            ? tx.warishDetail.update({
                where: { id: detail.id },
                data: detailData,
              })
            : tx.warishDetail.create({ data: detailData });

          const updatedDetail = await operation;

          if (detail.children) {
            await updateDetails(detail.children, updatedDetail.id);
          }
        }
      };

      await updateDetails(validatedData.warishDetails);

      const updatedApplication = await tx.warishApplication.findUnique({
        where: { id: application.id },
        include: {
          warishDetails: {
            include: {
              children: true,
            },
          },
        },
      });

      return {
        success: true,
        message: "Application updated successfully",
        data: updatedApplication,
      };
    });
  } catch (error) {
    console.error("Update error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Update failed",
    };
  }
}
