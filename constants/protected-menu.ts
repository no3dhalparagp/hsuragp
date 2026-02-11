
import type { IconType } from "react-icons";
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

// Base URL Constants - All roles use unified /dashboard
const BASE_URLS = {
  user: "/dashboard",
  admin: "/dashboard",
  staff: "/dashboard",
  superadmin: "/dashboard",
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
  createMenuItem("Dashboard", ["user"], `${BASE_URLS.user}/home`, MdDashboard, COLORS.blue),
  createMenuItem("Certificate Management", ["user"], undefined, MdDescription, COLORS.red, [
    // Inheritance Certificate (Warish)
    createMenuItem("Inheritance Certificate", ["user"], undefined, FaChevronCircleRight, COLORS.yellow, [
      createMenuItem("Apply for Certificate", ["user"], `${BASE_URLS.user}/warish/apply`, FaChevronCircleRight, COLORS.yellow),
      createMenuItem("Check Status", ["user"], `${BASE_URLS.user}/warish/status`, FaChevronCircleRight, COLORS.blue),
    ]),
    // Land Conversion NOC
    createMenuItem("Land Conversion NOC", ["user"], undefined, FaChevronCircleRight, COLORS.green, [
      createMenuItem("New Application", ["user"], `${BASE_URLS.user}/land-conversion/application`, FaChevronCircleRight, COLORS.green),  
    ]),
     // Linkage Certificate
    createMenuItem("Linkage Certificate", ["user"], undefined, FaChevronCircleRight, COLORS.blue, [
      createMenuItem("Application Portal", ["user"], `${BASE_URLS.user}/linkage/application`, FaChevronCircleRight, COLORS.blue),   
    ]),
    // Common Certificate Functions
    createMenuItem("Certificate Operations", ["user"], undefined, FaChevronCircleRight, COLORS.purple, [
      createMenuItem("Bulk Processing", ["user"], `${BASE_URLS.user}/certificates/bulk`, FaChevronCircleRight, COLORS.cyan),
      
    ]),
    
    // Reports & Analytics
    createMenuItem("Certificate Analytics", ["user"], undefined, FaChartBar, COLORS.teal, [
      createMenuItem("Issuance Reports", ["user"], `${BASE_URLS.user}/analytics/certificates/issuance`, FaChevronCircleRight, COLORS.blue),
     
    ]),
  ]),

  


  createMenuItem("Profile Management", ["user"], undefined, MdPersonAdd, COLORS.purple, [
    createMenuItem("Personal Information", ["user"], undefined, FaChevronCircleRight, COLORS.indigo, [
      createMenuItem("View Profile", ["user"], `${BASE_URLS.user}/profile/view`, FaChevronCircleRight, COLORS.indigo),
      createMenuItem("Edit Profile", ["user"], `${BASE_URLS.user}/profile/edit`, FaChevronCircleRight, COLORS.pink),
    ]),
    createMenuItem("Security", ["user"], undefined, FaChevronCircleRight, COLORS.red, [
      createMenuItem("Change Password", ["user"], `${BASE_URLS.user}/profile/change-password`, FaChevronCircleRight, COLORS.red),
      createMenuItem("Two-Factor Auth", ["user"], `${BASE_URLS.user}/profile/2fa`, FaChevronCircleRight, COLORS.orange),
    ]),
  ]),

  createMenuItem("Financial Services", ["user"], undefined, MdPayment, COLORS.lime, [
    createMenuItem("Payments", ["user"], undefined, FaChevronCircleRight, COLORS.lime, [
      createMenuItem("Payment History", ["user"], `${BASE_URLS.user}/payments/history`, FaChevronCircleRight, COLORS.lime),
      createMenuItem("Payment Methods", ["user"], `${BASE_URLS.user}/payments/methods`, FaChevronCircleRight, COLORS.blue),
    ]),
    createMenuItem("Receipts", ["user"], `${BASE_URLS.user}/payments/receipts`, FaChevronCircleRight, COLORS.green),
  ]),

  createMenuItem("Support Center", ["user"], undefined, MdFeedback, COLORS.orange, [
    createMenuItem("Help Desk", ["user"], undefined, FaChevronCircleRight, COLORS.orange, [
      createMenuItem("Submit Feedback", ["user"], `${BASE_URLS.user}/feedback`, FaChevronCircleRight, COLORS.orange),
      createMenuItem("File Complaint", ["user"], `${BASE_URLS.user}/record-complaint`, FaChevronCircleRight, COLORS.red),
    ]),
    createMenuItem("Knowledge Base", ["user"], undefined, FaChevronCircleRight, COLORS.teal, [
      createMenuItem("FAQs", ["user"], `${BASE_URLS.user}/resources/faqs`, FaChevronCircleRight, COLORS.cyan),
      createMenuItem("User Guides", ["user"], `${BASE_URLS.user}/resources/user-guide`, FaChevronCircleRight, COLORS.blue),
    ]),
  ]),

  createMenuItem("Resources", ["user"], undefined, MdLocalLibrary, COLORS.teal, [
    createMenuItem("Documents", ["user"], `${BASE_URLS.user}/resources/documents`, FaChevronCircleRight, COLORS.teal),
    createMenuItem("Announcements", ["user"], `${BASE_URLS.user}/announcements`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Calendar", ["user"], `${BASE_URLS.user}/calendar`, FaChevronCircleRight, COLORS.red),
  ]),

  createMenuItem("Notifications", ["user"], `${BASE_URLS.user}/notifications`, MdNotifications, COLORS.pink),
];

// Admin Menu
export const adminMenuItems: MenuItemProps[] = [
  createMenuItem("Admin Dashboard", ["admin", "superadmin"], `${BASE_URLS.admin}/home`, MdDashboard, COLORS.blue),
  
  createMenuItem("Meeting Management", ["admin"], undefined, MdDateRange, COLORS.purple, [
    createMenuItem("All Meetings", ["admin"], `${BASE_URLS.admin}/meeting-manage`, MdCalendarToday, COLORS.blue),
    createMenuItem("Schedule Meeting", ["admin"], `${BASE_URLS.admin}/meeting-manage/add-meeting`, MdDateRange, COLORS.green),
    createMenuItem("Meeting Reports", ["admin"], `${BASE_URLS.admin}/meeting-manage/reports`, MdAssessment, COLORS.orange),
  ]),
  
  createMenuItem("Operations Management", ["admin"], undefined, MdWork, COLORS.red, [
    createMenuItem("Action Plans", ["admin"], `${BASE_URLS.admin}/work-manage/view`, FaChevronCircleRight, COLORS.blue),
    createMenuItem("Work Status Tracking", ["admin"], `${BASE_URLS.admin}/manage-tender/work-status-change`, FaChevronCircleRight, COLORS.indigo),
    createMenuItem("Fund Status", ["admin"], `${BASE_URLS.admin}/fundstatus`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Work Details", ["admin"], `${BASE_URLS.admin}/work-manage/scheme-wise`, FaChevronCircleRight, COLORS.red),
  ]),

    createMenuItem("Development Works", ["admin"], undefined, MdAssignmentTurnedIn, COLORS.orange, [
      createMenuItem("Work Estimate & DPR", ["admin"], `${BASE_URLS.admin}/development-works/work-estimate-dpr`, FaChevronCircleRight, COLORS.green),
      createMenuItem("Work Progress Monitoring", ["admin"], `${BASE_URLS.admin}/development-works/progress-monitoring`, FaChevronCircleRight, COLORS.blue),
      createMenuItem("Measurement Book (MB) & Bill Abstract", ["admin"], `${BASE_URLS.admin}/development-works/measurement-book`, FaChevronCircleRight, COLORS.purple),
      createMenuItem("Manage Estimate Types", ["admin"], `${BASE_URLS.admin}/development-works/manage-estimate-types`, FaChevronCircleRight, COLORS.cyan),
    ]),

  createMenuItem("Approved Action Plans", ["admin"], `${BASE_URLS.admin}/approvedactionplan`, MdListAlt, COLORS.green),

  // Enhanced Certificate Management Section
  createMenuItem("Certificate Management", ["admin", "superadmin"], undefined, MdDescription, COLORS.red, [
    // Inheritance Certificate (Warish)
    createMenuItem("Inheritance Certificate", ["admin"], undefined, FaChevronCircleRight, COLORS.yellow, [
      createMenuItem("Application Lifecycle", ["admin"], undefined, FaChevronDown, COLORS.teal, [
        createMenuItem("New Application", ["admin"], `${BASE_URLS.admin}/manage-warish/application`, FaChevronCircleRight, COLORS.teal),
        createMenuItem("Bulk Applications", ["admin"], `${BASE_URLS.admin}/manage-warish/bulk-upload`, FaChevronCircleRight, COLORS.blue),
        createMenuItem("Document Upload", ["admin"], `${BASE_URLS.admin}/manage-warish/pending-uploaddoc`, FaChevronCircleRight, COLORS.teal),
        createMenuItem("Verification", ["admin"], `${BASE_URLS.admin}/manage-warish/verify-document`, FaChevronCircleRight, COLORS.teal),
      ]),
      createMenuItem("Workflow", ["admin"], undefined, FaChevronDown, COLORS.blue, [
        createMenuItem("Assign to Staff", ["admin"], `${BASE_URLS.admin}/manage-warish/assign-staff`, FaChevronCircleRight, COLORS.blue),
        createMenuItem("Public Assignments", ["admin"], `${BASE_URLS.admin}/manage-warish/assign-citizen`, FaChevronCircleRight, COLORS.blue),
        createMenuItem("Approval Process", ["admin"], `${BASE_URLS.admin}/manage-warish/approve`, FaChevronCircleRight, COLORS.blue),
      ]),
      createMenuItem("Output", ["admin"], undefined, FaChevronDown, COLORS.green, [
        createMenuItem("Certificate Printing", ["admin"], `${BASE_URLS.admin}/manage-warish/print`, FaChevronCircleRight, COLORS.green),
        createMenuItem("Generate Certificate", ["admin"], `${BASE_URLS.admin}/manage-warish/generate`, FaChevronCircleRight, COLORS.green),
        createMenuItem("Renewal Processing", ["admin"], `${BASE_URLS.admin}/manage-warish/renew`, FaChevronCircleRight, COLORS.blue),
      ]),
      createMenuItem("Monitoring", ["admin"], undefined, FaChevronDown, COLORS.cyan, [
        createMenuItem("Status Tracking", ["admin"], `${BASE_URLS.admin}/manage-warish/status`, FaChevronCircleRight, COLORS.purple),
        createMenuItem("Performance Metrics", ["admin"], `${BASE_URLS.admin}/manage-warish/metrics`, FaChevronCircleRight, COLORS.orange),
        createMenuItem("Correction Requests", ["admin"], `${BASE_URLS.admin}/manage-warish/correction-requests`, FaChevronCircleRight, COLORS.red),
      ]),
    ]),
    
    // Land Conversion NOC
    createMenuItem("Land Conversion NOC", ["admin"], undefined, FaChevronCircleRight, COLORS.green, [
      createMenuItem("New Application", ["admin"], `${BASE_URLS.admin}/manage-land-conversion/application`, FaChevronCircleRight, COLORS.green),
      createMenuItem("Document Verification", ["admin"], `${BASE_URLS.admin}/manage-land-conversion/verify`, FaChevronCircleRight, COLORS.teal),
      createMenuItem("Site Inspection", ["admin"], `${BASE_URLS.admin}/manage-land-conversion/inspection`, FaChevronCircleRight, COLORS.blue),
      createMenuItem("Approval Workflow", ["admin"], `${BASE_URLS.admin}/manage-land-conversion/approve`, FaChevronCircleRight, COLORS.purple),
      createMenuItem("NOC Issuance", ["admin"], `${BASE_URLS.admin}/manage-land-conversion/issue`, FaChevronCircleRight, COLORS.orange),
      createMenuItem("Compliance Check", ["admin"], `${BASE_URLS.admin}/manage-land-conversion/compliance`, FaChevronCircleRight, COLORS.red),
    ]),
    
    // Linkage Certificate
    createMenuItem("Linkage Certificate", ["admin"], undefined, FaChevronCircleRight, COLORS.blue, [
      createMenuItem("Application Portal", ["admin"], `${BASE_URLS.admin}/manage-linkage/application`, FaChevronCircleRight, COLORS.blue),
      createMenuItem("Document Validation", ["admin"], `${BASE_URLS.admin}/manage-linkage/validate`, FaChevronCircleRight, COLORS.teal),
      createMenuItem("Ownership Verification", ["admin"], `${BASE_URLS.admin}/manage-linkage/ownership`, FaChevronCircleRight, COLORS.green),
      createMenuItem("Certificate Issuance", ["admin"], `${BASE_URLS.admin}/manage-linkage/issue`, FaChevronCircleRight, COLORS.purple),
      createMenuItem("Renewal Process", ["admin"], `${BASE_URLS.admin}/manage-linkage/renew`, FaChevronCircleRight, COLORS.orange),
      createMenuItem("Dispute Resolution", ["admin"], `${BASE_URLS.admin}/manage-linkage/disputes`, FaChevronCircleRight, COLORS.red),
    ]),
    
    // Common Certificate Functions
    createMenuItem("Certificate Operations", ["admin"], undefined, FaChevronCircleRight, COLORS.purple, [
      createMenuItem("Bulk Processing", ["admin"], `${BASE_URLS.admin}/certificates/bulk`, FaChevronCircleRight, COLORS.cyan),
      createMenuItem("Status Tracker", ["admin"], `${BASE_URLS.admin}/certificates/status`, FaChevronCircleRight, COLORS.blue),
      createMenuItem("Certificate Archive", ["admin"], `${BASE_URLS.admin}/certificates/archive`, FaChevronCircleRight, COLORS.green),
      createMenuItem("Renewal Management", ["admin"], `${BASE_URLS.admin}/certificates/renewals`, FaChevronCircleRight, COLORS.orange),
      createMenuItem("Certificate Revocation", ["admin"], `${BASE_URLS.admin}/certificates/revoke`, FaChevronCircleRight, COLORS.red),
    ]),
    
    // Reports & Analytics
    createMenuItem("Certificate Analytics", ["admin"], undefined, FaChartBar, COLORS.teal, [
      createMenuItem("Issuance Reports", ["admin"], `${BASE_URLS.admin}/analytics/certificates/issuance`, FaChevronCircleRight, COLORS.blue),
      createMenuItem("Processing Times", ["admin"], `${BASE_URLS.admin}/analytics/certificates/processing`, FaChevronCircleRight, COLORS.green),
      createMenuItem("Type-wise Distribution", ["admin"], `${BASE_URLS.admin}/analytics/certificates/types`, FaChevronCircleRight, COLORS.purple),
      createMenuItem("Revenue Analysis", ["admin"], `${BASE_URLS.admin}/analytics/certificates/revenue`, FaChevronCircleRight, COLORS.orange),
    ]),
  ]),

   createMenuItem("APA Reports", ["admin"], undefined, FaChevronCircleRight, COLORS.cyan, [
  // Existing report generator
  createMenuItem("Generate APA Report", ["admin"], `${BASE_URLS.admin}/generate-apa-report`, FaChevronCircleRight, COLORS.purple),
  
  // Mandatory Conditions
  createMenuItem("Mandatory Conditions", ["admin"], undefined, FaChevronCircleRight, COLORS.cyan, [
    createMenuItem("APA-MC-1", ["admin"], `${BASE_URLS.admin}/apa-report/APA-MC-1`, FaChevronCircleRight, COLORS.purple),
    createMenuItem("APA-MC-2", ["admin"], `${BASE_URLS.admin}/apa-report/APA-MC-2`, FaChevronCircleRight, COLORS.purple),
    createMenuItem("APA-MC-5", ["admin"], `${BASE_URLS.admin}/apa-report/APA-MC-5`, FaChevronCircleRight, COLORS.purple),
    createMenuItem("APA-MC-6", ["admin"], `${BASE_URLS.admin}/apa-report/APA-MC-6`, FaChevronCircleRight, COLORS.purple)
  ]),
  
  // Theme 1
  createMenuItem("Theme - 1", ["admin"], undefined, FaChevronCircleRight, COLORS.cyan, [
    createMenuItem("APA-TE-1", ["admin"], `${BASE_URLS.admin}/apa-report/APA-TE-1`, FaChevronCircleRight, COLORS.purple),
    createMenuItem("APA-TE-2", ["admin"], `${BASE_URLS.admin}/apa-report/APA-TE-2`, FaChevronCircleRight, COLORS.purple),
    createMenuItem("APA-TE-3", ["admin"], `${BASE_URLS.admin}/apa-report/APA-TE-3`, FaChevronCircleRight, COLORS.purple),
    createMenuItem("APA-TE-4", ["admin"], `${BASE_URLS.admin}/apa-report/APA-TE-4`, FaChevronCircleRight, COLORS.purple)
  ]),
  
  // Theme 2
  createMenuItem("Theme - 2", ["admin"], undefined, FaChevronCircleRight, COLORS.cyan, [
    createMenuItem("APA-TE-5", ["admin"], `${BASE_URLS.admin}/apa-report/APA-TE-5`, FaChevronCircleRight, COLORS.purple),
    createMenuItem("APA-TE-6", ["admin"], `${BASE_URLS.admin}/apa-report/APA-TE-6`, FaChevronCircleRight, COLORS.purple),
    createMenuItem("APA-TE-7", ["admin"], `${BASE_URLS.admin}/apa-report/APA-TE-7`, FaChevronCircleRight, COLORS.purple),
    createMenuItem("APA-TE-8", ["admin"], `${BASE_URLS.admin}/apa-report/APA-TE-8`, FaChevronCircleRight, COLORS.purple),
    createMenuItem("APA-TE-9", ["admin"], `${BASE_URLS.admin}/apa-report/APA-TE-9`, FaChevronCircleRight, COLORS.purple)
  ]),
  
  // Theme 3
  createMenuItem("Theme - 3", ["admin"], undefined, FaChevronCircleRight, COLORS.cyan, [
    createMenuItem("APA-TE-10", ["admin"], `${BASE_URLS.admin}/apa-report/APA-TE-10`, FaChevronCircleRight, COLORS.purple),
    createMenuItem("APA-TE-11", ["admin"], `${BASE_URLS.admin}/apa-report/APA-TE-11`, FaChevronCircleRight, COLORS.purple),
    createMenuItem("APA-TE-13", ["admin"], `${BASE_URLS.admin}/apa-report/APA-TE-13`, FaChevronCircleRight, COLORS.purple),
    createMenuItem("APA-TE-14", ["admin"], `${BASE_URLS.admin}/apa-report/APA-TE-14`, FaChevronCircleRight, COLORS.purple)
  ]),
  
  // Theme 4
  createMenuItem("Theme - 4", ["admin"], undefined, FaChevronCircleRight, COLORS.cyan, [
    createMenuItem("APA-TE-16", ["admin"], `${BASE_URLS.admin}/apa-report/APA-TE-16`, FaChevronCircleRight, COLORS.purple),
    createMenuItem("APA-TE-17", ["admin"], `${BASE_URLS.admin}/apa-report/APA-TE-17`, FaChevronCircleRight, COLORS.purple),
    createMenuItem("APA-TE-19", ["admin"], `${BASE_URLS.admin}/apa-report/APA-TE-19`, FaChevronCircleRight, COLORS.purple),
    createMenuItem("APA-TE-20", ["admin"], `${BASE_URLS.admin}/apa-report/APA-TE-20`, FaChevronCircleRight, COLORS.purple)
  ])
]),
  
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
      createMenuItem("Active Tenders", ["admin"], `${BASE_URLS.admin}/manage-tender/view`, FaChevronCircleRight, COLORS.green),
      createMenuItem("Terms Management", ["admin"], undefined, FaChevronDown, COLORS.orange, [
        createMenuItem("Manage Terms", ["admin"], `${BASE_URLS.admin}/manage-tender/manage-terms`, FaChevronCircleRight, COLORS.orange),
        createMenuItem("Add New Term", ["admin"], `${BASE_URLS.admin}/manage-tender/add-terms`, FaChevronCircleRight, COLORS.blue),
      ]),
    ]),
  
    createMenuItem("Bid Processing", ["admin"], undefined, FaChevronCircleRight, COLORS.yellow, [
      createMenuItem("Bid Evaluation", ["admin"], undefined, FaChevronDown, COLORS.orange, [
        createMenuItem("Technical Evaluation", ["admin"], `${BASE_URLS.admin}/manage-tender/addtechnicaldetails`, FaChevronCircleRight, COLORS.teal),
        createMenuItem("Financial Evaluation", ["admin"], `${BASE_URLS.admin}/manage-tender/addfinanicaldetails`, FaChevronCircleRight, COLORS.red),
        createMenuItem("Financial Bid Modification", ["admin"], `${BASE_URLS.admin}/manage-tender/addfinanicaldetails/modify`, FaChevronCircleRight, COLORS.red),
      ]),
      createMenuItem("Bidder Management", ["admin"], `${BASE_URLS.admin}/manage-tender/addbidderdetails`, FaChevronCircleRight, COLORS.yellow),
    ]),
    createMenuItem("Contract Management", ["admin"], undefined, FaChevronCircleRight, COLORS.indigo, [
        createMenuItem("Award Process", ["admin"], undefined, FaChevronDown, COLORS.red, [
        createMenuItem("Work Orders", ["admin"], `${BASE_URLS.admin}/manage-tender/workorderdetails`, FaChevronCircleRight, COLORS.red),
        createMenuItem("Contract Awards", ["admin"], `${BASE_URLS.admin}/manage-tender/awardofcontract`, FaChevronCircleRight, COLORS.indigo),
        createMenuItem("Awards Status", ["admin"], `${BASE_URLS.admin}/manage-tender/workorder-status`, FaChevronCircleRight, COLORS.indigo),
        
        
      ]),
      createMenuItem("Modifications", ["admin"], undefined, FaChevronDown, COLORS.pink, [
        createMenuItem("Tender Edits", ["admin"], `${BASE_URLS.admin}/manage-tender/edit`, FaChevronCircleRight, COLORS.orange),
        createMenuItem("Tender Cancellations", ["admin"], `${BASE_URLS.admin}/manage-tender/cancel-tender`, FaChevronCircleRight, COLORS.red),
        createMenuItem("Tender Corrigendum", ["admin"], `${BASE_URLS.admin}/manage-tender/corrigendum`, FaChevronCircleRight, COLORS.cyan),
        createMenuItem("Work Order Modification", ["admin"], `${BASE_URLS.admin}/manage-tender/workorder-modification`, FaChevronCircleRight, COLORS.indigo),
      ]),
    ]),
  ]),
  
  createMenuItem("Quotation Management", ["admin"], undefined, FaChevronCircleRight, COLORS.green, [
    createMenuItem("Create Quotation", ["admin"], `${BASE_URLS.admin}/manage-qatation/create`, FaChevronCircleRight, COLORS.blue),
    createMenuItem("View Quotations", ["admin"], `${BASE_URLS.admin}/manage-qatation/view`, FaChevronCircleRight, COLORS.green),
    createMenuItem("Publish Quotations", ["admin"], `${BASE_URLS.admin}/manage-qatation/publish`, FaChevronCircleRight, COLORS.purple),
    createMenuItem("Comparative Statements", ["admin"], `${BASE_URLS.admin}/manage-qatation/comparative-statement`, FaChevronCircleRight, COLORS.purple),
    createMenuItem("Bidder Management", ["admin"], `${BASE_URLS.admin}/manage-qatation/bidders`, FaChevronCircleRight, COLORS.purple),
    createMenuItem("Published Quotations", ["admin"], `${BASE_URLS.admin}/manage-qatation/published`, FaChevronCircleRight, COLORS.blue),
    createMenuItem("Order Management", ["admin"], `${BASE_URLS.admin}/manage-qatation/orders`, FaChevronCircleRight, COLORS.blue),
    createMenuItem("Quotation Reports", ["admin"], `${BASE_URLS.admin}/manage-qatation/reports`, FaChevronCircleRight, COLORS.orange),
    createMenuItem("Payment Processing", ["admin"], `${BASE_URLS.admin}/manage-qatation/payment`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Vendor Relations", ["admin"], `${BASE_URLS.admin}/manage-qatation/vendor`, FaChevronCircleRight, COLORS.green),
    createMenuItem("Quotation Status", ["admin"], `${BASE_URLS.admin}/manage-qatation/status`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Quotation Analytics", ["admin"], `${BASE_URLS.admin}/manage-qatation/analytics`, FaChevronCircleRight, COLORS.purple),
    createMenuItem("Print Quotations", ["admin"], `${BASE_URLS.admin}/manage-qatation/orders/print-menu`, FaChevronCircleRight, COLORS.green),
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

    createMenuItem("Comparative Statement", ["admin"], `${BASE_URLS.admin}/generate/comparative-statement`, FaChevronCircleRight, COLORS.red),  
    createMenuItem("Work Orders", ["admin"], `${BASE_URLS.admin}/generate/work-order`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Supply Orders", ["admin"], `${BASE_URLS.admin}/generate/supply-order`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Payment Certificates", ["admin"], `${BASE_URLS.admin}/generate/payment-certificate`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Completion Certificates", ["admin"], `${BASE_URLS.admin}/generate/completation-certificate`, FaChevronCircleRight, COLORS.red),
    createMenuItem("FY Completion Reports", ["admin"], `${BASE_URLS.admin}/generate/completation-certificate2`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Bulk Work Orders", ["admin"], `${BASE_URLS.admin}/generate/bulk-work-order`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Document Covers", ["admin"], `${BASE_URLS.admin}/generate/cover-page`, FaChevronCircleRight, COLORS.red),
    createMenuItem("generateAOC" , ["admin"], `${BASE_URLS.admin}/generate/generateAOC`, FaChevronCircleRight, COLORS.orange),
    createMenuItem("Bulk Scrutinee Sheet", ["admin"], `${BASE_URLS.admin}/generate/bulk-scrutee-sheet`, FaChevronCircleRight, COLORS.red),
    // New NOC for Puja/Festival generation page
    createMenuItem("Puja/Festival NOC", ["admin"], `${BASE_URLS.admin}/generate/puja-noc`, FaChevronCircleRight, COLORS.green),
  ]),

  createMenuItem("Reports & Analytics", ["admin"], undefined, MdAnalytics, COLORS.blue, [
    createMenuItem("Financial Reports", ["admin"], undefined, FaChartBar, COLORS.green, [
      createMenuItem("Budget Analysis", ["admin"], `${BASE_URLS.admin}/reports/budget`, FaChevronCircleRight, COLORS.blue),
      createMenuItem("Expenditure Summary", ["admin"], `${BASE_URLS.admin}/reports/expenditure`, FaChevronCircleRight, COLORS.green),
    ]),
    createMenuItem("Performance Metrics", ["admin"], `${BASE_URLS.admin}/reports/performance`, FaChevronCircleRight, COLORS.purple),
    createMenuItem("Other Reports", ["admin"], `${BASE_URLS.admin}/reports`, FaChevronCircleRight, COLORS.indigo),
  ]),

  createMenuItem("Notice Management", ["admin"], undefined, MdAnnouncement, COLORS.indigo, [
    createMenuItem("Create Notice", ["admin"], `${BASE_URLS.admin}/notice/add`, FaChevronCircleRight, COLORS.cyan),
    createMenuItem("View Notices", ["admin"], `${BASE_URLS.admin}/notice/view`, FaChevronCircleRight, COLORS.cyan),
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

  createMenuItem("Village Management", ["admin"], undefined, MdHolidayVillage, COLORS.cyan, [
    createMenuItem("Add Villages", ["admin"], `${BASE_URLS.admin}/manage-villages/add-village`, FaChevronCircleRight, COLORS.cyan),
    createMenuItem("View Villages", ["admin"], `${BASE_URLS.admin}/manage-villages/view`, FaChevronCircleRight, COLORS.cyan),
    createMenuItem("Village Population", ["admin"], `${BASE_URLS.admin}/manage-villages/population`, FaChevronCircleRight, COLORS.cyan),
    createMenuItem("Village Education", ["admin"], `${BASE_URLS.admin}/manage-villages/education`, FaChevronCircleRight, COLORS.cyan),
    createMenuItem("Village Infrastructure", ["admin"], `${BASE_URLS.admin}/manage-villages/infrastructure`, FaChevronCircleRight, COLORS.cyan),
    createMenuItem("Village Health", ["admin"], `${BASE_URLS.admin}/manage-villages/health`, FaChevronCircleRight, COLORS.cyan),
    createMenuItem("Village Agriculture", ["admin"], `${BASE_URLS.admin}/manage-villages/agriculture`, FaChevronCircleRight, COLORS.cyan),
  ]),

  createMenuItem("Water Tanker Management", ["admin"], undefined, FaTruck, COLORS.blue, [
    createMenuItem("Service Fee Management", ["admin"], `${BASE_URLS.admin}/water-tanker/fees`, FaChevronCircleRight, COLORS.green),
    createMenuItem("Tanker Scheduling", ["admin"], `${BASE_URLS.admin}/water-tanker/schedule`, FaChevronCircleRight, COLORS.yellow),
    createMenuItem("Tanker Requests", ["admin"], `${BASE_URLS.admin}/water-tanker/requests`, FaChevronCircleRight, COLORS.red),
    createMenuItem("Tanker Maintenance", ["admin"], `${BASE_URLS.admin}/water-tanker/availability`, FaChevronCircleRight, COLORS.purple),
  ]),

//contractor  , print contactor prayer
          createMenuItem("Print Contractor Prayer", ["admin"], `${BASE_URLS.admin}/contractor/print-prayer`, FaChevronCircleRight, COLORS.blue, ),
];

// Staff Menu
export const employeeMenuItems: MenuItemProps[] = [
  createMenuItem("Staff Dashboard", ["staff", "superadmin"], `${BASE_URLS.staff}/home`, MdDashboard, COLORS.blue),
  
  createMenuItem("Certificate Processing", ["staff"], undefined, MdAssignment, COLORS.red, [
    createMenuItem("My Assignments", ["staff"], undefined, FaChevronCircleRight, COLORS.yellow, [
      createMenuItem("Current Tasks", ["staff"], `${BASE_URLS.staff}/warish/view-assigned`, FaChevronCircleRight, COLORS.yellow),
      createMenuItem("Process Applications", ["staff"], `${BASE_URLS.staff}/warish/process`, FaChevronCircleRight, COLORS.green),
    ]),
    createMenuItem("Documentation", ["staff"], undefined, FaChevronCircleRight, COLORS.teal, [
      createMenuItem("Upload Documents", ["staff"], `${BASE_URLS.staff}/documents/upload`, FaChevronCircleRight, COLORS.blue),
      createMenuItem("Verify Documents", ["staff"], `${BASE_URLS.staff}/warish/verify`, FaChevronCircleRight, COLORS.green),
      createMenuItem("Apply Corrections", ["staff"], `${BASE_URLS.staff}/warish/apply-correction`, FaChevronCircleRight, COLORS.red),
    ]),
  ]),
  

  createMenuItem("Work Management", ["staff"], undefined, MdAssignmentTurnedIn, COLORS.cyan, [
    createMenuItem("Tasks", ["staff"], undefined, FaChevronCircleRight, COLORS.blue, [
      createMenuItem("My Tasks", ["staff"], `${BASE_URLS.staff}/tasks`, FaChevronCircleRight, COLORS.blue),
      createMenuItem("Team Tasks", ["staff"], `${BASE_URLS.staff}/tasks/team`, FaChevronCircleRight, COLORS.green),
    ]),
    createMenuItem("Reporting", ["staff"], undefined, FaChevronCircleRight, COLORS.pink, [
      createMenuItem("Daily Reports", ["staff"], `${BASE_URLS.staff}/reports`, FaChevronCircleRight, COLORS.blue),
      createMenuItem("Performance Metrics", ["staff"], `${BASE_URLS.staff}/reports/metrics`, FaChevronCircleRight, COLORS.green),
    ]),
  ]),
createMenuItem("Enquiry Report", ["staff"], `${BASE_URLS.staff}/enquiry-report`, FaChevronCircleRight, COLORS.blue),
  
  createMenuItem("Personal", ["staff"], undefined, MdPersonAdd, COLORS.purple, [
    createMenuItem("Leave Management", ["staff"], undefined, FaChevronCircleRight, COLORS.pink, [
      createMenuItem("Apply Leave", ["staff"], `${BASE_URLS.staff}/leave/apply`, FaChevronCircleRight, COLORS.blue),
      createMenuItem("Leave Balance", ["staff"], `${BASE_URLS.staff}/leave/balance`, FaChevronCircleRight, COLORS.green),
    ]),
    createMenuItem("Training", ["staff"], undefined, FaChevronCircleRight, COLORS.purple, [
      createMenuItem("Available Courses", ["staff"], `${BASE_URLS.staff}/training/courses`, FaChevronCircleRight, COLORS.blue),
      createMenuItem("My Certifications", ["staff"], `${BASE_URLS.staff}/training/certifications`, FaChevronCircleRight, COLORS.green),
    ]),
  ]),

  createMenuItem("Water Tanker Management", ["staff"], undefined, FaTruck, COLORS.blue, [
    createMenuItem("Booking Requests", ["staff"], `${BASE_URLS.staff}/water-tanker/booking`, FaChevronCircleRight, COLORS.yellow),
    createMenuItem("Service History", ["staff"], `${BASE_URLS.staff}/water-tanker/history`, FaChevronCircleRight, COLORS.red),
  ]),
];

// Super Admin Menu
export const superAdminMenuItems: MenuItemProps[] = [
  createMenuItem("Generate API Key", ["superadmin"], `${BASE_URLS.superadmin}/apiKeyGenerator`, FaKey, COLORS.purple),

  createMenuItem("GP Management", ["superadmin"], undefined, MdHolidayVillage, COLORS.green, [
    createMenuItem("All GP Accounts", ["superadmin"], `${BASE_URLS.superadmin}/gp-management`, FaChevronCircleRight, COLORS.blue),
    createMenuItem("Create GP Account", ["superadmin"], `${BASE_URLS.superadmin}/gp-management/create`, FaChevronCircleRight, COLORS.green),
  ]),

  createMenuItem("GP Admin Users", ["superadmin"], undefined, MdPeople, COLORS.blue, [
    createMenuItem("All GP Admins", ["superadmin"], `${BASE_URLS.superadmin}/gp-admin-users`, FaChevronCircleRight, COLORS.blue),
    createMenuItem("Create GP Admin", ["superadmin"], `${BASE_URLS.superadmin}/gp-admin-users/create`, FaChevronCircleRight, COLORS.green),
  ]),

  createMenuItem("System Oversight", ["superadmin"], undefined, MdSettingsApplications, COLORS.gray, [
    createMenuItem("User Management", ["superadmin"], undefined, FaChevronCircleRight, COLORS.green, [
      createMenuItem("User Accounts", ["superadmin"], `${BASE_URLS.superadmin}/user`, FaChevronCircleRight, COLORS.green),
      createMenuItem("Access Controls", ["superadmin"], `${BASE_URLS.superadmin}/access-controls`, FaChevronCircleRight, COLORS.indigo),
    ]),
    createMenuItem("Security", ["superadmin"], undefined, FaChevronCircleRight, COLORS.red, [
      createMenuItem("Audit Logs", ["superadmin"], `${BASE_URLS.superadmin}/audit-logs`, FaChevronCircleRight, COLORS.purple),
      createMenuItem("Security Policies", ["superadmin"], `${BASE_URLS.superadmin}/security/policies`, FaChevronCircleRight, COLORS.blue),
    ]),
  ]),

  createMenuItem("Infrastructure", ["superadmin"], undefined, MdCloudUpload, COLORS.blue, [
    createMenuItem("Data Management", ["superadmin"], undefined, FaChevronCircleRight, COLORS.indigo, [
      createMenuItem("Backup & Restore", ["superadmin"], `${BASE_URLS.superadmin}/infrastructure/backup`, FaChevronCircleRight, COLORS.blue),
      createMenuItem("API Management", ["superadmin"], `${BASE_URLS.superadmin}/apiKeyGenerator`, FaChevronCircleRight, COLORS.purple),
    ]),
    createMenuItem("Configuration", ["superadmin"], undefined, FaChevronCircleRight, COLORS.teal, [
      createMenuItem("Environment Settings", ["superadmin"], `${BASE_URLS.superadmin}/infrastructure/environment`, FaChevronCircleRight, COLORS.green),
      createMenuItem("System Defaults", ["superadmin"], `${BASE_URLS.superadmin}/infrastructure/defaults`, FaChevronCircleRight, COLORS.cyan),
    ]),
  ]),
  
  createMenuItem("Menu Access Control", ["superadmin"], undefined, MdCloudUpload, COLORS.yellow, [
    createMenuItem("Public User Menu", ["superadmin"], `${BASE_URLS.superadmin}/menu-acces-control/publicuser`, FaChevronCircleRight, COLORS.blue),
    createMenuItem("Employee Menu", ["superadmin"], `${BASE_URLS.superadmin}/menu-acces-control/employeeuser`, FaChevronCircleRight, COLORS.purple),
    createMenuItem("Admin Menu", ["superadmin"], `${BASE_URLS.superadmin}/menu-acces-control/adminuser`, FaChevronCircleRight, COLORS.purple),
  ])
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
