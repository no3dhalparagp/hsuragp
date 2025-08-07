
import { IconType } from "react-icons/lib";
import {
  MdDashboard, MdAssessment, MdBusinessCenter, MdPeople, MdMoney,
  MdAssignment, MdSettingsCell, MdDescription, MdDateRange, MdAnnouncement,
  MdPersonAdd, MdSearch, MdFeedback, MdLocalLibrary, MdPayment,
  MdNotifications, MdCalendarToday, MdCloudUpload, MdApi, MdLock,
  MdSettingsApplications, MdSchool, MdAssignmentTurnedIn, MdHolidayVillage,
  MdWork, MdListAlt, MdAnalytics, MdReceipt, MdImportantDevices, MdBlock
} from "react-icons/md";
import { FaChevronCircleRight, FaChartBar, FaChevronDown, FaTruck, FaKey, FaMeetup } from "react-icons/fa";

// Type Definition with allowedRoles
export type MenuItemProps = {
  menuItemText: string;
  menuItemLink?: string;
  Icon?: IconType;
  color?: string;
  submenu: boolean;
  subMenuItems: MenuItemProps[];
  allowedRoles: ("user" | "admin" | "staff" | "superadmin")[];
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
  staff: "/employeedashboard",
  superadmin: "/superadmindashboard",
};

// Enhanced helper to create menu items with allowedRoles
const createMenuItem = (
  text: string,
  roles: ("user" | "admin" | "staff" | "superadmin")[],
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
  createMenuItem("Dashboard", ["user"], `${BASE_URLS.user}/home`, MdDashboard, COLORS.blue)
];

