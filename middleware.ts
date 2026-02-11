import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import authConfig from "@/auth.config";
import { currentRole } from "@/lib/auth";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Protect all dashboard routes - only allow authenticated users
  if (
    nextUrl.pathname.startsWith("/dashboard") ||
    nextUrl.pathname.startsWith("/admindashboard") ||
    nextUrl.pathname.startsWith("/employeedashboard") ||
    nextUrl.pathname.startsWith("/superadmindashboard")
  ) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  // Redirect old role-specific dashboard ROOT URLs to the unified /dashboard
  if (
    nextUrl.pathname === "/admindashboard" ||
    nextUrl.pathname === "/admindashboard/"
  ) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }
  if (
    nextUrl.pathname === "/employeedashboard" ||
    nextUrl.pathname === "/employeedashboard/"
  ) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }
  if (
    nextUrl.pathname === "/superadmindashboard" ||
    nextUrl.pathname === "/superadmindashboard/"
  ) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Role-aware rewrite: keep URL under /dashboard but serve pages from
  // the existing role-specific folders so you don't have to move files.
  if (nextUrl.pathname.startsWith("/dashboard")) {
    const role = await currentRole();

    // Map roles to their underlying dashboard prefix
    const roleBase: Record<string, string> = {
      user: "/dashboard",
      admin: "/admindashboard",
      staff: "/employeedashboard",
      superadmin: "/superadmindashboard",
    };

    const base = role ? roleBase[role] : "/dashboard";

    // If the user is an admin/staff/superadmin, rewrite /dashboard/* to
    // their existing dashboard tree while keeping the URL as /dashboard/*
    if (base !== "/dashboard") {
      const suffix = nextUrl.pathname.slice("/dashboard".length) || "";
      const destination = new URL(`${base}${suffix}`, nextUrl);
      return NextResponse.rewrite(destination);
    }
  }

  // Default: continue the request
  return NextResponse.next();
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admindashboard/:path*",
    "/employeedashboard/:path*",
    "/superadmindashboard/:path*",
  ],
};
