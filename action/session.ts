"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function renewSession() {
  const session = await auth();
  if (session) {
    // In a real application, you would update the session in your database here
    // For this example, we'll just return a new expiry time
    const newExpiryTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
    return { success: true, newExpiryTime: newExpiryTime.toISOString() };
  }

  // If there's no active session, redirect to the home page
  redirect("/");
}
