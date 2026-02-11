import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import { currentRole } from "@/lib/auth";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const user = await currentRole().then((data) => {
    return data;
  });

  const admindashboard = nextUrl.pathname.startsWith("/admindashboard");
  const staffdashboard = nextUrl.pathname.startsWith("/employeedashboard");
  const publicdashboard = nextUrl.pathname.startsWith("/dashboard");
  const superadmindashboard = nextUrl.pathname.startsWith(
    "/superadmindashboard"
  );

  if (admindashboard && user !== "admin") {
    return Response.redirect(new URL("/", nextUrl));
  }
  if (staffdashboard && user !== "staff") {
    return Response.redirect(new URL("/", nextUrl));
  }

  if (publicdashboard && user !== "user") {
    return Response.redirect(new URL("/", nextUrl));
  }
  if (superadmindashboard && user !== "superadmin") {
    return Response.redirect(new URL("/", nextUrl));
  }

  if (!isLoggedIn) {
    return Response.redirect(new URL("/", nextUrl));
  }
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
