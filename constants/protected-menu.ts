
import { IconType } from "react-icons/lib";
import {
  MdDashboard, MdAssessment, MdBusinessCenter, MdPeople, MdMoney,
  MdAssignment, MdSettingsCell, MdDescription, MdDateRange, MdAnnouncement,
  MdPersonAdd, MdSearch, MdFeedback, MdLocalLibrary, MdPayment,
  MdNotifications, MdCalendarToday, MdCloudUpload, MdApi, MdLock,
  MdSettingsApplications, MdSchool, MdAssignmentTurnedIn, MdHolidayVillage,
  MdWork, MdListAlt, MdAnalytics, MdReceipt, MdImportantDevices
} from "react-icons/md";
import { FaChevronCircleRight, FaChartBar, FaChevronDown, FaTruck, FaKey } from "react-icons/fa";

// Type Definition
export type MenuItemProps = {
  menuItemText: string;
  menuItemLink?: string;
  Icon?: IconType;
  color?: string;
  submenu: boolean;
  subMenuItems: MenuItemProps[];
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

// Helper to create menu items
const createMenuItem = (
  text: string,
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
});

// Public User Menu - Enhanced Structure
export const publicUserMenuItems: MenuItemProps[] = [
  createMenuItem("Dashboard", `${BASE_URLS.public}/home`, MdDashboard, COLORS.blue),
  
  createMenuItem("Certificate Services", undefined, MdDescription, COLORS.green, [
    createMenuItem("Application Process", undefined, FaChevronCircleRight, COLORS.yellow, [
      createMenuItem("Apply for Certificate", `${BASE_URLS.public}/warish/apply`, FaChevronCircleRight, COLORS.yellow),
      createMenuItem("Check Status", `${BASE_URLS.public}/warish/status`, FaChevronCircleRight, COLORS.blue),
    ]),
    createMenuItem("Documentation", undefined, FaChevronCircleRight, COLORS.teal, [
      createMenuItem("Required Documents", `${BASE_URLS.public}/warish/docs`, FaChevronCircleRight, COLORS.teal),
      createMenuItem("Upload Documents", `${BASE_URLS.public}/warish/upload`, FaChevronCircleRight, COLORS.cyan),
    ]),
  ]),

  createMenuItem("Profile Management", undefined, MdPersonAdd, COLORS.purple, [
    createMenuItem("Personal Information", undefined, FaChevronCircleRight, COLORS.indigo, [
      createMenuItem("View Profile", `${BASE_URLS.public}/profile/view`, FaChevronCircleRight, COLORS.indigo),
      createMenuItem("Edit Profile", `${BASE_URLS.public}/profile/edit`, FaChevronCircleRight, COLORS.pink),
    ]),
    createMenuItem("Security", undefined, FaChevronCircleRight, COLORS.red, [
      createMenuItem("Change Password", `${BASE_URLS.public}/profile/change-password`, FaChevronCircleRight, COLORS.red),
      createMenuItem("Two-Factor Auth", `${BASE_URLS.public}/profile/2fa`, FaChevronCircleRight, COLORS.orange),
    ]),
  ]),

  createMenuItem("Financial Services", undefined, MdPayment, COLORS.lime, [
    createMenuItem("Payments", undefined, FaChevronCircleRight, COLORS.lime, [
      createMenuItem("Payment History", `${BASE_URLS.public}/payments/history`, FaChevronCircleRight, COLORS.lime),
      createMenuItem("Payment Methods", `${BASE_URLS.public}/payments/methods`, FaChevronCircleRight, COLORS.blue),
    ]),
    createMenuItem("Receipts", `${BASE_URLS.public}/payments/receipts`, FaChevronCircleRight, COLORS.green),
  ]),

  createMenuItem("Support Center", undefined, MdFeedback, COLORS.orange, [
    createMenuItem("Help Desk", undefined, FaChevronCircleRight, COLORS.orange, [
      createMenuItem("Submit Feedback", `${BASE_URLS.public}/feedback`, FaChevronCircleRight, COLORS.orange),
      createMenuItem("File Complaint", `${BASE_URLS.public}/record-complaint`, FaChevronCircleRight, COLORS.red),
    ]),
    createMenuItem("Knowledge Base", undefined, FaChevronCircleRight, COLORS.teal, [
      createMenuItem("FAQs", `${BASE_URLS.public}/resources/faqs`, FaChevronCircleRight, COLORS.cyan),
      createMenuItem("User Guides", `${BASE_URLS.public}/resources/user-guide`, FaChevronCircleRight, COLORS.blue),
    ]),
  ]),

  createMenuItem("Resources", undefined, MdLocalLibrary, COLORS.teal, [
    createMenuItem("Documents", `${BASE_URLS.public}/resources/documents`, FaChevronCircleRight, COLORS.teal),
    createMenuItem("Announcements", `${BASE_URLS.public}/announcements`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Calendar", `${BASE_URLS.public}/calendar`, FaChevronCircleRight, COLORS.red),
  ]),

  createMenuItem("Notifications", `${BASE_URLS.public}/notifications`, MdNotifications, COLORS.pink),
];

// Admin Menu - Enhanced with all missing items
export const adminMenuItems: MenuItemProps[] = [
  createMenuItem("Admin Dashboard", `${BASE_URLS.admin}/home`, MdDashboard, COLORS.blue),
  
  // Operations Management (Missing in enhanced version)
  createMenuItem("Operations Management", undefined, MdWork, COLORS.red, [
    createMenuItem("Action Plans", `${BASE_URLS.admin}/work-manage/view`, FaChevronCircleRight, COLORS.blue),
    createMenuItem("Work Status Tracking", `${BASE_URLS.admin}/manage-tender/work-status-change`, FaChevronCircleRight, COLORS.indigo),
    createMenuItem("Fund Status", `${BASE_URLS.admin}/fundstatus`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Work Details", `${BASE_URLS.admin}/work-manage/scheme-wise`, FaChevronCircleRight, COLORS.red),
  ]),

  // Approved Action Plan (Missing in enhanced version)
  createMenuItem("Approved Action Plan", `${BASE_URLS.admin}/approvedactionplan`, MdListAlt, COLORS.green),

  // Certificate Management
  createMenuItem("Certificate Management", undefined, MdDescription, COLORS.red, [
    createMenuItem("Application Lifecycle", undefined, FaChevronCircleRight, COLORS.yellow, [
      createMenuItem("Submission", undefined, FaChevronDown, COLORS.teal, [
        createMenuItem("New Application", `${BASE_URLS.admin}/manage-warish/application`, FaChevronCircleRight, COLORS.teal),
        createMenuItem("Bulk Applications", `${BASE_URLS.admin}/manage-warish/bulk-upload`, FaChevronCircleRight, COLORS.blue),
      ]),
      createMenuItem("Processing", undefined, FaChevronDown, COLORS.green, [
        createMenuItem("Document Upload", `${BASE_URLS.admin}/manage-warish/pending-uploaddoc`, FaChevronCircleRight, COLORS.teal),
        createMenuItem("Verification", `${BASE_URLS.admin}/manage-warish/verify-document`, FaChevronCircleRight, COLORS.teal),
      ]),
    ]),
    createMenuItem("Workflow Management", undefined, FaChevronCircleRight, COLORS.purple, [
      createMenuItem("Assignment", undefined, FaChevronDown, COLORS.blue, [
        createMenuItem("Assign to Staff", `${BASE_URLS.admin}/manage-warish/assign-staff`, FaChevronCircleRight, COLORS.blue),
        createMenuItem("Public Assignments", `${BASE_URLS.admin}/manage-warish/assign-citizen`, FaChevronCircleRight, COLORS.blue),
      ]),
      createMenuItem("Approval Process", `${BASE_URLS.admin}/manage-warish/approve`, FaChevronCircleRight, COLORS.blue),
    ]),
    createMenuItem("Output Generation", undefined, FaChevronCircleRight, COLORS.green, [
      createMenuItem("Certificate Printing", `${BASE_URLS.admin}/manage-warish/print`, FaChevronCircleRight, COLORS.green),
      createMenuItem("Renewal Processing", `${BASE_URLS.admin}/manage-warish/renew`, FaChevronCircleRight, COLORS.blue),
    ]),
    createMenuItem("Monitoring", undefined, FaChevronCircleRight, COLORS.cyan, [
      createMenuItem("Status Tracking", `${BASE_URLS.admin}/manage-warish/status`, FaChevronCircleRight, COLORS.purple),
      createMenuItem("Performance Metrics", `${BASE_URLS.admin}/manage-warish/metrics`, FaChevronCircleRight, COLORS.orange),
    ]),
  ]),

  // Vendor Management (Missing in enhanced version)
  createMenuItem("Vendor Management", undefined, MdPeople, COLORS.red, [
    createMenuItem("Register New Vendor", `${BASE_URLS.admin}/manage-vendor/add`, FaChevronCircleRight, COLORS.indigo),
    createMenuItem("Update Vendor Details", `${BASE_URLS.admin}/manage-vendor/edit`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Vendor Directory", `${BASE_URLS.admin}/manage-vendor/view`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Vendor Analytics", undefined, FaChartBar, COLORS.teal, [
      createMenuItem("Bid Participation Summary", `${BASE_URLS.admin}/reports/vendor-participation`, FaChevronCircleRight, COLORS.blue),
      createMenuItem("Earnest Money Status", `${BASE_URLS.admin}/reports/earnest-money`, FaChevronCircleRight, COLORS.green),
      createMenuItem("Technical Compliance", `${BASE_URLS.admin}/reports/technical-compliance`, FaChevronCircleRight, COLORS.purple),
    ]),
  ]),

  // Procurement Management
  createMenuItem("Procurement", undefined, MdBusinessCenter, COLORS.purple, [
    createMenuItem("Tender Management", undefined, FaChevronCircleRight, COLORS.green, [
      createMenuItem("Creation", undefined, FaChevronDown, COLORS.teal, [
        createMenuItem("New Tender", `${BASE_URLS.admin}/manage-tender/add`, FaChevronCircleRight, COLORS.green),
        createMenuItem("Templates", `${BASE_URLS.admin}/manage-tender/templates`, FaChevronCircleRight, COLORS.blue),
      ]),
      createMenuItem("Active Tenders", `${BASE_URLS.admin}/manage-tender/open`, FaChevronCircleRight, COLORS.green),
    ]),
    createMenuItem("Bid Processing", undefined, FaChevronCircleRight, COLORS.yellow, [
      createMenuItem("Evaluation", undefined, FaChevronDown, COLORS.orange, [
        createMenuItem("Technical Evaluation", `${BASE_URLS.admin}/manage-tender/addtechnicaldetails`, FaChevronCircleRight, COLORS.teal),
        createMenuItem("Financial Evaluation", `${BASE_URLS.admin}/manage-tender/addfinanicaldetails`, FaChevronCircleRight, COLORS.red),
      ]),
      createMenuItem("Bidder Management", `${BASE_URLS.admin}/manage-tender/addbidderdetails`, FaChevronCircleRight, COLORS.yellow),
    ]),
    createMenuItem("Contract Management", undefined, FaChevronCircleRight, COLORS.indigo, [
      createMenuItem("Award Process", undefined, FaChevronDown, COLORS.red, [
        createMenuItem("Work Orders", `${BASE_URLS.admin}/manage-tender/workorderdetails`, FaChevronCircleRight, COLORS.red),
        createMenuItem("Contract Awards", `${BASE_URLS.admin}/manage-tender/awardofcontract`, FaChevronCircleRight, COLORS.indigo),
      ]),
      createMenuItem("Modifications", undefined, FaChevronDown, COLORS.pink, [
        createMenuItem("Tender Edits", `${BASE_URLS.admin}/manage-tender/edit`, FaChevronCircleRight, COLORS.orange),
        createMenuItem("Cancellations", `${BASE_URLS.admin}/manage-tender/cancel-tender`, FaChevronCircleRight, COLORS.red),
      ]),
    ]),
  ]),

  // Financial Management
  createMenuItem("Financial Management", undefined, MdMoney, COLORS.indigo, [
    createMenuItem("Transactions", undefined, FaChevronCircleRight, COLORS.indigo, [
      createMenuItem("Payment Records", `${BASE_URLS.admin}/addpaymentdetails`, FaChevronCircleRight, COLORS.indigo),
      createMenuItem("Receipt Management", `${BASE_URLS.admin}/payments/receipts`, FaChevronCircleRight, COLORS.green),
    ]),
    createMenuItem("Compliance", undefined, FaChevronCircleRight, COLORS.red, [
      createMenuItem("Tax Compliance", undefined, FaChevronDown, COLORS.yellow, [
        createMenuItem("GST Register", `${BASE_URLS.admin}/register/gst-register`, FaChevronCircleRight, COLORS.red),
        createMenuItem("Income Tax", `${BASE_URLS.admin}/register/income-tax`, FaChevronCircleRight, COLORS.red),
      ]),
      createMenuItem("Deposits", undefined, FaChevronDown, COLORS.teal, [
        createMenuItem("Security Deposits", `${BASE_URLS.admin}/register/security`, FaChevronCircleRight, COLORS.yellow),
        createMenuItem("Earnest Money", `${BASE_URLS.admin}/register/earnest-money`, FaChevronCircleRight, COLORS.red),
      ]),
    ]),
  ]),

  // Document Generation
  createMenuItem("Document Generation", undefined, MdDescription, COLORS.indigo, [
    createMenuItem("Scrutiny Sheets", `${BASE_URLS.admin}/generate/printscrutisheet`, FaChevronCircleRight, COLORS.indigo),
    createMenuItem("Agreements", `${BASE_URLS.admin}/generate/agrement`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Work Orders", `${BASE_URLS.admin}/generate/work-order`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Supply Orders", `${BASE_URLS.admin}/generate/supply-order`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Payment Certificates", `${BASE_URLS.admin}/generate/payment-certificate`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Completion Certificates", `${BASE_URLS.admin}/generate/completation-certificate`, FaChevronCircleRight, COLORS.red),
    createMenuItem("FY Completion Reports", `${BASE_URLS.admin}/generate/completation-certificate2`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Document Covers", `${BASE_URLS.admin}/generate/cover-page`, FaChevronCircleRight, COLORS.red),
  ]),

  // Reports & Analytics (Missing in enhanced version)
  createMenuItem("Reports & Analytics", undefined, MdAnalytics, COLORS.blue, [
    createMenuItem("Financial Reports", undefined, FaChartBar, COLORS.green, [
      createMenuItem("Budget Analysis", `${BASE_URLS.admin}/reports/budget`, FaChevronCircleRight, COLORS.blue),
      createMenuItem("Expenditure Summary", `${BASE_URLS.admin}/reports/expenditure`, FaChevronCircleRight, COLORS.green),
    ]),
    createMenuItem("Performance Metrics", `${BASE_URLS.admin}/reports/performance`, FaChevronCircleRight, COLORS.purple),
    createMenuItem("Other Reports", `${BASE_URLS.admin}/reports`, FaChevronCircleRight, COLORS.indigo),
  ]),

  // Notice (Missing in enhanced version)
  createMenuItem("Notice", undefined, MdAnnouncement, COLORS.indigo, [
    createMenuItem("Add Notice", `${BASE_URLS.admin}/notice/add`, FaChevronCircleRight, COLORS.cyan),
    createMenuItem("View Notices", `${BASE_URLS.admin}/notice/view`, FaChevronCircleRight, COLORS.cyan),
  ]),

  // System Administration
  createMenuItem("System Administration", undefined, MdSettingsApplications, COLORS.gray, [
    createMenuItem("User Management", undefined, FaChevronCircleRight, COLORS.green, [
      createMenuItem("User Accounts", undefined, FaChevronDown, COLORS.blue, [
        createMenuItem("Create User", `${BASE_URLS.admin}/user/add`, FaChevronCircleRight, COLORS.green),
        createMenuItem("Modify User", `${BASE_URLS.admin}/user/edit`, FaChevronCircleRight, COLORS.red),
      ]),
      createMenuItem("Directories", undefined, FaChevronDown, COLORS.purple, [
        createMenuItem("User Directory", `${BASE_URLS.admin}/user`, FaChevronCircleRight, COLORS.green),
        createMenuItem("Staff Directory", `${BASE_URLS.admin}/staff`, FaChevronCircleRight, COLORS.red),
      ]),
      // Personnel Directory (Missing in enhanced version)
      createMenuItem("Personnel Directory", `${BASE_URLS.admin}/viewmenberdetails`, FaChevronCircleRight, COLORS.purple),
    ]),
    createMenuItem("System Configuration", undefined, FaChevronCircleRight, COLORS.red, [
      createMenuItem("Services", undefined, FaChevronDown, COLORS.purple, [
        createMenuItem("Email Services", `${BASE_URLS.admin}/master/utils/emails-service`, FaChevronCircleRight, COLORS.purple),
        createMenuItem("Notifications", `${BASE_URLS.admin}/master/utils/notifications`, FaChevronCircleRight, COLORS.purple),
      ]),
      createMenuItem("Content", undefined, FaChevronDown, COLORS.teal, [
        createMenuItem("System Messages", `${BASE_URLS.admin}/master/addimpsmessage`, FaChevronCircleRight, COLORS.green),
        createMenuItem("Forms Repository", `${BASE_URLS.admin}/master/uploadform`, FaChevronCircleRight, COLORS.green),
      ]),
      // Work Item Catalog (Missing in enhanced version)
      createMenuItem("Work Item Catalog", `${BASE_URLS.admin}/master/addworkitems`, FaChevronCircleRight, COLORS.green),
    ]),
    createMenuItem("Monitoring", undefined, FaChevronCircleRight, COLORS.cyan, [
      createMenuItem("Audit Logs", `${BASE_URLS.admin}/monitoring/audit-logs`, FaChevronCircleRight, COLORS.gray),
      createMenuItem("System Health", `${BASE_URLS.admin}/monitoring/health`, FaChevronCircleRight, COLORS.green),
    ]),
  ]),

  // Integrations (Missing in enhanced version)
  createMenuItem("Integrations", undefined, MdImportantDevices, COLORS.indigo, [
    createMenuItem("Payment Gateways", `${BASE_URLS.admin}/integrations/payments`, FaChevronCircleRight, COLORS.green),
    createMenuItem("API Management", `${BASE_URLS.admin}/integrations/api`, FaChevronCircleRight, COLORS.red),
  ]),

  // Manage Villages (Missing in enhanced version)
  createMenuItem("Manage Villages", undefined, MdHolidayVillage, COLORS.cyan, [
    createMenuItem("View Villages", `${BASE_URLS.admin}/manage-villages/view`, FaChevronCircleRight, COLORS.cyan),
    createMenuItem("Village Population", `${BASE_URLS.admin}/manage-villages/population`, FaChevronCircleRight, COLORS.cyan),
    createMenuItem("Village Education", `${BASE_URLS.admin}/manage-villages/education`, FaChevronCircleRight, COLORS.cyan),
    createMenuItem("Village Infrastructure", `${BASE_URLS.admin}/manage-villages/infrastructure`, FaChevronCircleRight, COLORS.cyan),
    createMenuItem("Village Health", `${BASE_URLS.admin}/manage-villages/health`, FaChevronCircleRight, COLORS.cyan),
    createMenuItem("Village Agriculture", `${BASE_URLS.admin}/manage-villages/agriculture`, FaChevronCircleRight, COLORS.cyan),
  ]),

  // Water Tanker Management (Missing in enhanced version)
  createMenuItem("Water Tanker Management", undefined, FaTruck, COLORS.blue, [
    createMenuItem("Service Fee Management", `${BASE_URLS.admin}/water-tanker/fees`, FaChevronCircleRight, COLORS.green),
    createMenuItem("Tanker Schedule", `${BASE_URLS.admin}/water-tanker/schedule`, FaChevronCircleRight, COLORS.yellow),
    createMenuItem("Tanker Requests", `${BASE_URLS.admin}/water-tanker/requests`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Tanker Maintenance", `${BASE_URLS.admin}/water-tanker/availability`, FaChevronCircleRight, COLORS.purple),
  ]),
];

// Employee Menu - Enhanced with Water Tanker Management
export const employeeMenuItems: MenuItemProps[] = [
  createMenuItem("Employee Dashboard", `${BASE_URLS.employee}/home`, MdDashboard, COLORS.blue),
  
  createMenuItem("Certificate Processing", undefined, MdAssignment, COLORS.red, [
    createMenuItem("My Assignments", undefined, FaChevronCircleRight, COLORS.yellow, [
      createMenuItem("Current Tasks", `${BASE_URLS.employee}/warish/view-assigned`, FaChevronCircleRight, COLORS.yellow),
      createMenuItem("Process Applications", `${BASE_URLS.employee}/warish/process`, FaChevronCircleRight, COLORS.green),
    ]),
    createMenuItem("Documentation", undefined, FaChevronCircleRight, COLORS.teal, [
      createMenuItem("Upload Documents", `${BASE_URLS.employee}/documents/upload`, FaChevronCircleRight, COLORS.blue),
      createMenuItem("Verify Documents", `${BASE_URLS.employee}/warish/verify`, FaChevronCircleRight, COLORS.green),
    ]),
  ]),

  createMenuItem("Work Management", undefined, MdAssignmentTurnedIn, COLORS.cyan, [
    createMenuItem("Tasks", undefined, FaChevronCircleRight, COLORS.blue, [
      createMenuItem("My Tasks", `${BASE_URLS.employee}/tasks`, FaChevronCircleRight, COLORS.blue),
      createMenuItem("Team Tasks", `${BASE_URLS.employee}/tasks/team`, FaChevronCircleRight, COLORS.green),
    ]),
    createMenuItem("Reporting", undefined, FaChevronCircleRight, COLORS.pink, [
      createMenuItem("Daily Reports", `${BASE_URLS.employee}/reports`, FaChevronCircleRight, COLORS.blue),
      createMenuItem("Performance Metrics", `${BASE_URLS.employee}/reports/metrics`, FaChevronCircleRight, COLORS.green),
    ]),
  ]),

  createMenuItem("Personal", undefined, MdPersonAdd, COLORS.purple, [
    createMenuItem("Leave Management", undefined, FaChevronCircleRight, COLORS.pink, [
      createMenuItem("Apply Leave", `${BASE_URLS.employee}/leave/apply`, FaChevronCircleRight, COLORS.blue),
      createMenuItem("Leave Balance", `${BASE_URLS.employee}/leave/balance`, FaChevronCircleRight, COLORS.green),
    ]),
    createMenuItem("Training", undefined, FaChevronCircleRight, COLORS.purple, [
      createMenuItem("Available Courses", `${BASE_URLS.employee}/training/courses`, FaChevronCircleRight, COLORS.blue),
      createMenuItem("My Certifications", `${BASE_URLS.employee}/training/certifications`, FaChevronCircleRight, COLORS.green),
    ]),
  ]),

  // Water Tanker Management (Missing in enhanced version)
  createMenuItem("Water Tanker Management", undefined, FaTruck, COLORS.blue, [
    createMenuItem("Booking Requests", `${BASE_URLS.employee}/water-tanker/booking`, FaChevronCircleRight, COLORS.yellow),
    createMenuItem("Service History", `${BASE_URLS.employee}/water-tanker/history`, FaChevronCircleRight, COLORS.red),
  ]),
];

// Super Admin Menu - Enhanced with Generate API Key
export const superAdminMenuItems: MenuItemProps[] = [
  // Generate API Key (Missing in enhanced version)
  createMenuItem("Generate API Key", `${BASE_URLS.superAdmin}/apiKeyGenerator`, FaKey, COLORS.purple),

  createMenuItem("System Oversight", undefined, MdSettingsApplications, COLORS.gray, [
    createMenuItem("User Management", undefined, FaChevronCircleRight, COLORS.green, [
      createMenuItem("User Accounts", `${BASE_URLS.superAdmin}/user`, FaChevronCircleRight, COLORS.green),
      createMenuItem("Access Controls", `${BASE_URLS.superAdmin}/access-controls`, FaChevronCircleRight, COLORS.indigo),
    ]),
    createMenuItem("Security", undefined, FaChevronCircleRight, COLORS.red, [
      createMenuItem("Audit Logs", `${BASE_URLS.superAdmin}/audit-logs`, FaChevronCircleRight, COLORS.purple),
      createMenuItem("Security Policies", `${BASE_URLS.superAdmin}/security/policies`, FaChevronCircleRight, COLORS.blue),
    ]),
  ]),

  createMenuItem("Infrastructure", undefined, MdCloudUpload, COLORS.blue, [
    createMenuItem("Data Management", undefined, FaChevronCircleRight, COLORS.indigo, [
      createMenuItem("Backup & Restore", `${BASE_URLS.superAdmin}/infrastructure/backup`, FaChevronCircleRight, COLORS.blue),
      createMenuItem("API Management", `${BASE_URLS.superAdmin}/apiKeyGenerator`, FaChevronCircleRight, COLORS.purple),
    ]),
    createMenuItem("Configuration", undefined, FaChevronCircleRight, COLORS.teal, [
      createMenuItem("Environment Settings", `${BASE_URLS.superAdmin}/infrastructure/environment`, FaChevronCircleRight, COLORS.green),
      createMenuItem("System Defaults", `${BASE_URLS.superAdmin}/infrastructure/defaults`, FaChevronCircleRight, COLORS.cyan),
    ]),
  ]),
];
