
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
import { Role } from "@prisma/client";

// Type Definition with allowedRoles matching Prisma Role enum
export type MenuItemProps = {
  menuItemText: string;
  menuItemLink?: string;
  Icon?: IconType;
  color?: string;
  submenu: boolean;
  subMenuItems: MenuItemProps[];
  allowedRoles: Role[];
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
  roles: Role[],
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
  createMenuItem("Dashboard", [Role.PUBLIC], `${BASE_URLS.user}/home`, MdDashboard, COLORS.blue),
  
  createMenuItem("Certificate Services", [], undefined, MdDescription, COLORS.green, [
    createMenuItem("Application Process", [Role.PUBLIC], undefined, FaChevronCircleRight, COLORS.yellow, [
      createMenuItem("Apply for Certificate", [Role.PUBLIC], `${BASE_URLS.user}/warish/apply`, FaChevronCircleRight, COLORS.yellow),
      createMenuItem("Check Status", [Role.PUBLIC], `${BASE_URLS.user}/warish/status`, FaChevronCircleRight, COLORS.blue),
    ]),
    createMenuItem("Documentation", [], undefined, FaChevronCircleRight, COLORS.teal, [
      createMenuItem("Required Documents", [Role.PUBLIC], `${BASE_URLS.user}/warish/docs`, FaChevronCircleRight, COLORS.teal),
      createMenuItem("Upload Documents", [Role.PUBLIC], `${BASE_URLS.user}/warish/upload`, FaChevronCircleRight, COLORS.cyan),
    ]),
  ]),

  createMenuItem("Profile Management", [Role.PUBLIC], undefined, MdPersonAdd, COLORS.purple, [
    createMenuItem("Personal Information", [Role.PUBLIC], undefined, FaChevronCircleRight, COLORS.indigo, [
      createMenuItem("View Profile", [Role.PUBLIC], `${BASE_URLS.user}/profile/view`, FaChevronCircleRight, COLORS.indigo),
      createMenuItem("Edit Profile", [Role.PUBLIC], `${BASE_URLS.user}/profile/edit`, FaChevronCircleRight, COLORS.pink),
    ]),
    createMenuItem("Security", [], undefined, FaChevronCircleRight, COLORS.red, [
      createMenuItem("Change Password", [Role.PUBLIC], `${BASE_URLS.user}/profile/change-password`, FaChevronCircleRight, COLORS.red),
      createMenuItem("Two-Factor Auth", [Role.PUBLIC], `${BASE_URLS.user}/profile/2fa`, FaChevronCircleRight, COLORS.orange),
    ]),
  ]),

  createMenuItem("Financial Services", [], undefined, MdPayment, COLORS.lime, [
    createMenuItem("Payments", [Role.PUBLIC], undefined, FaChevronCircleRight, COLORS.lime, [
      createMenuItem("Payment History", [], `${BASE_URLS.user}/payments/history`, FaChevronCircleRight, COLORS.lime),
      createMenuItem("Payment Methods", [Role.PUBLIC], `${BASE_URLS.user}/payments/methods`, FaChevronCircleRight, COLORS.blue),
    ]),
    createMenuItem("Receipts", [], `${BASE_URLS.user}/payments/receipts`, FaChevronCircleRight, COLORS.green),
  ]),

  createMenuItem("Support Center", [], undefined, MdFeedback, COLORS.orange, [
    createMenuItem("Help Desk", [Role.PUBLIC], undefined, FaChevronCircleRight, COLORS.orange, [
      createMenuItem("Submit Feedback", [Role.PUBLIC], `${BASE_URLS.user}/feedback`, FaChevronCircleRight, COLORS.orange),
      createMenuItem("File Complaint", [Role.PUBLIC], `${BASE_URLS.user}/record-complaint`, FaChevronCircleRight, COLORS.red),
    ]),
    createMenuItem("Knowledge Base", [], undefined, FaChevronCircleRight, COLORS.teal, [
      createMenuItem("FAQs", [Role.PUBLIC], `${BASE_URLS.user}/resources/faqs`, FaChevronCircleRight, COLORS.cyan),
      createMenuItem("User Guides", [Role.PUBLIC], `${BASE_URLS.user}/resources/user-guide`, FaChevronCircleRight, COLORS.blue),
    ]),
  ]),

  createMenuItem("Resources", [], undefined, MdLocalLibrary, COLORS.teal, [
    createMenuItem("Documents", [Role.PUBLIC], `${BASE_URLS.user}/resources/documents`, FaChevronCircleRight, COLORS.teal),
    createMenuItem("Announcements", [Role.PUBLIC], `${BASE_URLS.user}/announcements`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Calendar", [Role.PUBLIC], `${BASE_URLS.user}/calendar`, FaChevronCircleRight, COLORS.red),
  ]),

  createMenuItem("Notifications", [], `${BASE_URLS.user}/notifications`, MdNotifications, COLORS.pink),
];

// Admin Menu
export const adminMenuItems: MenuItemProps[] = [
  createMenuItem("Admin Dashboard", [Role.ADMIN, Role.SUPERADMIN], `${BASE_URLS.admin}/home`, MdDashboard, COLORS.blue),
  
  createMenuItem("Operations Management", [Role.ADMIN], undefined, MdWork, COLORS.red, [
    createMenuItem("Action Plans", [Role.ADMIN], `${BASE_URLS.admin}/work-manage/view`, FaChevronCircleRight, COLORS.blue),
    createMenuItem("Work Status Tracking", [Role.ADMIN], `${BASE_URLS.admin}/manage-tender/work-status-change`, FaChevronCircleRight, COLORS.indigo),
    createMenuItem("Fund Status", [Role.ADMIN], `${BASE_URLS.admin}/fundstatus`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Work Details", [Role.ADMIN], `${BASE_URLS.admin}/work-manage/scheme-wise`, FaChevronCircleRight, COLORS.red),
  ]),

  createMenuItem("Approved Action Plan", [Role.ADMIN], `${BASE_URLS.admin}/approvedactionplan`, MdListAlt, COLORS.green),

  createMenuItem("Certificate Management", [], undefined, MdDescription, COLORS.red, [
    createMenuItem("Application Lifecycle", [Role.ADMIN], undefined, FaChevronCircleRight, COLORS.yellow, [
      createMenuItem("Submission", [Role.ADMIN], undefined, FaChevronDown, COLORS.teal, [
        createMenuItem("New Application", [Role.ADMIN], `${BASE_URLS.admin}/manage-warish/application`, FaChevronCircleRight, COLORS.teal),
        createMenuItem("Bulk Applications", [Role.ADMIN], `${BASE_URLS.admin}/manage-warish/bulk-upload`, FaChevronCircleRight, COLORS.blue),
      ]),
      createMenuItem("Processing", [Role.ADMIN], undefined, FaChevronDown, COLORS.green, [
        createMenuItem("Document Upload", [Role.ADMIN], `${BASE_URLS.admin}/manage-warish/pending-uploaddoc`, FaChevronCircleRight, COLORS.teal),
        createMenuItem("Verification", [Role.ADMIN], `${BASE_URLS.admin}/manage-warish/verify-document`, FaChevronCircleRight, COLORS.teal),
      ]),
    ]),
    createMenuItem("Workflow Management", [Role.ADMIN], undefined, FaChevronCircleRight, COLORS.purple, [
      createMenuItem("Assignment", [Role.ADMIN], undefined, FaChevronDown, COLORS.blue, [
        createMenuItem("Assign to Staff", [Role.ADMIN], `${BASE_URLS.admin}/manage-warish/assign-staff`, FaChevronCircleRight, COLORS.blue),
        createMenuItem("Public Assignments", [Role.ADMIN], `${BASE_URLS.admin}/manage-warish/assign-citizen`, FaChevronCircleRight, COLORS.blue),
      ]),
      createMenuItem("Approval Process", [Role.ADMIN], `${BASE_URLS.admin}/manage-warish/approve`, FaChevronCircleRight, COLORS.blue),
    ]),
    createMenuItem("Output Generation", [Role.ADMIN], undefined, FaChevronCircleRight, COLORS.green, [
      createMenuItem("Certificate Printing", [Role.ADMIN], `${BASE_URLS.admin}/manage-warish/print`, FaChevronCircleRight, COLORS.green),
      createMenuItem("Renewal Processing", [Role.ADMIN], `${BASE_URLS.admin}/manage-warish/renew`, FaChevronCircleRight, COLORS.blue),
    ]),
    createMenuItem("Monitoring", [Role.ADMIN], undefined, FaChevronCircleRight, COLORS.cyan, [
      createMenuItem("Status Tracking", [Role.ADMIN], `${BASE_URLS.admin}/manage-warish/status`, FaChevronCircleRight, COLORS.purple),
      createMenuItem("Performance Metrics", [Role.ADMIN], `${BASE_URLS.admin}/manage-warish/metrics`, FaChevronCircleRight, COLORS.orange),
    ]),
  ]),

  createMenuItem("Vendor Management", [Role.ADMIN], undefined, MdPeople, COLORS.red, [
    createMenuItem("Register New Vendor", [Role.ADMIN], `${BASE_URLS.admin}/manage-vendor/add`, FaChevronCircleRight, COLORS.indigo),
    createMenuItem("Update Vendor Details", [Role.ADMIN], `${BASE_URLS.admin}/manage-vendor/edit`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Vendor Directory", [Role.ADMIN], `${BASE_URLS.admin}/manage-vendor/view`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Upload Bulk Vendor", [Role.ADMIN], `${BASE_URLS.admin}/manage-vendor/bulk-upload`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Vendor Analytics", [Role.ADMIN], undefined, FaChartBar, COLORS.teal, [
      createMenuItem("Bid Participation Summary", [Role.ADMIN], `${BASE_URLS.admin}/reports/vendor-participation`, FaChevronCircleRight, COLORS.blue),
      createMenuItem("Earnest Money Status", [Role.ADMIN], `${BASE_URLS.admin}/reports/earnest-money`, FaChevronCircleRight, COLORS.green),
      createMenuItem("Technical Compliance", [Role.ADMIN], `${BASE_URLS.admin}/reports/technical-compliance`, FaChevronCircleRight, COLORS.purple),
    ]),
  ]),

  createMenuItem("Procurement", [Role.ADMIN], undefined, MdBusinessCenter, COLORS.purple, [
    createMenuItem("Tender Management", [Role.ADMIN], undefined, FaChevronCircleRight, COLORS.green, [
      createMenuItem("Creation", [Role.ADMIN], undefined, FaChevronDown, COLORS.teal, [
        createMenuItem("New Tender", [Role.ADMIN], `${BASE_URLS.admin}/manage-tender/add`, FaChevronCircleRight, COLORS.green),
        createMenuItem("Templates", [Role.ADMIN], `${BASE_URLS.admin}/manage-tender/templates`, FaChevronCircleRight, COLORS.blue),
      ]),
      createMenuItem("Active Tenders", [Role.ADMIN], `${BASE_URLS.admin}/manage-tender/open`, FaChevronCircleRight, COLORS.green),
    ]),
    createMenuItem("Bid Processing", [Role.ADMIN], undefined, FaChevronCircleRight, COLORS.yellow, [
      createMenuItem("Evaluation", [Role.ADMIN], undefined, FaChevronDown, COLORS.orange, [
        createMenuItem("Technical Evaluation", [Role.ADMIN], `${BASE_URLS.admin}/manage-tender/addtechnicaldetails`, FaChevronCircleRight, COLORS.teal),
        createMenuItem("Financial Evaluation", [Role.ADMIN], `${BASE_URLS.admin}/manage-tender/addfinanicaldetails`, FaChevronCircleRight, COLORS.red),
      ]),
      createMenuItem("Bidder Management", [Role.ADMIN], `${BASE_URLS.admin}/manage-tender/addbidderdetails`, FaChevronCircleRight, COLORS.yellow),
    ]),
    createMenuItem("Contract Management", [Role.ADMIN], undefined, FaChevronCircleRight, COLORS.indigo, [
      createMenuItem("Award Process", [Role.ADMIN], undefined, FaChevronDown, COLORS.red, [
        createMenuItem("Work Orders", [Role.ADMIN], `${BASE_URLS.admin}/manage-tender/workorderdetails`, FaChevronCircleRight, COLORS.red),
        createMenuItem("Contract Awards", [Role.ADMIN], `${BASE_URLS.admin}/manage-tender/awardofcontract`, FaChevronCircleRight, COLORS.indigo),
      ]),
      createMenuItem("Modifications", [Role.ADMIN], undefined, FaChevronDown, COLORS.pink, [
        createMenuItem("Tender Edits", [Role.ADMIN], `${BASE_URLS.admin}/manage-tender/edit`, FaChevronCircleRight, COLORS.orange),
        createMenuItem("Cancellations", [Role.ADMIN], `${BASE_URLS.admin}/manage-tender/cancel-tender`, FaChevronCircleRight, COLORS.red),
      ]),
    ]),
  ]),

  createMenuItem("Financial Management", [], undefined, MdMoney, COLORS.indigo, [
    createMenuItem("Budget Management", [Role.ADMIN], undefined, FaChevronCircleRight, COLORS.indigo, [
      createMenuItem("Budget Allocation", [Role.ADMIN], `${BASE_URLS.admin}/budget/allocation`, FaChevronCircleRight, COLORS.indigo),
      createMenuItem("Expense Tracking", [Role.ADMIN], `${BASE_URLS.admin}/budget/expenses`, FaChevronCircleRight, COLORS.red),
      createMenuItem("Financial Reports", [Role.ADMIN], `${BASE_URLS.admin}/budget/reports`, FaChevronCircleRight, COLORS.green),
    ]),
    createMenuItem("Payment Processing", [Role.ADMIN], undefined, FaChevronCircleRight, COLORS.green, [
      createMenuItem("Payment Approval", [Role.ADMIN], `${BASE_URLS.admin}/payments/approve`, FaChevronCircleRight, COLORS.green),
      createMenuItem("Payment History", [Role.ADMIN], `${BASE_URLS.admin}/payments/history`, FaChevronCircleRight, COLORS.blue),
    ]),
  ]),

  createMenuItem("Content Management", [], undefined, MdDescription, COLORS.cyan, [
    createMenuItem("Blog Management", [Role.ADMIN], undefined, FaChevronCircleRight, COLORS.cyan, [
      createMenuItem("Create Post", [Role.ADMIN], `${BASE_URLS.admin}/manage-blog/create`, FaChevronCircleRight, COLORS.cyan),
      createMenuItem("Edit Posts", [Role.ADMIN], `${BASE_URLS.admin}/manage-blog/edit`, FaChevronCircleRight, COLORS.blue),
      createMenuItem("Manage Comments", [Role.ADMIN], `${BASE_URLS.admin}/manage-blog/comments`, FaChevronCircleRight, COLORS.green),
    ]),
    createMenuItem("Email Management", [Role.ADMIN], undefined, FaChevronCircleRight, COLORS.orange, [
      createMenuItem("Email Templates", [Role.ADMIN], `${BASE_URLS.admin}/manage-email/templates`, FaChevronCircleRight, COLORS.orange),
      createMenuItem("Email Campaigns", [Role.ADMIN], `${BASE_URLS.admin}/manage-email/campaigns`, FaChevronCircleRight, COLORS.pink),
    ]),
  ]),

  createMenuItem("Village Management", [], undefined, MdHolidayVillage, COLORS.teal, [
    createMenuItem("Village Information", [Role.ADMIN], undefined, FaChevronCircleRight, COLORS.teal, [
      createMenuItem("Add Village", [Role.ADMIN], `${BASE_URLS.admin}/manage-villages/add`, FaChevronCircleRight, COLORS.teal),
      createMenuItem("Edit Village", [Role.ADMIN], `${BASE_URLS.admin}/manage-villages/edit`, FaChevronCircleRight, COLORS.blue),
      createMenuItem("Village Directory", [Role.ADMIN], `${BASE_URLS.admin}/manage-villages/view`, FaChevronCircleRight, COLORS.green),
    ]),
    createMenuItem("Population Data", [Role.ADMIN], undefined, FaChevronCircleRight, COLORS.purple, [
      createMenuItem("Demographics", [Role.ADMIN], `${BASE_URLS.admin}/populationinfo/demographics`, FaChevronCircleRight, COLORS.purple),
      createMenuItem("Geography Data", [Role.ADMIN], `${BASE_URLS.admin}/populationinfo/geography`, FaChevronCircleRight, COLORS.indigo),
    ]),
  ]),

  createMenuItem("System Administration", [], undefined, MdSettingsApplications, COLORS.gray, [
    createMenuItem("User Management", [Role.ADMIN], undefined, FaChevronCircleRight, COLORS.gray, [
      createMenuItem("Staff Management", [Role.ADMIN], `${BASE_URLS.admin}/staff`, FaChevronCircleRight, COLORS.gray),
      createMenuItem("Role Assignment", [Role.ADMIN], `${BASE_URLS.admin}/staff/roles`, FaChevronCircleRight, COLORS.blue),
    ]),
    createMenuItem("System Settings", [Role.ADMIN], undefined, FaChevronCircleRight, COLORS.orange, [
      createMenuItem("General Settings", [Role.ADMIN], `${BASE_URLS.admin}/settings`, FaChevronCircleRight, COLORS.orange),
      createMenuItem("Security Settings", [Role.ADMIN], `${BASE_URLS.admin}/settings/security`, FaChevronCircleRight, COLORS.red),
    ]),
  ]),

  createMenuItem("Reports & Analytics", [], undefined, MdAnalytics, COLORS.purple, [
    createMenuItem("Performance Reports", [Role.ADMIN], undefined, FaChevronCircleRight, COLORS.purple, [
      createMenuItem("Work Progress", [Role.ADMIN], `${BASE_URLS.admin}/reports/work-progress`, FaChevronCircleRight, COLORS.purple),
      createMenuItem("Financial Reports", [Role.ADMIN], `${BASE_URLS.admin}/reports/financial`, FaChevronCircleRight, COLORS.green),
    ]),
    createMenuItem("Analytics Dashboard", [Role.ADMIN], `${BASE_URLS.admin}/reports/analytics`, FaChevronCircleRight, COLORS.blue),
  ]),
];

// Employee Menu
export const employeeMenuItems: MenuItemProps[] = [
  createMenuItem("Employee Dashboard", [Role.EMPLOYEE], `${BASE_URLS.staff}/home`, MdDashboard, COLORS.blue),
  
  createMenuItem("Work Management", [Role.EMPLOYEE], undefined, MdWork, COLORS.green, [
    createMenuItem("Assigned Tasks", [Role.EMPLOYEE], `${BASE_URLS.staff}/tasks`, FaChevronCircleRight, COLORS.green),
    createMenuItem("Work Progress", [Role.EMPLOYEE], `${BASE_URLS.staff}/progress`, FaChevronCircleRight, COLORS.blue),
    createMenuItem("Submit Reports", [Role.EMPLOYEE], `${BASE_URLS.staff}/reports`, FaChevronCircleRight, COLORS.orange),
  ]),

  createMenuItem("Certificate Processing", [Role.EMPLOYEE], undefined, MdDescription, COLORS.purple, [
    createMenuItem("Pending Applications", [Role.EMPLOYEE], `${BASE_URLS.staff}/applications/pending`, FaChevronCircleRight, COLORS.purple),
    createMenuItem("Process Applications", [Role.EMPLOYEE], `${BASE_URLS.staff}/applications/process`, FaChevronCircleRight, COLORS.blue),
    createMenuItem("Document Verification", [Role.EMPLOYEE], `${BASE_URLS.staff}/documents/verify`, FaChevronCircleRight, COLORS.green),
  ]),

  createMenuItem("Leave Management", [Role.EMPLOYEE], undefined, MdCalendarToday, COLORS.orange, [
    createMenuItem("Apply Leave", [Role.EMPLOYEE], `${BASE_URLS.staff}/leave/apply`, FaChevronCircleRight, COLORS.orange),
    createMenuItem("Leave History", [Role.EMPLOYEE], `${BASE_URLS.staff}/leave/history`, FaChevronCircleRight, COLORS.blue),
    createMenuItem("Leave Balance", [Role.EMPLOYEE], `${BASE_URLS.staff}/leave/balance`, FaChevronCircleRight, COLORS.green),
  ]),

  createMenuItem("Profile", [Role.EMPLOYEE], undefined, MdPersonAdd, COLORS.indigo, [
    createMenuItem("View Profile", [Role.EMPLOYEE], `${BASE_URLS.staff}/profile`, FaChevronCircleRight, COLORS.indigo),
    createMenuItem("Update Profile", [Role.EMPLOYEE], `${BASE_URLS.staff}/profile/edit`, FaChevronCircleRight, COLORS.blue),
  ]),

  createMenuItem("Notifications", [Role.EMPLOYEE], `${BASE_URLS.staff}/notifications`, MdNotifications, COLORS.pink),
];

// Super Admin Menu
export const superAdminMenuItems: MenuItemProps[] = [
  createMenuItem("Super Admin Dashboard", [Role.SUPERADMIN], `${BASE_URLS.superadmin}/home`, MdDashboard, COLORS.blue),
  
  createMenuItem("System Administration", [Role.SUPERADMIN], undefined, MdSettingsApplications, COLORS.red, [
    createMenuItem("User Management", [Role.SUPERADMIN], undefined, FaChevronCircleRight, COLORS.red, [
      createMenuItem("Admin Management", [Role.SUPERADMIN], `${BASE_URLS.superadmin}/admins`, FaChevronCircleRight, COLORS.red),
      createMenuItem("Role Management", [Role.SUPERADMIN], `${BASE_URLS.superadmin}/roles`, FaChevronCircleRight, COLORS.blue),
    ]),
    createMenuItem("System Configuration", [Role.SUPERADMIN], undefined, FaChevronCircleRight, COLORS.orange, [
      createMenuItem("Global Settings", [Role.SUPERADMIN], `${BASE_URLS.superadmin}/settings`, FaChevronCircleRight, COLORS.orange),
      createMenuItem("Security Policies", [Role.SUPERADMIN], `${BASE_URLS.superadmin}/security`, FaChevronCircleRight, COLORS.red),
    ]),
  ]),

  createMenuItem("Monitoring & Analytics", [Role.SUPERADMIN], undefined, MdAnalytics, COLORS.purple, [
    createMenuItem("System Health", [Role.SUPERADMIN], `${BASE_URLS.superadmin}/monitoring/health`, FaChevronCircleRight, COLORS.purple),
    createMenuItem("Performance Metrics", [Role.SUPERADMIN], `${BASE_URLS.superadmin}/monitoring/performance`, FaChevronCircleRight, COLORS.blue),
    createMenuItem("Audit Logs", [Role.SUPERADMIN], `${BASE_URLS.superadmin}/monitoring/audit`, FaChevronCircleRight, COLORS.green),
  ]),

  createMenuItem("Integration Management", [Role.SUPERADMIN], undefined, MdApi, COLORS.teal, [
    createMenuItem("API Management", [Role.SUPERADMIN], `${BASE_URLS.superadmin}/integrations/api`, FaChevronCircleRight, COLORS.teal),
    createMenuItem("Third-party Services", [Role.SUPERADMIN], `${BASE_URLS.superadmin}/integrations/services`, FaChevronCircleRight, COLORS.blue),
  ]),

  createMenuItem("Reports", [Role.SUPERADMIN], undefined, MdAssessment, COLORS.indigo, [
    createMenuItem("System Reports", [Role.SUPERADMIN], `${BASE_URLS.superadmin}/reports/system`, FaChevronCircleRight, COLORS.indigo),
    createMenuItem("User Activity", [Role.SUPERADMIN], `${BASE_URLS.superadmin}/reports/activity`, FaChevronCircleRight, COLORS.blue),
  ]),
];

// Utility function to check if menu item is restricted for a role
export const isRestrictedForRole = (
  item: MenuItemProps,
  currentRole: Role
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