// Admin Menu
export const adminMenuItems: MenuItemProps[] = [
  createMenuItem("Admin Dashboard", ["admin", "superadmin"], `${BASE_URLS.admin}/home`, MdDashboard, COLORS.blue),
  createMenuItem("Operations Management", ["admin"], undefined, MdWork, COLORS.red, [
    createMenuItem("Action Plans", ["admin"], `${BASE_URLS.admin}/work-manage/view`, FaChevronCircleRight, COLORS.blue),
    createMenuItem("Work Status Tracking", ["admin"], `${BASE_URLS.admin}/manage-tender/work-status-change`, FaChevronCircleRight, COLORS.indigo),
    createMenuItem("Fund Status", ["admin"], `${BASE_URLS.admin}/fundstatus`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Work Details", ["admin"], `${BASE_URLS.admin}/work-manage/scheme-wise`, FaChevronCircleRight, COLORS.red),
  ]),

  createMenuItem("Approved Action Plans", ["admin"], `${BASE_URLS.admin}/approvedactionplan`, MdListAlt, COLORS.green),
  createMenuItem("Vendor Management", ["admin"], undefined, MdPeople, COLORS.red, [
    createMenuItem("Vendor Registration", ["admin"], `${BASE_URLS.admin}/manage-vendor/registration`, MdPersonAdd, COLORS.blue),
    createMenuItem("Vendor Directory", ["admin"], `${BASE_URLS.admin}/manage-vendor/view`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Bulk Vendor Upload", ["admin"], `${BASE_URLS.admin}/manage-vendor/bulk-upload`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Vendor Analytics", ["admin"], undefined, FaChartBar, COLORS.teal, [
      createMenuItem("Bid Participation Summary", ["admin"], `${BASE_URLS.admin}/reports/vendor-participation`, FaChevronCircleRight, COLORS.blue),
      createMenuItem("Earnest Money Status", ["admin"], `${BASE_URLS.admin}/reports/earnest-money`, FaChevronCircleRight, COLORS.green),
      createMenuItem("Technical Compliance", ["admin"], `${BASE_URLS.admin}/reports/technical-compliance`, FaChevronCircleRight, COLORS.purple),
    ]),
  ]),

  createMenuItem("Procurement Management", ["admin"], undefined, MdBusinessCenter, COLORS.purple, [
    createMenuItem("Tender Management", ["admin"], undefined, FaChevronCircleRight, COLORS.green, [
      createMenuItem("Tender Creation", ["admin"], undefined, FaChevronDown, COLORS.teal, [
        createMenuItem("Create New Tender", ["admin"], `${BASE_URLS.admin}/manage-tender/add`, FaChevronCircleRight, COLORS.green),
        createMenuItem("Tender Templates", ["admin"], `${BASE_URLS.admin}/manage-tender/templates`, FaChevronCircleRight, COLORS.blue),
      ]),
      createMenuItem("Active Tenders", ["admin"], `${BASE_URLS.admin}/manage-tender/open`, FaChevronCircleRight, COLORS.green),
    ]),
  
    createMenuItem("Bid Processing", ["admin"], undefined, FaChevronCircleRight, COLORS.yellow, [
      createMenuItem("Bid Evaluation", ["admin"], undefined, FaChevronDown, COLORS.orange, [
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
        createMenuItem("Tender Cancellations", ["admin"], `${BASE_URLS.admin}/manage-tender/cancel-tender`, FaChevronCircleRight, COLORS.red),
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
    createMenuItem("Bulk Work Orders", ["admin"], `${BASE_URLS.admin}/generate/bulk-work-order`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Document Covers", ["admin"], `${BASE_URLS.admin}/generate/cover-page`, FaChevronCircleRight, COLORS.red),
    createMenuItem("generateAOC" , ["admin"], `${BASE_URLS.admin}/generate/generateAOC`, FaChevronCircleRight, COLORS.orange),
    createMenuItem("Bulk Scrutinee Sheet", ["admin"], `${BASE_URLS.admin}/generate/bulk-scrutee-sheet`, FaChevronCircleRight, COLORS.red)
  ]),

  

  createMenuItem("System Administration", ["admin", "superadmin"], undefined, MdSettingsApplications, COLORS.gray, [
    createMenuItem("User Management", ["admin", "superadmin"], undefined, FaChevronCircleRight, COLORS.green, [
      createMenuItem("User Accounts", ["admin", "superadmin"], undefined, FaChevronDown, COLORS.blue, [
        createMenuItem("Create User", ["admin", "superadmin"], `${BASE_URLS.admin}/user/add`, FaChevronCircleRight, COLORS.green),
        createMenuItem("Modify User", ["admin", "superadmin"], `${BASE_URLS.admin}/user/edit`, FaChevronCircleRight, COLORS.red),
      ]),
      createMenuItem("Directories", ["admin", "superadmin"], undefined, FaChevronDown, COLORS.purple, [
        createMenuItem("User Directory", ["admin", "superadmin"], `${BASE_URLS.admin}/user`, FaChevronCircleRight, COLORS.green),
        createMenuItem("Staff Directory", ["admin", "superadmin"], `${BASE_URLS.admin}/staff`, FaChevronCircleRight, COLORS.red),
      ]),
      createMenuItem("Personnel Directory", ["admin", "superadmin"], `${BASE_URLS.admin}/viewmenberdetails`, FaChevronCircleRight, COLORS.purple),
    ]),
    createMenuItem("System Configuration", ["admin", "superadmin"], undefined, FaChevronCircleRight, COLORS.red, [
      createMenuItem("Services", ["admin", "superadmin"], undefined, FaChevronDown, COLORS.purple, [
        createMenuItem("Email Services", ["admin", "superadmin"], `${BASE_URLS.admin}/master/utils/emails-service`, FaChevronCircleRight, COLORS.purple),
        createMenuItem("Notifications", ["admin", "superadmin"], `${BASE_URLS.admin}/master/utils/notifications`, FaChevronCircleRight, COLORS.purple),
      ]),
      createMenuItem("Content", ["admin", "superadmin"], undefined, FaChevronDown, COLORS.teal, [
        createMenuItem("System Messages", ["admin", "superadmin"], `${BASE_URLS.admin}/master/addimpsmessage`, FaChevronCircleRight, COLORS.green),
        createMenuItem("Forms Repository", ["admin", "superadmin"], `${BASE_URLS.admin}/master/uploadform`, FaChevronCircleRight, COLORS.green),
      ]),
      createMenuItem("Work Item Catalog", ["admin", "superadmin"], `${BASE_URLS.admin}/master/addworkitems`, FaChevronCircleRight, COLORS.green),
    ]),
    createMenuItem("Monitoring", ["admin", "superadmin"], undefined, FaChevronCircleRight, COLORS.cyan, [
      createMenuItem("Audit Logs", ["admin", "superadmin"], `${BASE_URLS.admin}/monitoring/audit-logs`, FaChevronCircleRight, COLORS.gray),
      createMenuItem("System Health", ["admin", "superadmin"], `${BASE_URLS.admin}/monitoring/health`, FaChevronCircleRight, COLORS.green),
    ]),
  ]),

  createMenuItem("System Integrations", ["admin", "superadmin"], undefined, MdImportantDevices, COLORS.indigo, [
    createMenuItem("Payment Gateways", ["admin", "superadmin"], `${BASE_URLS.admin}/integrations/payments`, FaChevronCircleRight, COLORS.green),
    createMenuItem("API Management", ["admin", "superadmin"], `${BASE_URLS.admin}/integrations/api`, FaChevronCircleRight, COLORS.red),
  ]),
];

// Staff Menu
export const employeeMenuItems: MenuItemProps[] = [
  createMenuItem("Staff Dashboard", ["staff", "superadmin"], `${BASE_URLS.staff}/home`, MdDashboard, COLORS.blue)
];

// Super Admin Menu
export const superAdminMenuItems: MenuItemProps[] = [
  createMenuItem("Generate API Key", ["superadmin"], `${BASE_URLS.superadmin}/apiKeyGenerator`, FaKey, COLORS.purple)
];

// Utility function to check if item is restricted for current role
export const isRestrictedForRole = (
  item: MenuItemProps,
  currentRole: "user" | "admin" | "staff" | "superadmin"
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
