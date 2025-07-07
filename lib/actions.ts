// lib/actions/notification.ts
"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import { NotificationType } from "@prisma/client";

const NotificationSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(500, "Message too long"),
  link: z.string().optional(),
  type: z.nativeEnum(NotificationType).default(NotificationType.INFO),
});

export type CreateNotificationResponse =
  | { success: true; notificationId: string }
  | { success: false; error: string };

export const createNotification = async (
  userId: string,
  message: string,
  options?: {
    link?: string;
    type?: NotificationType;
  }
): Promise<CreateNotificationResponse> => {
  try {
    const validation = NotificationSchema.safeParse({
      userId,
      message,
      link: options?.link,
      type: options?.type,
    });

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.errors.map((e) => e.message).join(", "),
      };
    }

    const notification = await db.notification.create({
      data: {
        userId: validation.data.userId,
        message: validation.data.message,
        link: validation.data.link,
        type: validation.data.type,
        read: false,
      },
      select: { id: true },
    });

    return {
      success: true,
      notificationId: notification.id,
    };
  } catch (error) {
    console.error("Notification creation failed:", error);
    return {
      success: false,
      error: "Failed to create notification",
    };
  }
};

export const getFundType = async () => {
  // Fetch distinct fund types from the database
  const fundTypes = await db.approvedActionPlanDetails.findMany({
    select: { schemeName: true },
    distinct: ["schemeName"],
  });

  return fundTypes;
};
