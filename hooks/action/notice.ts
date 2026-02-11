
"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { v2 as cloudinary } from "cloudinary"
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary"
import { NoticeSchema } from "@/schema"
import { NoticeTypes } from "@prisma/client"
import { Buffer } from "buffer"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

interface CloudinaryFile {
  name: string
  url: string
  type: string
  cloudinaryId: string
}

interface FileData {
  name: string
  type: string
  data: string
}

export async function createNotice(formData: FormData) {
  try {
    // Collect File objects from FormData and convert to base64 for Cloudinary helper
    const fileBlobs = formData.getAll("files").filter((v): v is File => v instanceof File)

    const files: FileData[] = []
    for (const file of fileBlobs) {
      const arrayBuffer = await file.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString("base64")
      files.push({
        name: file.name,
        type: (file.type as string) || "application/octet-stream",
        data: `data:${file.type};base64,${base64}`,
      })
    }

    const uploadedFiles: CloudinaryFile[] = []

    for (const file of files) {
      const uploadResult = await uploadToCloudinary(file)
      if (uploadResult.success && uploadResult.data) {
        uploadedFiles.push({
          name: file.name,
          url: uploadResult.data.url,
          type: file.type,
          cloudinaryId: uploadResult.data.public_id,
        })
      } else {
        await Promise.all(
          uploadedFiles.map((file) => deleteFromCloudinary(file.cloudinaryId))
        )
        return { success: false, error: "File upload failed" }
      }
    }

    const validatedFields = NoticeSchema.parse({
      title: formData.get("title"),
      description: formData.get("description"),
      department: formData.get("department"),
      type: formData.get("type"),
      reference: formData.get("reference"),
      files: uploadedFiles,
    })

    const existingNotice = await db.notice.findUnique({
      where: { reference: validatedFields.reference },
    })

    if (existingNotice) {
      await Promise.all(uploadedFiles.map((file: CloudinaryFile) => deleteFromCloudinary(file.cloudinaryId)))
      return {
        success: false,
        error: "A notice with this reference number already exists",
      }
    }

    const notice = await db.notice.create({
      data: {
        title: validatedFields.title,
        description: validatedFields.description,
        department: validatedFields.department,
        type: validatedFields.type,
        reference: validatedFields.reference,
        files: {
          create: validatedFields.files.map((file) => ({
            name: file.name,
            url: file.url,
            type: file.type,
            cloudinaryId: file.cloudinaryId,
          })),
        },
      },
      include: { files: true },
    })

    revalidatePath("/admindashboard/notice/view")
    return { success: true, data: notice }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((err: z.ZodIssue) => err.message).join(", "),
      }
    }
    console.error("Error creating notice:", error)
    return { success: false, error: "Failed to create notice" }
  }
}

