
import { IconType } from "react-icons/lib";
import {
  MdDashboard, MdAssessment, MdBusinessCenter, MdPeople, MdMoney,
  MdAssignment, MdSettingsCell, MdDescription, MdDateRange, MdAnnouncement,
  MdPersonAdd, MdSearch, MdFeedback, MdLocalLibrary, MdPayment,
  MdNotifications, MdCalendarToday, MdCloudUpload, MdApi, MdLock,
  MdSettingsApplications, MdSchool, MdAssignmentTurnedIn, MdHolidayVillage,
  MdWork, MdListAlt, MdAnalytics, MdReceipt, MdImportantDevices, MdBlock
} from "react-icons/md";
import { FaChevronCircleRight, FaChartBar, FaChevronDown, FaTruck, FaKey } from "react-icons/fa";
import { UserRole } from "@prisma/client";

// Type Definition with allowedRoles matching Prisma UserRole enum
export type MenuItemProps = {
  menuItemText: string;
  menuItemLink?: string;
  Icon?: IconType;
  color?: string;
  submenu: boolean;
  subMenuItems: MenuItemProps[];
  allowedRoles: UserRole[];
};

// Color Constants
const COLORS = {
  blue: "text-blue-500",
  green: "text-green-500",
  yellow: "text-yellow-500",
  red: "text-red-500",
  purple: "text-purple-500",
  pink: "text-pink-500",
  indigo: "text-indigo-500",
  teal: "text-teal-500",
  orange: "text-orange-500",
  cyan: "text-cyan-600",
  gray: "text-gray-500",
  lime: "text-lime-500",
};

// Base URL Constants
const BASE_URLS = {
  user: "/dashboard",
  admin: "/admindashboard",
  staff: "/staffdashboard",
  superadmin: "/superadmindashboard",
};

// Enhanced helper to create menu items with allowedRoles
const createMenuItem = (
  text: string,
  roles: UserRole[],
  link?: string,
  Icon?: IconType,
  color: string = COLORS.blue,
  subItems: MenuItemProps[] = []
): MenuItemProps => ({
  menuItemText: text,
  menuItemLink: link,
  Icon,
  color,
  submenu: subItems.length > 0,
  subMenuItems: subItems,
  allowedRoles: roles,
});

