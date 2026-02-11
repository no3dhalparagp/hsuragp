# Super Admin Account Setup

This guide explains how to create the default super admin account for the Gram Panchayat Management System.

## Method 1: Using Prisma Seed Script (Recommended)

### Step 1: Set Environment Variables (Optional)

You can customize the super admin credentials by setting environment variables in your `.env` file:

```env
SUPER_ADMIN_EMAIL=superadmin@example.com
SUPER_ADMIN_PASSWORD=SuperAdmin@123
SUPER_ADMIN_NAME=Super Administrator
SUPER_ADMIN_MOBILE=9999999999
```

If not set, the following defaults will be used:
- **Email**: `superadmin@example.com`
- **Password**: `SuperAdmin@123`
- **Name**: `Super Administrator`
- **Mobile**: `9999999999`

### Step 2: Run the Seed Script

```bash
# Using pnpm (recommended)
pnpm db:seed

# Or using npm
npm run db:seed

# Or directly with ts-node
npx ts-node prisma/seed.ts
```

### Step 3: Verify Account Creation

The script will output:
- ✅ Success message if account is created
- ✅ Update message if account already exists
- ⚠️ Warning to change the default password

## Method 2: Using API Endpoint

### Create Super Admin via API

**Note**: This endpoint only works if no super admin exists in the system.

```bash
curl -X POST http://localhost:3000/api/setup/create-super-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@example.com",
    "password": "SuperAdmin@123",
    "name": "Super Administrator",
    "mobileNumber": "9999999999"
  }'
```

Or using JavaScript:

```javascript
fetch('/api/setup/create-super-admin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'superadmin@example.com',
    password: 'SuperAdmin@123',
    name: 'Super Administrator',
    mobileNumber: '9999999999'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

## Method 3: Using Server Action (Programmatic)

You can also use the server action directly in your code:

```typescript
import { createSuperAdmin } from "@/action/create-super-admin";

const result = await createSuperAdmin(
  "superadmin@example.com",
  "SuperAdmin@123",
  "Super Administrator",
  "9999999999"
);

if (result.success) {
  console.log("Super admin created:", result.data);
} else {
  console.error("Error:", result.error);
}
```

## Security Notes

⚠️ **IMPORTANT**: 
1. **Change the default password immediately** after first login
2. The default credentials are for initial setup only
3. Never commit actual credentials to version control
4. Use strong passwords in production environments

## Default Credentials

```
Email: superadmin@example.com
Password: SuperAdmin@123
```

## Troubleshooting

### Error: "Super admin account already exists"

If you see this error, it means a super admin account already exists. You can:
1. Use the existing account to log in
2. Or update an existing user to superadmin role through the database

### Error: "Validation failed"

Make sure:
- Email is a valid email address
- Password is at least 8 characters long
- All required fields are provided

### Error: "Failed to create super admin account"

Check:
- Database connection is working
- Prisma client is generated (`npx prisma generate`)
- Database has proper permissions

## After Setup

Once the super admin account is created:

1. **Log in** with the super admin credentials
2. **Change the password** immediately
3. **Create GP accounts** using the GP Management menu
4. **Manage users** and system settings

## Updating Existing User to Super Admin

If you need to update an existing user to super admin role:

```typescript
// Using Prisma directly
import { db } from "@/lib/db";

await db.user.update({
  where: { email: "user@example.com" },
  data: { role: "superadmin" }
});
```

## Production Deployment

For production environments:

1. Set strong environment variables
2. Run the seed script during deployment
3. Immediately change default credentials
4. Enable two-factor authentication
5. Review and restrict super admin access

