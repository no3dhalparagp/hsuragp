"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { PanchayatwebsidemenuProps } from "@/constants";

// Submenu Component
export const PublicSubmenuItem = ({
  submenus,
  showSubMenu,
}: {
  submenus: PanchayatwebsidemenuProps[];
  showSubMenu: boolean;
}) => {
  return (
    <ul
      className={`ml-4 mt-1 space-y-1 transition-all duration-300 ease-in-out ${showSubMenu ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
    >
      {submenus.map((submenuitem, subindex) => (
        <PublicMenuItem items={submenuitem} key={subindex} />
      ))}
    </ul>
  );
};

// Main Menu Item Component
export const PublicMenuItem = ({ items }: { items: PanchayatwebsidemenuProps }) => {
  const [showSubMenu, setShowSubMenu] = useState<boolean>(false);
  const pathname = usePathname();

  const toggleSubMenu = () => {
    setShowSubMenu((prev) => !prev);
  };

  return (
    <li className="p-2 border-b border-dashed border-gray-300 hover:bg-blue-600 transition-colors duration-200 ease-in-out">
      {items.submenu ? (
        <div>
          <button
            className="flex justify-between  w-full text-left"
            onClick={toggleSubMenu}
          >
            <span className="text-sm font-medium text-white">{items.menuItemText}</span>
            <svg
              className={`w-4 h-4 text-white transition-transform transform ${showSubMenu ? "rotate-90" : ""
                }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          {/* Render the submenu items if submenu exists */}
          <PublicSubmenuItem submenus={items.subMenuItems} showSubMenu={showSubMenu} />
        </div>
      ) : (
        <Link href={items.menuItemLink || ""}>
          <div
            className={`flex items-center gap-2 cursor-pointer ${pathname === items.menuItemLink ? "bg-blue-500" : ""
              }`}
          >
            <span
              className={`text-sm font-medium text-white ${pathname === items.menuItemLink ? "underline" : ""
                }`}
            >
              {items.menuItemText}
            </span>
          </div>
        </Link>
      )}
    </li>
  );
};
