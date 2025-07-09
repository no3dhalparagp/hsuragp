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

// Type Definition with allowedRoles
export type MenuItemProps = {
  menuItemText: string;
  menuItemLink?: string;
  Icon?: IconType;
  color?: string;
  submenu: boolean;
  subMenuItems: MenuItemProps[];
  allowedRoles: ("public" | "admin" | "employee" | "superAdmin")[];
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
  public: "/dashboard",
  admin: "/admindashboard",
  employee: "/employeedashboard",
  superAdmin: "/superadmindashboard",
};

// Enhanced helper to create menu items with allowedRoles
const createMenuItem = (
  text: string,
  roles: ("public" | "admin" | "employee" | "superAdmin")[],
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

// Public User Menu
export const publicUserMenuItems: MenuItemProps[] = [
  createMenuItem("Dashboard", ["public"], `${BASE_URLS.public}/home`, MdDashboard, COLORS.blue),
  
  createMenuItem("Certificate Services", ["public"], undefined, MdDescription, COLORS.green, [
    createMenuItem("Application Process", ["public"], undefined, FaChevronCircleRight, COLORS.yellow, [
      createMenuItem("Apply for Certificate", ["public"], `${BASE_URLS.public}/warish/apply`, FaChevronCircleRight, COLORS.yellow),
      createMenuItem("Check Status", ["public"], `${BASE_URLS.public}/warish/status`, FaChevronCircleRight, COLORS.blue),
    ]),
    createMenuItem("Documentation", ["public"], undefined, FaChevronCircleRight, COLORS.teal, [
      createMenuItem("Required Documents", ["public"], `${BASE_URLS.public}/warish/docs`, FaChevronCircleRight, COLORS.teal),
      createMenuItem("Upload Documents", ["public"], `${BASE_URLS.public}/warish/upload`, FaChevronCircleRight, COLORS.cyan),
    ]),
  ]),

  createMenuItem("Profile Management", ["public"], undefined, MdPersonAdd, COLORS.purple, [
    createMenuItem("Personal Information", ["public"], undefined, FaChevronCircleRight, COLORS.indigo, [
      createMenuItem("View Profile", ["public"], `${BASE_URLS.public}/profile/view`, FaChevronCircleRight, COLORS.indigo),
      createMenuItem("Edit Profile", ["public"], `${BASE_URLS.public}/profile/edit`, FaChevronCircleRight, COLORS.pink),
    ]),
    createMenuItem("Security", ["public"], undefined, FaChevronCircleRight, COLORS.red, [
      createMenuItem("Change Password", ["public"], `${BASE_URLS.public}/profile/change-password`, FaChevronCircleRight, COLORS.red),
      createMenuItem("Two-Factor Auth", ["public"], `${BASE_URLS.public}/profile/2fa`, FaChevronCircleRight, COLORS.orange),
    ]),
  ]),

  createMenuItem("Financial Services", ["public"], undefined, MdPayment, COLORS.lime, [
    createMenuItem("Payments", ["public"], undefined, FaChevronCircleRight, COLORS.lime, [
      createMenuItem("Payment History", ["public"], `${BASE_URLS.public}/payments/history`, FaChevronCircleRight, COLORS.lime),
      createMenuItem("Payment Methods", ["public"], `${BASE_URLS.public}/payments/methods`, FaChevronCircleRight, COLORS.blue),
    ]),
    createMenuItem("Receipts", ["public"], `${BASE_URLS.public}/payments/receipts`, FaChevronCircleRight, COLORS.green),
  ]),

  createMenuItem("Support Center", ["public"], undefined, MdFeedback, COLORS.orange, [
    createMenuItem("Help Desk", ["public"], undefined, FaChevronCircleRight, COLORS.orange, [
      createMenuItem("Submit Feedback", ["public"], `${BASE_URLS.public}/feedback`, FaChevronCircleRight, COLORS.orange),
      createMenuItem("File Complaint", ["public"], `${BASE_URLS.public}/record-complaint`, FaChevronCircleRight, COLORS.red),
    ]),
    createMenuItem("Knowledge Base", ["public"], undefined, FaChevronCircleRight, COLORS.teal, [
      createMenuItem("FAQs", ["public"], `${BASE_URLS.public}/resources/faqs`, FaChevronCircleRight, COLORS.cyan),
      createMenuItem("User Guides", ["public"], `${BASE_URLS.public}/resources/user-guide`, FaChevronCircleRight, COLORS.blue),
    ]),
  ]),

  createMenuItem("Resources", ["public"], undefined, MdLocalLibrary, COLORS.teal, [
    createMenuItem("Documents", ["public"], `${BASE_URLS.public}/resources/documents`, FaChevronCircleRight, COLORS.teal),
    createMenuItem("Announcements", ["public"], `${BASE_URLS.public}/announcements`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Calendar", ["public"], `${BASE_URLS.public}/calendar`, FaChevronCircleRight, COLORS.red),
  ]),

  createMenuItem("Notifications", ["public"], `${BASE_URLS.public}/notifications`, MdNotifications, COLORS.pink),
];

// Admin Menu
export const adminMenuItems: MenuItemProps[] = [
  createMenuItem("Admin Dashboard", ["admin", "superAdmin"], `${BASE_URLS.admin}/home`, MdDashboard, COLORS.blue),
  
  createMenuItem("Operations Management", ["admin"], undefined, MdWork, COLORS.red, [
    createMenuItem("Action Plans", ["admin"], `${BASE_URLS.admin}/work-manage/view`, FaChevronCircleRight, COLORS.blue),
    createMenuItem("Work Status Tracking", ["admin"], `${BASE_URLS.admin}/manage-tender/work-status-change`, FaChevronCircleRight, COLORS.indigo),
    createMenuItem("Fund Status", ["admin"], `${BASE_URLS.admin}/fundstatus`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Work Details", ["admin"], `${BASE_URLS.admin}/work-manage/scheme-wise`, FaChevronCircleRight, COLORS.red),
  ]),

  createMenuItem("Approved Action Plan", ["admin"], `${BASE_URLS.admin}/approvedactionplan`, MdListAlt, COLORS.green),

  createMenuItem("Certificate Management", ["admin", "superAdmin"], undefined, MdDescription, COLORS.red, [
    createMenuItem("Application Lifecycle", ["admin"], undefined, FaChevronCircleRight, COLORS.yellow, [
      createMenuItem("Submission", ["admin"], undefined, FaChevronDown, COLORS.teal, [
        createMenuItem("New Application", ["admin"], `${BASE_URLS.admin}/manage-warish/application`, FaChevronCircleRight, COLORS.teal),
        createMenuItem("Bulk Applications", ["admin"], `${BASE_URLS.admin}/manage-warish/bulk-upload`, FaChevronCircleRight, COLORS.blue),
      ]),
      createMenuItem("Processing", ["admin"], undefined, FaChevronDown, COLORS.green, [
        createMenuItem("Document Upload", ["admin"], `${BASE_URLS.admin}/manage-warish/pending-uploaddoc`, FaChevronCircleRight, COLORS.teal),
        createMenuItem("Verification", ["admin"], `${BASE_URLS.admin}/manage-warish/verify-document`, FaChevronCircleRight, COLORS.teal),
      ]),
    ]),
    createMenuItem("Workflow Management", ["admin"], undefined, FaChevronCircleRight, COLORS.purple, [
      createMenuItem("Assignment", ["admin"], undefined, FaChevronDown, COLORS.blue, [
        createMenuItem("Assign to Staff", ["admin"], `${BASE_URLS.admin}/manage-warish/assign-staff`, FaChevronCircleRight, COLORS.blue),
        createMenuItem("Public Assignments", ["admin"], `${BASE_URLS.admin}/manage-warish/assign-citizen`, FaChevronCircleRight, COLORS.blue),
      ]),
      createMenuItem("Approval Process", ["admin"], `${BASE_URLS.admin}/manage-warish/approve`, FaChevronCircleRight, COLORS.blue),
    ]),
    createMenuItem("Output Generation", ["admin"], undefined, FaChevronCircleRight, COLORS.green, [
      createMenuItem("Certificate Printing", ["admin"], `${BASE_URLS.admin}/manage-warish/print`, FaChevronCircleRight, COLORS.green),
      createMenuItem("Renewal Processing", ["admin"], `${BASE_URLS.admin}/manage-warish/renew`, FaChevronCircleRight, COLORS.blue),
    ]),
    createMenuItem("Monitoring", ["admin"], undefined, FaChevronCircleRight, COLORS.cyan, [
      createMenuItem("Status Tracking", ["admin"], `${BASE_URLS.admin}/manage-warish/status`, FaChevronCircleRight, COLORS.purple),
      createMenuItem("Performance Metrics", ["admin"], `${BASE_URLS.admin}/manage-warish/metrics`, FaChevronCircleRight, COLORS.orange),
    ]),
  ]),

  createMenuItem("Vendor Management", ["admin"], undefined, MdPeople, COLORS.red, [
    createMenuItem("Register New Vendor", ["admin"], `${BASE_URLS.admin}/manage-vendor/add`, FaChevronCircleRight, COLORS.indigo),
    createMenuItem("Update Vendor Details", ["admin"], `${BASE_URLS.admin}/manage-vendor/edit`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Vendor Directory", ["admin"], `${BASE_URLS.admin}/manage-vendor/view`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Upload Bulk Vendor", ["admin"], `${BASE_URLS.admin}/manage-vendor/bulk-upload`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Vendor Analytics", ["admin"], undefined, FaChartBar, COLORS.teal, [
      createMenuItem("Bid Participation Summary", ["admin"], `${BASE_URLS.admin}/reports/vendor-participation`, FaChevronCircleRight, COLORS.blue),
      createMenuItem("Earnest Money Status", ["admin"], `${BASE_URLS.admin}/reports/earnest-money`, FaChevronCircleRight, COLORS.green),
      createMenuItem("Technical Compliance", ["admin"], `${BASE_URLS.admin}/reports/technical-compliance`, FaChevronCircleRight, COLORS.purple),
    ]),
  ]),

  createMenuItem("Procurement", ["admin"], undefined, MdBusinessCenter, COLORS.purple, [
    createMenuItem("Tender Management", ["admin"], undefined, FaChevronCircleRight, COLORS.green, [
      createMenuItem("Creation", ["admin"], undefined, FaChevronDown, COLORS.teal, [
        createMenuItem("New Tender", ["admin"], `${BASE_URLS.admin}/manage-tender/add`, FaChevronCircleRight, COLORS.green),
        createMenuItem("Templates", ["admin"], `${BASE_URLS.admin}/manage-tender/templates`, FaChevronCircleRight, COLORS.blue),
      ]),
      createMenuItem("Active Tenders", ["admin"], `${BASE_URLS.admin}/manage-tender/open`, FaChevronCircleRight, COLORS.green),
    ]),
    createMenuItem("Bid Processing", ["admin"], undefined, FaChevronCircleRight, COLORS.yellow, [
      createMenuItem("Evaluation", ["admin"], undefined, FaChevronDown, COLORS.orange, [
        createMenuItem("Technical Evaluation", ["admin"], `${BASE_URLS.admin}/manage-tender/addtechnicaldetails`, FaChevronCircleRight, COLORS.teal),
        createMenuItem("Financial Evaluation", ["admin"], `${BASE_URLS.admin}/manage-tender/addfinanicaldetails`, FaChevronCircleRight, COLORS.red),
      ]),
      createMenuItem("Bidder Management", ["admin"], `${BASE_URLS.admin}/manage-tender/addbidderdetails`, FaChevronCircleRight, COLORS.yellow),
    ]),
    createMenuItem("Contract Management", ["admin"], undefined, FaChevronCircleRight, COLORS.indigo, [
      createMenuItem("Award Process", ["admin"], undefined, FaChevronDown, COLORS.red, [
        createMenuItem("Work Orders", ["admin"], `${BASE_URLS.admin}/manage-tender/workorderdetails`, FaChevronCircleRight, COLORS.red),
        createMenuItem("Contract Awards", ["admin"], `${BASE_URLS.admin}/manage-tender/awardofcontract`, FaChevronCircleRight, COLORS.indigo),
      ]),
      createMenuItem("Modifications", ["admin"], undefined, FaChevronDown, COLORS.pink, [
        createMenuItem("Tender Edits", ["admin"], `${BASE_URLS.admin}/manage-tender/edit`, FaChevronCircleRight, COLORS.orange),
        createMenuItem("Cancellations", ["admin"], `${BASE_URLS.admin}/manage-tender/cancel-tender`, FaChevronCircleRight, COLORS.red),
      ]),
    ]),
  ]),

  createMenuItem("Financial Management", ["admin"], undefined, MdMoney, COLORS.indigo, [
    createMenuItem("Transactions", ["admin"], undefined, FaChevronCircleRight, COLORS.indigo, [
      createMenuItem("Payment Records", ["admin"], `${BASE_URLS.admin}/addpaymentdetails`, FaChevronCircleRight, COLORS.indigo),
      createMenuItem("Receipt Management", ["admin"], `${BASE_URLS.admin}/payments/receipts`, FaChevronCircleRight, COLORS.green),
    ]),
    createMenuItem("Compliance", ["admin"], undefined, FaChevronCircleRight, COLORS.red, [
      createMenuItem("Tax Compliance", ["admin"], undefined, FaChevronDown, COLORS.yellow, [
        createMenuItem("GST Register", ["admin"], `${BASE_URLS.admin}/register/gst-register`, FaChevronCircleRight, COLORS.red),
        createMenuItem("Income Tax", ["admin"], `${BASE_URLS.admin}/register/income-tax`, FaChevronCircleRight, COLORS.red),
      ]),
      createMenuItem("Deposits", ["admin"], undefined, FaChevronDown, COLORS.teal, [
        createMenuItem("Security Deposits", ["admin"], `${BASE_URLS.admin}/register/security`, FaChevronCircleRight, COLORS.yellow),
        createMenuItem("Earnest Money", ["admin"], `${BASE_URLS.admin}/register/earnest-money`, FaChevronCircleRight, COLORS.red),
      ]),
    ]),
  ]),

  createMenuItem("Document Generation", ["admin"], undefined, MdDescription, COLORS.indigo, [
    createMenuItem("Scrutiny Sheets", ["admin"], `${BASE_URLS.admin}/generate/printscrutisheet`, FaChevronCircleRight, COLORS.indigo),
    createMenuItem("Agreements", ["admin"], `${BASE_URLS.admin}/generate/agrement`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Work Orders", ["admin"], `${BASE_URLS.admin}/generate/work-order`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Supply Orders", ["admin"], `${BASE_URLS.admin}/generate/supply-order`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Payment Certificates", ["admin"], `${BASE_URLS.admin}/generate/payment-certificate`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Completion Certificates", ["admin"], `${BASE_URLS.admin}/generate/completation-certificate`, FaChevronCircleRight, COLORS.red),
    createMenuItem("FY Completion Reports", ["admin"], `${BASE_URLS.admin}/generate/completation-certificate2`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Document Covers", ["admin"], `${BASE_URLS.admin}/generate/cover-page`, FaChevronCircleRight, COLORS.red),
  ]),

  createMenuItem("Reports & Analytics", ["admin"], undefined, MdAnalytics, COLORS.blue, [
    createMenuItem("Financial Reports", ["admin"], undefined, FaChartBar, COLORS.green, [
      createMenuItem("Budget Analysis", ["admin"], `${BASE_URLS.admin}/reports/budget`, FaChevronCircleRight, COLORS.blue),
      createMenuItem("Expenditure Summary", ["admin"], `${BASE_URLS.admin}/reports/expenditure`, FaChevronCircleRight, COLORS.green),
    ]),
    createMenuItem("Performance Metrics", ["admin"], `${BASE_URLS.admin}/reports/performance`, FaChevronCircleRight, COLORS.purple),
    createMenuItem("Other Reports", ["admin"], `${BASE_URLS.admin}/reports`, FaChevronCircleRight, COLORS.indigo),
  ]),

  createMenuItem("Notice", ["admin"], undefined, MdAnnouncement, COLORS.indigo, [
    createMenuItem("Add Notice", ["admin"], `${BASE_URLS.admin}/notice/add`, FaChevronCircleRight, COLORS.cyan),
    createMenuItem("View Notices", ["admin"], `${BASE_URLS.admin}/notice/view`, FaChevronCircleRight, COLORS.cyan),
  ]),

  createMenuItem("System Administration", ["admin", "superAdmin"], undefined, MdSettingsApplications, COLORS.gray, [
    createMenuItem("User Management", ["admin", "superAdmin"], undefined, FaChevronCircleRight, COLORS.green, [
      createMenuItem("User Accounts", ["admin", "superAdmin"], undefined, FaChevronDown, COLORS.blue, [
        createMenuItem("Create User", ["admin", "superAdmin"], `${BASE_URLS.admin}/user/add`, FaChevronCircleRight, COLORS.green),
        createMenuItem("Modify User", ["admin", "superAdmin"], `${BASE_URLS.admin}/user/edit`, FaChevronCircleRight, COLORS.red),
      ]),
      createMenuItem("Directories", ["admin", "superAdmin"], undefined, FaChevronDown, COLORS.purple, [
        createMenuItem("User Directory", ["admin", "superAdmin"], `${BASE_URLS.admin}/user`, FaChevronCircleRight, COLORS.green),
        createMenuItem("Staff Directory", ["admin", "superAdmin"], `${BASE_URLS.admin}/staff`, FaChevronCircleRight, COLORS.red),
      ]),
      createMenuItem("Personnel Directory", ["admin", "superAdmin"], `${BASE_URLS.admin}/viewmenberdetails`, FaChevronCircleRight, COLORS.purple),
    ]),
    createMenuItem("System Configuration", ["admin", "superAdmin"], undefined, FaChevronCircleRight, COLORS.red, [
      createMenuItem("Services", ["admin", "superAdmin"], undefined, FaChevronDown, COLORS.purple, [
        createMenuItem("Email Services", ["admin", "superAdmin"], `${BASE_URLS.admin}/master/utils/emails-service`, FaChevronCircleRight, COLORS.purple),
        createMenuItem("Notifications", ["admin", "superAdmin"], `${BASE_URLS.admin}/master/utils/notifications`, FaChevronCircleRight, COLORS.purple),
      ]),
      createMenuItem("Content", ["admin", "superAdmin"], undefined, FaChevronDown, COLORS.teal, [
        createMenuItem("System Messages", ["admin", "superAdmin"], `${BASE_URLS.admin}/master/addimpsmessage`, FaChevronCircleRight, COLORS.green),
        createMenuItem("Forms Repository", ["admin", "superAdmin"], `${BASE_URLS.admin}/master/uploadform`, FaChevronCircleRight, COLORS.green),
      ]),
      createMenuItem("Work Item Catalog", ["admin", "superAdmin"], `${BASE_URLS.admin}/master/addworkitems`, FaChevronCircleRight, COLORS.green),
    ]),
    createMenuItem("Monitoring", ["admin", "superAdmin"], undefined, FaChevronCircleRight, COLORS.cyan, [
      createMenuItem("Audit Logs", ["admin", "superAdmin"], `${BASE_URLS.admin}/monitoring/audit-logs`, FaChevronCircleRight, COLORS.gray),
      createMenuItem("System Health", ["admin", "superAdmin"], `${BASE_URLS.admin}/monitoring/health`, FaChevronCircleRight, COLORS.green),
    ]),
  ]),

  createMenuItem("Integrations", ["admin", "superAdmin"], undefined, MdImportantDevices, COLORS.indigo, [
    createMenuItem("Payment Gateways", ["admin", "superAdmin"], `${BASE_URLS.admin}/integrations/payments`, FaChevronCircleRight, COLORS.green),
    createMenuItem("API Management", ["admin", "superAdmin"], `${BASE_URLS.admin}/integrations/api`, FaChevronCircleRight, COLORS.red),
  ]),

  createMenuItem("Manage Villages", ["admin"], undefined, MdHolidayVillage, COLORS.cyan, [
    createMenuItem("View Villages", ["admin"], `${BASE_URLS.admin}/manage-villages/view`, FaChevronCircleRight, COLORS.cyan),
    createMenuItem("Village Population", ["admin"], `${BASE_URLS.admin}/manage-villages/population`, FaChevronCircleRight, COLORS.cyan),
    createMenuItem("Village Education", ["admin"], `${BASE_URLS.admin}/manage-villages/education`, FaChevronCircleRight, COLORS.cyan),
    createMenuItem("Village Infrastructure", ["admin"], `${BASE_URLS.admin}/manage-villages/infrastructure`, FaChevronCircleRight, COLORS.cyan),
    createMenuItem("Village Health", ["admin"], `${BASE_URLS.admin}/manage-villages/health`, FaChevronCircleRight, COLORS.cyan),
    createMenuItem("Village Agriculture", ["admin"], `${BASE_URLS.admin}/manage-villages/agriculture`, FaChevronCircleRight, COLORS.cyan),
  ]),

  createMenuItem("Water Tanker Management", ["admin"], undefined, FaTruck, COLORS.blue, [
    createMenuItem("Service Fee Management", ["admin"], `${BASE_URLS.admin}/water-tanker/fees`, FaChevronCircleRight, COLORS.green),
    createMenuItem("Tanker Schedule", ["admin"], `${BASE_URLS.admin}/water-tanker/schedule`, FaChevronCircleRight, COLORS.yellow),
    createMenuItem("Tanker Requests", ["admin"], `${BASE_URLS.admin}/water-tanker/requests`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Tanker Maintenance", ["admin"], `${BASE_URLS.admin}/water-tanker/availability`, FaChevronCircleRight, COLORS.purple),
  ]),
];

// Employee Menu
export const employeeMenuItems: MenuItemProps[] = [
  createMenuItem("Employee Dashboard", ["employee", "superAdmin"], `${BASE_URLS.employee}/home`, MdDashboard, COLORS.blue),
  
  createMenuItem("Certificate Processing", ["employee"], undefined, MdAssignment, COLORS.red, [
    createMenuItem("My Assignments", ["employee"], undefined, FaChevronCircleRight, COLORS.yellow, [
      createMenuItem("Current Tasks", ["employee"], `${BASE_URLS.employee}/warish/view-assigned`, FaChevronCircleRight, COLORS.yellow),
      createMenuItem("Process Applications", ["employee"], `${BASE_URLS.employee}/warish/process`, FaChevronCircleRight, COLORS.green),
    ]),
    createMenuItem("Documentation", ["employee"], undefined, FaChevronCircleRight, COLORS.teal, [
      createMenuItem("Upload Documents", ["employee"], `${BASE_URLS.employee}/documents/upload`, FaChevronCircleRight, COLORS.blue),
      createMenuItem("Verify Documents", ["employee"], `${BASE_URLS.employee}/warish/verify`, FaChevronCircleRight, COLORS.green),
    ]),
  ]),

  createMenuItem("Work Management", ["employee"], undefined, MdAssignmentTurnedIn, COLORS.cyan, [
    createMenuItem("Tasks", ["employee"], undefined, FaChevronCircleRight, COLORS.blue, [
      createMenuItem("My Tasks", ["employee"], `${BASE_URLS.employee}/tasks`, FaChevronCircleRight, COLORS.blue),
      createMenuItem("Team Tasks", ["employee"], `${BASE_URLS.employee}/tasks/team`, FaChevronCircleRight, COLORS.green),
    ]),
    createMenuItem("Reporting", ["employee"], undefined, FaChevronCircleRight, COLORS.pink, [
      createMenuItem("Daily Reports", ["employee"], `${BASE_URLS.employee}/reports`, FaChevronCircleRight, COLORS.blue),
      createMenuItem("Performance Metrics", ["employee"], `${BASE_URLS.employee}/reports/metrics`, FaChevronCircleRight, COLORS.green),
    ]),
  ]),

  createMenuItem("Personal", ["employee"], undefined, MdPersonAdd, COLORS.purple, [
    createMenuItem("Leave Management", ["employee"], undefined, FaChevronCircleRight, COLORS.pink, [
      createMenuItem("Apply Leave", ["employee"], `${BASE_URLS.employee}/leave/apply`, FaChevronCircleRight, COLORS.blue),
      createMenuItem("Leave Balance", ["employee"], `${BASE_URLS.employee}/leave/balance`, FaChevronCircleRight, COLORS.green),
    ]),
    createMenuItem("Training", ["employee"], undefined, FaChevronCircleRight, COLORS.purple, [
      createMenuItem("Available Courses", ["employee"], `${BASE_URLS.employee}/training/courses`, FaChevronCircleRight, COLORS.blue),
      createMenuItem("My Certifications", ["employee"], `${BASE_URLS.employee}/training/certifications`, FaChevronCircleRight, COLORS.green),
    ]),
  ]),

  createMenuItem("Water Tanker Management", ["employee"], undefined, FaTruck, COLORS.blue, [
    createMenuItem("Booking Requests", ["employee"], `${BASE_URLS.employee}/water-tanker/booking`, FaChevronCircleRight, COLORS.yellow),
    createMenuItem("Service History", ["employee"], `${BASE_URLS.employee}/water-tanker/history`, FaChevronCircleRight, COLORS.red),
  ]),
];

// Super Admin Menu
export const superAdminMenuItems: MenuItemProps[] = [
  createMenuItem("Generate API Key", ["superAdmin"], `${BASE_URLS.superAdmin}/apiKeyGenerator`, FaKey, COLORS.purple),

  createMenuItem("System Oversight", ["superAdmin"], undefined, MdSettingsApplications, COLORS.gray, [
    createMenuItem("User Management", ["superAdmin"], undefined, FaChevronCircleRight, COLORS.green, [
      createMenuItem("User Accounts", ["superAdmin"], `${BASE_URLS.superAdmin}/user`, FaChevronCircleRight, COLORS.green),
      createMenuItem("Access Controls", ["superAdmin"], `${BASE_URLS.superAdmin}/access-controls`, FaChevronCircleRight, COLORS.indigo),
    ]),
    createMenuItem("Security", ["superAdmin"], undefined, FaChevronCircleRight, COLORS.red, [
      createMenuItem("Audit Logs", ["superAdmin"], `${BASE_URLS.superAdmin}/audit-logs`, FaChevronCircleRight, COLORS.purple),
      createMenuItem("Security Policies", ["superAdmin"], `${BASE_URLS.superAdmin}/security/policies`, FaChevronCircleRight, COLORS.blue),
    ]),
  ]),

  createMenuItem("Infrastructure", ["superAdmin"], undefined, MdCloudUpload, COLORS.blue, [
    createMenuItem("Data Management", ["superAdmin"], undefined, FaChevronCircleRight, COLORS.indigo, [
      createMenuItem("Backup & Restore", ["superAdmin"], `${BASE_URLS.superAdmin}/infrastructure/backup`, FaChevronCircleRight, COLORS.blue),
      createMenuItem("API Management", ["superAdmin"], `${BASE_URLS.superAdmin}/apiKeyGenerator`, FaChevronCircleRight, COLORS.purple),
    ]),
    createMenuItem("Configuration", ["superAdmin"], undefined, FaChevronCircleRight, COLORS.teal, [
      createMenuItem("Environment Settings", ["superAdmin"], `${BASE_URLS.superAdmin}/infrastructure/environment`, FaChevronCircleRight, COLORS.green),
      createMenuItem("System Defaults", ["superAdmin"], `${BASE_URLS.superAdmin}/infrastructure/defaults`, FaChevronCircleRight, COLORS.cyan),
    ]),
  ]),
];

// Utility function to check if item is restricted for current role
export const isRestrictedForRole = (
  item: MenuItemProps,
  currentRole: "public" | "admin" | "employee" | "superAdmin"
): boolean => {
  return !item.allowedRoles.includes(currentRole);
};

// Flatten menu for permission matrix view
export const getAllMenuItems = (): MenuItemProps[] => {
  const flattenMenu = (items: MenuItemProps[]): MenuItemProps[] => {
    return items.flatMap(item => [item, ...flattenMenu(item.subMenuItems)]);
  };
  
  return [
    ...flattenMenu(publicUserMenuItems),
    ...flattenMenu(adminMenuItems),
    ...flattenMenu(employeeMenuItems),
    ...flattenMenu(superAdminMenuItems)
  ];
};
