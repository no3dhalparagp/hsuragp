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

const iconMap: Record<string, IconType> = {
  MdDashboard,
  MdAssessment,
  MdBusinessCenter,
  MdPeople,
  MdMoney,
  MdAssignment,
  MdSettingsCell,
  MdDescription,
  MdDateRange,
  MdAnnouncement,
  MdPersonAdd,
  MdSearch,
  MdFeedback,
  MdLocalLibrary,
  MdPayment,
  MdNotifications,
  MdCalendarToday,
  MdCloudUpload,
  MdApi,
  MdLock,
  MdSettingsApplications,
  MdSchool,
  MdAssignmentTurnedIn,
  MdHolidayVillage,
  MdWork,
  MdListAlt,
  MdAnalytics,
  MdReceipt,
  MdImportantDevices,
  MdBlock,
  FaChevronCircleRight,
  FaChartBar,
  FaChevronDown,
  FaTruck,
  FaKey
};

export function getIconComponent(iconName: string | null): IconType | null {
  return iconName ? iconMap[iconName] || null : null;
} 