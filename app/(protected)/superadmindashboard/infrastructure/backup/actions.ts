'use server'

import { db } from "@/lib/db"



export async function getBackupData() {
  try {
    // Fetch all data
    const backup = {
      timestamp: new Date().toISOString(),
      data: {
        users: await db.user.findMany(),
        visitors: await db.visitor.findMany(),
        leaves: await db.leave.findMany(),
        warishApplications: await db.warishApplication.findMany(),
        bookings: await db.booking.findMany(),
        notifications: await db.notification.findMany(),
        messages: await db.message.findMany(),
        familyLineageCertificates: await db.familyLineageCertificate.findMany(),
      }
    }
    return { success: true, data: backup }
  } catch (error) {
    console.error('Backup failed:', error)
    return { success: false, error: 'Failed to create backup' }
  }
}