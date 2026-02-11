# GP Account Management - SaaS Feature Setup

## Overview
This feature enables super admins to create and manage Gram Panchayat (GP) accounts in a multi-tenant SaaS system.

## Prerequisites

Before using GP Management features, ensure you have a super admin account. See [SUPER_ADMIN_SETUP.md](./SUPER_ADMIN_SETUP.md) for instructions on creating the default super admin account.

## Features Implemented

### 1. Database Schema (`prisma/schema.prisma`)
- **GPStatus Enum**: PENDING, APPROVED, REJECTED, ACTIVE, SUSPENDED
- **GPProfile Model Updates**:
  - Added `status` field (default: PENDING)
  - Added `createdBy` and `approvedBy` user relations
  - Added `approvedAt` and `rejectionReason` fields
  - Added `gpmail`, `gptannumber`, `contactNumber` fields
  - Made `gpcode` unique
  - Added index on `status` field

### 2. Server Actions (`action/gp-management.ts`)
- `createGPAccount()` - Create new GP accounts (super admin only)
- `approveGPAccount()` - Approve/reject/suspend GP accounts
- `getAllGPAccounts()` - List all GP accounts with user relations
- `getGPAccountById()` - Get detailed GP account information
- `updateGPAccount()` - Update GP account details
- `deleteGPAccount()` - Delete GP accounts

### 3. UI Pages

#### Main Management Page (`/dashboard/gp-management`)
- Displays all GP accounts in a table
- Shows status badges (PENDING, APPROVED, etc.)
- Actions: Approve, Reject, Suspend, View, Delete
- Real-time status updates

#### Create Page (`/dashboard/gp-management/create`)
- Form to create new GP accounts
- Validates all required fields
- Handles errors gracefully

#### Details Page (`/dashboard/gp-management/[id]`)
- View complete GP account information
- Shows approval history
- Displays created by and approved by user details

### 4. Menu Integration
- Added "GP Management" section to super admin menu
- Sub-menu items:
  - All GP Accounts
  - Create GP Account

## Setup Instructions

### Step 1: Run Database Migration
```bash
npx prisma migrate dev --name add_gp_management_fields
```

### Step 2: Generate Prisma Client
```bash
npx prisma generate
```

### Step 3: Access the Feature
1. Log in as a super admin user
2. Navigate to "GP Management" in the sidebar menu
3. Click "All GP Accounts" to view existing accounts
4. Click "Create GP Account" to add new GP accounts

## Usage

### Creating a GP Account
1. Go to GP Management → Create GP Account
2. Fill in all required fields:
   - GP Name
   - GP Code (must be unique)
   - Name in Prodhan
   - Block Name
   - GP Short Name
   - Address
3. Optional fields: Email, Contact Number, TAN Number
4. Click "Create GP Account"
5. Account will be created with PENDING status

### Approving a GP Account
1. Go to GP Management → All GP Accounts
2. Find the account with PENDING status
3. Click "Approve" button
4. Account status changes to APPROVED

### Rejecting a GP Account
1. Go to GP Management → All GP Accounts
2. Find the account with PENDING status
3. Click "Reject" button
4. Enter rejection reason
5. Account status changes to REJECTED

### Suspending a GP Account
1. Go to GP Management → All GP Accounts
2. Find an APPROVED account
3. Click "Suspend" button
4. Account status changes to SUSPENDED

## API Endpoints (Server Actions)

All actions are located in `action/gp-management.ts`:

```typescript
// Create GP Account
const result = await createGPAccount({
  gpname: "NO 4 HARSURA GRAM PANCHAYAT",
  gpcode: "HRGP",
  // ... other fields
});

// Approve GP Account
const result = await approveGPAccount({
  gpId: "gp_id_here",
  status: "APPROVED",
});

// Get All GP Accounts
const result = await getAllGPAccounts();

// Get GP Account by ID
const result = await getGPAccountById("gp_id_here");
```

## Security
- All actions require super admin role
- Authorization checks are performed server-side
- User actions are tracked (createdBy, approvedBy)

## Status Flow
```
PENDING → APPROVED → ACTIVE
PENDING → REJECTED
APPROVED → SUSPENDED
```

## Notes
- GP Code must be unique across all accounts
- All timestamps are automatically tracked
- Approval history is maintained for audit purposes