// User Menu
export const publicUserMenuItems: MenuItemProps[] = [
  createMenuItem("Dashboard", [UserRole.user], `${BASE_URLS.user}/home`, MdDashboard, COLORS.blue),
  
  createMenuItem("Certificate Services", [], undefined, MdDescription, COLORS.green, [
    createMenuItem("Application Process", [UserRole.user], undefined, FaChevronCircleRight, COLORS.yellow, [
      createMenuItem("Apply for Certificate", [UserRole.user], `${BASE_URLS.user}/warish/apply`, FaChevronCircleRight, COLORS.yellow),
      createMenuItem("Check Status", [UserRole.user], `${BASE_URLS.user}/warish/status`, FaChevronCircleRight, COLORS.blue),
    ]),
    createMenuItem("Documentation", [], undefined, FaChevronCircleRight, COLORS.teal, [
      createMenuItem("Required Documents", [UserRole.user], `${BASE_URLS.user}/warish/docs`, FaChevronCircleRight, COLORS.teal),
      createMenuItem("Upload Documents", [UserRole.user], `${BASE_URLS.user}/warish/upload`, FaChevronCircleRight, COLORS.cyan),
    ]),
  ]),

  createMenuItem("Profile Management", [UserRole.user], undefined, MdPersonAdd, COLORS.purple, [
    createMenuItem("Personal Information", [UserRole.user], undefined, FaChevronCircleRight, COLORS.indigo, [
      createMenuItem("View Profile", [UserRole.user], `${BASE_URLS.user}/profile/view`, FaChevronCircleRight, COLORS.indigo),
      createMenuItem("Edit Profile", [UserRole.user], `${BASE_URLS.user}/profile/edit`, FaChevronCircleRight, COLORS.pink),
    ]),
    createMenuItem("Security", [], undefined, FaChevronCircleRight, COLORS.red, [
      createMenuItem("Change Password", [UserRole.user], `${BASE_URLS.user}/profile/change-password`, FaChevronCircleRight, COLORS.red),
      createMenuItem("Two-Factor Auth", [UserRole.user], `${BASE_URLS.user}/profile/2fa`, FaChevronCircleRight, COLORS.orange),
    ]),
  ]),

  createMenuItem("Financial Services", [], undefined, MdPayment, COLORS.lime, [
    createMenuItem("Payments", [UserRole.user], undefined, FaChevronCircleRight, COLORS.lime, [
      createMenuItem("Payment History", [], `${BASE_URLS.user}/payments/history`, FaChevronCircleRight, COLORS.lime),
      createMenuItem("Payment Methods", [UserRole.user], `${BASE_URLS.user}/payments/methods`, FaChevronCircleRight, COLORS.blue),
    ]),
    createMenuItem("Receipts", [], `${BASE_URLS.user}/payments/receipts`, FaChevronCircleRight, COLORS.green),
  ]),

  createMenuItem("Support Center", [], undefined, MdFeedback, COLORS.orange, [
    createMenuItem("Help Desk", [UserRole.user], undefined, FaChevronCircleRight, COLORS.orange, [
      createMenuItem("Submit Feedback", [UserRole.user], `${BASE_URLS.user}/feedback`, FaChevronCircleRight, COLORS.orange),
      createMenuItem("File Complaint", [UserRole.user], `${BASE_URLS.user}/record-complaint`, FaChevronCircleRight, COLORS.red),
    ]),
    createMenuItem("Knowledge Base", [], undefined, FaChevronCircleRight, COLORS.teal, [
      createMenuItem("FAQs", [UserRole.user], `${BASE_URLS.user}/resources/faqs`, FaChevronCircleRight, COLORS.cyan),
      createMenuItem("User Guides", [UserRole.user], `${BASE_URLS.user}/resources/user-guide`, FaChevronCircleRight, COLORS.blue),
    ]),
  ]),

  createMenuItem("Resources", [], undefined, MdLocalLibrary, COLORS.teal, [
    createMenuItem("Documents", [UserRole.user], `${BASE_URLS.user}/resources/documents`, FaChevronCircleRight, COLORS.teal),
    createMenuItem("Announcements", [UserRole.user], `${BASE_URLS.user}/announcements`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Calendar", [UserRole.user], `${BASE_URLS.user}/calendar`, FaChevronCircleRight, COLORS.red),
  ]),

  createMenuItem("Notifications", [], `${BASE_URLS.user}/notifications`, MdNotifications, COLORS.pink),
];

// Admin Menu
export const adminMenuItems: MenuItemProps[] = [
  createMenuItem("Admin Dashboard", [UserRole.admin, UserRole.superadmin], `${BASE_URLS.admin}/home`, MdDashboard, COLORS.blue),
  
  createMenuItem("Operations Management", [UserRole.admin], undefined, MdWork, COLORS.red, [
    createMenuItem("Action Plans", [UserRole.admin], `${BASE_URLS.admin}/work-manage/view`, FaChevronCircleRight, COLORS.blue),
    createMenuItem("Work Status Tracking", [UserRole.admin], `${BASE_URLS.admin}/manage-tender/work-status-change`, FaChevronCircleRight, COLORS.indigo),
    createMenuItem("Fund Status", [UserRole.admin], `${BASE_URLS.admin}/fundstatus`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Work Details", [UserRole.admin], `${BASE_URLS.admin}/work-manage/scheme-wise`, FaChevronCircleRight, COLORS.red),
  ]),

  createMenuItem("Approved Action Plan", [UserRole.admin], `${BASE_URLS.admin}/approvedactionplan`, MdListAlt, COLORS.green),

  createMenuItem("Certificate Management", [], undefined, MdDescription, COLORS.red, [
    createMenuItem("Application Lifecycle", [UserRole.admin], undefined, FaChevronCircleRight, COLORS.yellow, [
      createMenuItem("Submission", [UserRole.admin], undefined, FaChevronDown, COLORS.teal, [
        createMenuItem("New Application", [UserRole.admin], `${BASE_URLS.admin}/manage-warish/application`, FaChevronCircleRight, COLORS.teal),
        createMenuItem("Bulk Applications", [UserRole.admin], `${BASE_URLS.admin}/manage-warish/bulk-upload`, FaChevronCircleRight, COLORS.blue),
      ]),
      createMenuItem("Processing", [UserRole.admin], undefined, FaChevronDown, COLORS.green, [
        createMenuItem("Document Upload", [UserRole.admin], `${BASE_URLS.admin}/manage-warish/pending-uploaddoc`, FaChevronCircleRight, COLORS.teal),
        createMenuItem("Verification", [UserRole.admin], `${BASE_URLS.admin}/manage-warish/verify-document`, FaChevronCircleRight, COLORS.teal),
      ]),
    ]),
    createMenuItem("Workflow Management", [UserRole.admin], undefined, FaChevronCircleRight, COLORS.purple, [
      createMenuItem("Assignment", [UserRole.admin], undefined, FaChevronDown, COLORS.blue, [
        createMenuItem("Assign to Staff", [UserRole.admin], `${BASE_URLS.admin}/manage-warish/assign-staff`, FaChevronCircleRight, COLORS.blue),
        createMenuItem("Public Assignments", [UserRole.admin], `${BASE_URLS.admin}/manage-warish/assign-citizen`, FaChevronCircleRight, COLORS.blue),
      ]),
      createMenuItem("Approval Process", [UserRole.admin], `${BASE_URLS.admin}/manage-warish/approve`, FaChevronCircleRight, COLORS.blue),
    ]),
    createMenuItem("Output Generation", [UserRole.admin], undefined, FaChevronCircleRight, COLORS.green, [
      createMenuItem("Certificate Printing", [UserRole.admin], `${BASE_URLS.admin}/manage-warish/print`, FaChevronCircleRight, COLORS.green),
      createMenuItem("Renewal Processing", [UserRole.admin], `${BASE_URLS.admin}/manage-warish/renew`, FaChevronCircleRight, COLORS.blue),
    ]),
    createMenuItem("Monitoring", [UserRole.admin], undefined, FaChevronCircleRight, COLORS.cyan, [
      createMenuItem("Status Tracking", [UserRole.admin], `${BASE_URLS.admin}/manage-warish/status`, FaChevronCircleRight, COLORS.purple),
      createMenuItem("Performance Metrics", [UserRole.admin], `${BASE_URLS.admin}/manage-warish/metrics`, FaChevronCircleRight, COLORS.orange),
    ]),
  ]),

  createMenuItem("Vendor Management", [UserRole.admin], undefined, MdPeople, COLORS.red, [
    createMenuItem("Register New Vendor", [UserRole.admin], `${BASE_URLS.admin}/manage-vendor/add`, FaChevronCircleRight, COLORS.indigo),
    createMenuItem("Update Vendor Details", [UserRole.admin], `${BASE_URLS.admin}/manage-vendor/edit`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Vendor Directory", [UserRole.admin], `${BASE_URLS.admin}/manage-vendor/view`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Upload Bulk Vendor", [UserRole.admin], `${BASE_URLS.admin}/manage-vendor/bulk-upload`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Vendor Analytics", [UserRole.admin], undefined, FaChartBar, COLORS.teal, [
      createMenuItem("Bid Participation Summary", [UserRole.admin], `${BASE_URLS.admin}/reports/vendor-participation`, FaChevronCircleRight, COLORS.blue),
      createMenuItem("Earnest Money Status", [UserRole.admin], `${BASE_URLS.admin}/reports/earnest-money`, FaChevronCircleRight, COLORS.green),
      createMenuItem("Technical Compliance", [UserRole.admin], `${BASE_URLS.admin}/reports/technical-compliance`, FaChevronCircleRight, COLORS.purple),
    ]),
  ]),

  createMenuItem("Procurement", [UserRole.admin], undefined, MdBusinessCenter, COLORS.purple, [
    createMenuItem("Tender Management", [UserRole.admin], undefined, FaChevronCircleRight, COLORS.green, [
      createMenuItem("Creation", [UserRole.admin], undefined, FaChevronDown, COLORS.teal, [
        createMenuItem("New Tender", [UserRole.admin], `${BASE_URLS.admin}/manage-tender/add`, FaChevronCircleRight, COLORS.green),
        createMenuItem("Templates", [UserRole.admin], `${BASE_URLS.admin}/manage-tender/templates`, FaChevronCircleRight, COLORS.blue),
      ]),
      createMenuItem("Active Tenders", [UserRole.admin], `${BASE_URLS.admin}/manage-tender/open`, FaChevronCircleRight, COLORS.green),
    ]),
    createMenuItem("Bid Processing", [UserRole.admin], undefined, FaChevronCircleRight, COLORS.yellow, [
      createMenuItem("Evaluation", [UserRole.admin], undefined, FaChevronDown, COLORS.orange, [
        createMenuItem("Technical Evaluation", [UserRole.admin], `${BASE_URLS.admin}/manage-tender/addtechnicaldetails`, FaChevronCircleRight, COLORS.teal),
        createMenuItem("Financial Evaluation", [UserRole.admin], `${BASE_URLS.admin}/manage-tender/addfinanicaldetails`, FaChevronCircleRight, COLORS.red),
      ]),
      createMenuItem("Bidder Management", [UserRole.admin], `${BASE_URLS.admin}/manage-tender/addbidderdetails`, FaChevronCircleRight, COLORS.yellow),
    ]),
    createMenuItem("Contract Management", [UserRole.admin], undefined, FaChevronCircleRight, COLORS.indigo, [
      createMenuItem("Award Process", [UserRole.admin], undefined, FaChevronDown, COLORS.red, [
        createMenuItem("Work Orders", [UserRole.admin], `${BASE_URLS.admin}/manage-tender/workorderdetails`, FaChevronCircleRight, COLORS.red),
        createMenuItem("Contract Awards", [UserRole.admin], `${BASE_URLS.admin}/manage-tender/awardofcontract`, FaChevronCircleRight, COLORS.indigo),
      ]),
      createMenuItem("Modifications", [UserRole.admin], undefined, FaChevronDown, COLORS.pink, [
        createMenuItem("Tender Edits", [UserRole.admin], `${BASE_URLS.admin}/manage-tender/edit`, FaChevronCircleRight, COLORS.orange),
        createMenuItem("Cancellations", [UserRole.admin], `${BASE_URLS.admin}/manage-tender/cancel-tender`, FaChevronCircleRight, COLORS.red),
      ]),
    ]),
  ]),

  createMenuItem("Financial Management", [], undefined, MdMoney, COLORS.indigo, [
    createMenuItem("Budget Management", [UserRole.admin], undefined, FaChevronCircleRight, COLORS.indigo, [
      createMenuItem("Budget Allocation", [UserRole.admin], `${BASE_URLS.admin}/budget/allocation`, FaChevronCircleRight, COLORS.indigo),
      createMenuItem("Expense Tracking", [UserRole.admin], `${BASE_URLS.admin}/budget/expenses`, FaChevronCircleRight, COLORS.red),
      createMenuItem("Financial Reports", [UserRole.admin], `${BASE_URLS.admin}/budget/reports`, FaChevronCircleRight, COLORS.green),
    ]),
    createMenuItem("Payment Processing", [UserRole.admin], undefined, FaChevronCircleRight, COLORS.green, [
      createMenuItem("Payment Approval", [UserRole.admin], `${BASE_URLS.admin}/payments/approve`, FaChevronCircleRight, COLORS.green),
      createMenuItem("Payment History", [UserRole.admin], `${BASE_URLS.admin}/payments/history`, FaChevronCircleRight, COLORS.blue),
    ]),
  ]),

  createMenuItem("Content Management", [], undefined, MdDescription, COLORS.cyan, [
    createMenuItem("Blog Management", [UserRole.admin], undefined, FaChevronCircleRight, COLORS.cyan, [
      createMenuItem("Create Post", [UserRole.admin], `${BASE_URLS.admin}/manage-blog/create`, FaChevronCircleRight, COLORS.cyan),
      createMenuItem("Edit Posts", [UserRole.admin], `${BASE_URLS.admin}/manage-blog/edit`, FaChevronCircleRight, COLORS.blue),
      createMenuItem("Manage Comments", [UserRole.admin], `${BASE_URLS.admin}/manage-blog/comments`, FaChevronCircleRight, COLORS.green),
    ]),
    createMenuItem("Email Management", [UserRole.admin], undefined, FaChevronCircleRight, COLORS.orange, [
      createMenuItem("Email Templates", [UserRole.admin], `${BASE_URLS.admin}/manage-email/templates`, FaChevronCircleRight, COLORS.orange),
      createMenuItem("Email Campaigns", [UserRole.admin], `${BASE_URLS.admin}/manage-email/campaigns`, FaChevronCircleRight, COLORS.pink),
    ]),
  ]),

  createMenuItem("Village Management", [], undefined, MdHolidayVillage, COLORS.teal, [
    createMenuItem("Village Information", [UserRole.admin], undefined, FaChevronCircleRight, COLORS.teal, [
      createMenuItem("Add Village", [UserRole.admin], `${BASE_URLS.admin}/manage-villages/add`, FaChevronCircleRight, COLORS.teal),
      createMenuItem("Edit Village", [UserRole.admin], `${BASE_URLS.admin}/manage-villages/edit`, FaChevronCircleRight, COLORS.blue),
      createMenuItem("Village Directory", [UserRole.admin], `${BASE_URLS.admin}/manage-villages/view`, FaChevronCircleRight, COLORS.green),
    ]),
    createMenuItem("Population Data", [UserRole.admin], undefined, FaChevronCircleRight, COLORS.purple, [
      createMenuItem("Demographics", [UserRole.admin], `${BASE_URLS.admin}/populationinfo/demographics`, FaChevronCircleRight, COLORS.purple),
      createMenuItem("Geography Data", [UserRole.admin], `${BASE_URLS.admin}/populationinfo/geography`, FaChevronCircleRight, COLORS.indigo),
    ]),
  ]),

  createMenuItem("System Administration", [], undefined, MdSettingsApplications, COLORS.gray, [
    createMenuItem("User Management", [UserRole.admin], undefined, FaChevronCircleRight, COLORS.gray, [
      createMenuItem("Staff Management", [UserRole.admin], `${BASE_URLS.admin}/staff`, FaChevronCircleRight, COLORS.gray),
      createMenuItem("Role Assignment", [UserRole.admin], `${BASE_URLS.admin}/staff/roles`, FaChevronCircleRight, COLORS.blue),
    ]),
    createMenuItem("System Settings", [UserRole.admin], undefined, FaChevronCircleRight, COLORS.orange, [
      createMenuItem("General Settings", [UserRole.admin], `${BASE_URLS.admin}/settings`, FaChevronCircleRight, COLORS.orange),
      createMenuItem("Security Settings", [UserRole.admin], `${BASE_URLS.admin}/settings/security`, FaChevronCircleRight, COLORS.red),
    ]),
  ]),

  createMenuItem("Reports & Analytics", [], undefined, MdAnalytics, COLORS.purple, [
    createMenuItem("Performance Reports", [UserRole.admin], undefined, FaChevronCircleRight, COLORS.purple, [
      createMenuItem("Work Progress", [UserRole.admin], `${BASE_URLS.admin}/reports/work-progress`, FaChevronCircleRight, COLORS.purple),
      createMenuItem("Financial Reports", [UserRole.admin], `${BASE_URLS.admin}/reports/financial`, FaChevronCircleRight, COLORS.green),
    ]),
    createMenuItem("Analytics Dashboard", [UserRole.admin], `${BASE_URLS.admin}/reports/analytics`, FaChevronCircleRight, COLORS.blue),
  ]),
];

// Employee Menu
export const employeeMenuItems: MenuItemProps[] = [
  createMenuItem("Employee Dashboard", [UserRole.staff], `${BASE_URLS.staff}/home`, MdDashboard, COLORS.blue),
  
  createMenuItem("Work Management", [UserRole.staff], undefined, MdWork, COLORS.green, [
    createMenuItem("Assigned Tasks", [UserRole.staff], `${BASE_URLS.staff}/tasks`, FaChevronCircleRight, COLORS.green),
    createMenuItem("Work Progress", [UserRole.staff], `${BASE_URLS.staff}/progress`, FaChevronCircleRight, COLORS.blue),
    createMenuItem("Submit Reports", [UserRole.staff], `${BASE_URLS.staff}/reports`, FaChevronCircleRight, COLORS.orange),
  ]),

  createMenuItem("Certificate Processing", [UserRole.staff], undefined, MdDescription, COLORS.purple, [
    createMenuItem("Pending Applications", [UserRole.staff], `${BASE_URLS.staff}/applications/pending`, FaChevronCircleRight, COLORS.purple),
    createMenuItem("Process Applications", [UserRole.staff], `${BASE_URLS.staff}/applications/process`, FaChevronCircleRight, COLORS.blue),
    createMenuItem("Document Verification", [UserRole.staff], `${BASE_URLS.staff}/documents/verify`, FaChevronCircleRight, COLORS.green),
  ]),

  createMenuItem("Leave Management", [UserRole.staff], undefined, MdCalendarToday, COLORS.orange, [
    createMenuItem("Apply Leave", [UserRole.staff], `${BASE_URLS.staff}/leave/apply`, FaChevronCircleRight, COLORS.orange),
    createMenuItem("Leave History", [UserRole.staff], `${BASE_URLS.staff}/leave/history`, FaChevronCircleRight, COLORS.blue),
    createMenuItem("Leave Balance", [UserRole.staff], `${BASE_URLS.staff}/leave/balance`, FaChevronCircleRight, COLORS.green),
  ]),

  createMenuItem("Profile", [UserRole.staff], undefined, MdPersonAdd, COLORS.indigo, [
    createMenuItem("View Profile", [UserRole.staff], `${BASE_URLS.staff}/profile`, FaChevronCircleRight, COLORS.indigo),
    createMenuItem("Update Profile", [UserRole.staff], `${BASE_URLS.staff}/profile/edit`, FaChevronCircleRight, COLORS.blue),
  ]),

  createMenuItem("Notifications", [UserRole.staff], `${BASE_URLS.staff}/notifications`, MdNotifications, COLORS.pink),
];

// Super Admin Menu
export const superAdminMenuItems: MenuItemProps[] = [
  createMenuItem("Super Admin Dashboard", [UserRole.superadmin], `${BASE_URLS.superadmin}/home`, MdDashboard, COLORS.blue),
  
  createMenuItem("System Administration", [UserRole.superadmin], undefined, MdSettingsApplications, COLORS.red, [
    createMenuItem("User Management", [UserRole.superadmin], undefined, FaChevronCircleRight, COLORS.red, [
      createMenuItem("Admin Management", [UserRole.superadmin], `${BASE_URLS.superadmin}/admins`, FaChevronCircleRight, COLORS.red),
      createMenuItem("Role Management", [UserRole.superadmin], `${BASE_URLS.superadmin}/roles`, FaChevronCircleRight, COLORS.blue),
    ]),
    createMenuItem("System Configuration", [UserRole.superadmin], undefined, FaChevronCircleRight, COLORS.orange, [
      createMenuItem("Global Settings", [UserRole.superadmin], `${BASE_URLS.superadmin}/settings`, FaChevronCircleRight, COLORS.orange),
      createMenuItem("Security Policies", [UserRole.superadmin], `${BASE_URLS.superadmin}/security`, FaChevronCircleRight, COLORS.red),
    ]),
  ]),

  createMenuItem("Monitoring & Analytics", [UserRole.superadmin], undefined, MdAnalytics, COLORS.purple, [
    createMenuItem("System Health", [UserRole.superadmin], `${BASE_URLS.superadmin}/monitoring/health`, FaChevronCircleRight, COLORS.purple),
    createMenuItem("Performance Metrics", [UserRole.superadmin], `${BASE_URLS.superadmin}/monitoring/performance`, FaChevronCircleRight, COLORS.blue),
    createMenuItem("Audit Logs", [UserRole.superadmin], `${BASE_URLS.superadmin}/monitoring/audit`, FaChevronCircleRight, COLORS.green),
  ]),

  createMenuItem("Integration Management", [UserRole.superadmin], undefined, MdApi, COLORS.teal, [
    createMenuItem("API Management", [UserRole.superadmin], `${BASE_URLS.superadmin}/integrations/api`, FaChevronCircleRight, COLORS.teal),
    createMenuItem("Third-party Services", [UserRole.superadmin], `${BASE_URLS.superadmin}/integrations/services`, FaChevronCircleRight, COLORS.blue),
  ]),

  createMenuItem("Reports", [UserRole.superadmin], undefined, MdAssessment, COLORS.indigo, [
    createMenuItem("System Reports", [UserRole.superadmin], `${BASE_URLS.superadmin}/reports/system`, FaChevronCircleRight, COLORS.indigo),
    createMenuItem("User Activity", [UserRole.superadmin], `${BASE_URLS.superadmin}/reports/activity`, FaChevronCircleRight, COLORS.blue),
  ]),
];

// Utility function to check if menu item is restricted for a role
export const isRestrictedForRole = (
  item: MenuItemProps,
  currentRole: UserRole
): boolean => {
  return !item.allowedRoles.includes(currentRole);
};

// Utility function to get all menu items (for seeding)
export const getAllMenuItems = (): MenuItemProps[] => {
  const flattenMenu = (items: MenuItemProps[]): MenuItemProps[] => {
    return items.reduce((acc, item) => {
      acc.push(item);
      if (item.subMenuItems.length > 0) {
        acc.push(...flattenMenu(item.subMenuItems));
      }
      return acc;
    }, [] as MenuItemProps[]);
  };

  return [
    ...flattenMenu(publicUserMenuItems),
    ...flattenMenu(adminMenuItems),
    ...flattenMenu(employeeMenuItems),
    ...flattenMenu(superAdminMenuItems),
  ];
};