export async function getNotices(type?: NoticeTypes, page = 1, limit = 10) {
  try {
    const skip = (page - 1) * limit

    const [notices, total] = await Promise.all([
      db.notice.findMany({
        where: type ? { type } : undefined,
        include: { files: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.notice.count({ where: type ? { type } : undefined }),
    ])

    return {
      data: notices.map((notice: any) => ({
        id: notice.id,
        title: notice.title,
        description: notice.description,
        department: notice.department,
        type: notice.type as "Tender" | "Notice" | "Circular" | "Other",
        reference: notice.reference,
        date: notice.createdAt.toISOString(),
        files: notice.files.map((file: any) => ({
          name: file.name,
          url: file.url,
          type: file.type,
          cloudinaryId: file.cloudinaryId,
        })),
      })),
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    }
  } catch (error) {
    console.error("Error fetching notices:", error)
    return { data: [], pagination: { total: 0, pages: 0, currentPage: page, limit } }
  }
}

export async function deleteNotice(id: string) {
  try {
    const notice = await db.notice.findUnique({
      where: { id },
      include: { files: true },
    });

    if (!notice) {
      return { success: false, error: "Notice not found" };
    }

    // Delete files from Cloudinary
    await Promise.allSettled(
      notice.files.map((file: any) => 
        file.cloudinaryId ? deleteFromCloudinary(file.cloudinaryId) : Promise.resolve()
      )
    );

    // Delete notice from database
    await db.notice.delete({
      where: { id },
    });

    revalidatePath("/admindashboard/notice/view");
    return { success: true };
  } catch (error) {
    console.error("Error deleting notice:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to delete notice"
    };
  }
}

export async function updateNotice(id: string, formData: FormData) {
  try {
    // Extract File objects and convert to base64 for Cloudinary helper
    const fileBlobs = formData.getAll("files").filter((v): v is File => v instanceof File);
    const files: FileData[] = [];
    for (const file of fileBlobs) {
      const arrayBuffer = await file.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      files.push({
        name: file.name,
        type: (file.type as string) || "application/octet-stream",
        data: `data:${file.type};base64,${base64}`,
      });
    }

    // Parse removed files
    const removedFiles: string[] = formData.has("removedFiles") 
      ? JSON.parse(formData.get("removedFiles") as string) 
      : [];

    // Extract other fields
    const validatedFields = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      department: formData.get("department") as string,
      type: formData.get("type") as NoticeTypes,
      reference: formData.get("reference") as string,
    };

    // Check for existing reference
    const existingReferenceNotice = await db.notice.findUnique({
      where: { reference: validatedFields.reference },
    });

    if (existingReferenceNotice && existingReferenceNotice.id !== id) {
      return { 
        success: false, 
        error: "A notice with this reference number already exists" 
      };
    }

    // Upload new files
    const uploadedFiles: CloudinaryFile[] = [];
    for (const file of files) {
      const uploadResult = await uploadToCloudinary(file);
      if (uploadResult.success && uploadResult.data) {
        uploadedFiles.push({
          name: file.name,
          url: uploadResult.data.url,
          type: file.type,
          cloudinaryId: uploadResult.data.public_id,
        });
      } else {
        await Promise.allSettled(
          uploadedFiles.map((f: CloudinaryFile) => deleteFromCloudinary(f.cloudinaryId))
        );
        return { success: false, error: "File upload failed" };
      }
    }

    const existingNotice = await db.notice.findUnique({
      where: { id },
      include: { files: true },
    });

    if (!existingNotice) {
      await Promise.allSettled(
        uploadedFiles.map(f => deleteFromCloudinary(f.cloudinaryId))
      );
      return { success: false, error: "Notice not found" };
    }

    // Identify files to delete
    const filesToDelete = existingNotice.files.filter((file: any) => 
      removedFiles.includes(file.cloudinaryId || "")
    );

    // Update notice
    const updatedNotice = await db.notice.update({
      where: { id },
      data: {
        title: validatedFields.title,
        description: validatedFields.description,
        department: validatedFields.department,
        type: validatedFields.type,
        reference: validatedFields.reference,
        files: {
          // Delete removed files
          deleteMany: {
            cloudinaryId: {
              in: filesToDelete.map(f => f.cloudinaryId || "")
            }
          },
          // Add new files
          create: uploadedFiles.map((file: CloudinaryFile) => ({
            name: file.name,
            url: file.url,
            type: file.type,
            cloudinaryId: file.cloudinaryId,
          })),
        },
      },
      include: { files: true },
    });

    // Delete files from Cloudinary after successful update
    await Promise.allSettled(
      filesToDelete.map((file: any) => 
        file.cloudinaryId ? deleteFromCloudinary(file.cloudinaryId) : Promise.resolve()
      )
    );

    revalidatePath("/admindashboard/notice/view");
    return { success: true, data: updatedNotice };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((err: z.ZodIssue) => err.message).join(", "),
      };
    }
    console.error("Error updating notice:", error);
    return { success: false, error: "Failed to update notice" };
  }
}
