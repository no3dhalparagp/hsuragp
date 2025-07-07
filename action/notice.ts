"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { v2 as cloudinary } from "cloudinary"
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary"
import { NoticeSchema } from "@/schema"
import { NoticeTypes } from "@prisma/client"

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

interface FileWithCloudinaryId {
  id: string
  name: string
  url: string
  type: string
  cloudinaryId: string | null
  noticeId: string
  createdAt: Date
  updatedAt: Date
}

export async function createNotice(formData: FormData) {
  try {
    const files: FileData[] = []
    let index = 0
    while (formData.has(`files[${index}]`)) {
      const file = JSON.parse(formData.get(`files[${index}]`) as string)
      files.push(file)
      index++
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
        await Promise.all(uploadedFiles.map((file) => deleteFromCloudinary(file.cloudinaryId)))
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
      await Promise.all(uploadedFiles.map((file) => deleteFromCloudinary(file.cloudinaryId)))
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
            cloudinaryId: file.name,
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
        error: error.errors.map((err) => err.message).join(", "),
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
      data: notices.map((notice) => ({
        id: notice.id,
        title: notice.title,
        description: notice.description,
        department: notice.department,
        type: notice.type as "Tender" | "Notice" | "Circular" | "Other",
        reference: notice.reference,
        date: notice.createdAt.toISOString(),
        files: notice.files.map((file) => ({
          name: file.name,
          url: file.url,
          type: file.type,
          cloudinaryId: file.name,
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

    console.log(notice)
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
    // Parse form data
    const validatedFields = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      department: formData.get("department") as string,
      type: formData.get("type") as NoticeTypes,
      reference: formData.get("reference") as string,
      files: formData.getAll("files").map(file => JSON.parse(file as string)),
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

    // Upload new files with proper error handling
    const uploadResults = await Promise.allSettled(
      validatedFields.files.map(file => uploadToCloudinary(file))
    );

    const uploadedFiles: CloudinaryFile[] = [];
    const errors: Error[] = [];

    for (const result of uploadResults) {
      if (result.status === 'fulfilled' && result.value.success && result.value.data) {
        uploadedFiles.push({
          name: result.value.data.name,
          url: result.value.data.url,
          type: result.value.data.type,
          cloudinaryId: result.value.data.public_id,
        });
      } else {
        const error = result.status === 'rejected' 
          ? result.reason 
          : new Error(result.value.error || "Unknown upload error");
        errors.push(error);
      }
    }

    if (errors.length > 0) {
      await Promise.allSettled(
        uploadedFiles.map(file => deleteFromCloudinary(file.cloudinaryId))
      );
      return {
        success: false,
        error: `Failed to upload files: ${errors.map(e => e.message).join(', ')}`
      };
    }

    // Get existing notice for old files
    const existingNotice = await db.notice.findUnique({
      where: { id },
      include: { files: true },
    });

    if (!existingNotice) {
      await Promise.allSettled(
        uploadedFiles.map(file => deleteFromCloudinary(file.cloudinaryId))
      );
      return { success: false, error: "Notice not found" };
    }

    // Update database
    const updatedNotice = await db.notice.update({
      where: { id },
      data: {
        title: validatedFields.title,
        description: validatedFields.description,
        department: validatedFields.department,
        type: validatedFields.type,
        reference: validatedFields.reference,
        files: {
          deleteMany: {},
          create: uploadedFiles.map(file => ({
            name: file.name,
            url: file.url,
            type: file.type,
            cloudinaryId: file.cloudinaryId,
          })),
        },
      },
      include: { files: true },
    });

    // Delete old files after successful update
    const oldFiles = existingNotice.files.filter(file => file.name);
    await Promise.allSettled(
      oldFiles.map(file => deleteFromCloudinary(file.name))
    );

  
    revalidatePath("/admindashboard/notice/view");
    return { success: true};
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((err) => err.message).join(", "),
      };
    }
    console.error("Error updating notice:", error);
    return { success: false, error: "Failed to update notice" };
  }
}