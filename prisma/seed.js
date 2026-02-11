// JavaScript version of seed script (alternative to TypeScript)
// Run with: node prisma/seed.js

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Default super admin credentials
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || "superadmin@example.com";
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || "SuperAdmin@123";
  const superAdminName = process.env.SUPER_ADMIN_NAME || "Super Administrator";
  const superAdminMobile = process.env.SUPER_ADMIN_MOBILE || "9999999999";

  // Check if super admin already exists
  const existingSuperAdmin = await prisma.user.findUnique({
    where: { email: superAdminEmail },
  });

  if (existingSuperAdmin) {
    console.log("✅ Super admin account already exists:", superAdminEmail);
    
    // Update to ensure it's a superadmin if it's not
    if (existingSuperAdmin.role !== "superadmin") {
      await prisma.user.update({
        where: { id: existingSuperAdmin.id },
        data: { role: "superadmin" },
      });
      console.log("✅ Updated existing user to superadmin role");
    }
    return;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(superAdminPassword, 10);

  // Create super admin user
  const superAdmin = await prisma.user.create({
    data: {
      name: superAdminName,
      email: superAdminEmail,
      mobileNumber: superAdminMobile,
      password: hashedPassword,
      role: "superadmin",
      emailVerified: new Date(), // Auto-verify super admin email
      userStatus: "active",
    },
  });

  console.log("✅ Super admin account created successfully!");
  console.log("📧 Email:", superAdminEmail);
  console.log("🔑 Password:", superAdminPassword);
  console.log("⚠️  Please change the default password after first login!");
  console.log("\n📝 Default Credentials:");
  console.log("   Email:", superAdminEmail);
  console.log("   Password:", superAdminPassword);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

