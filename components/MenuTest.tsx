"use client";

import { useQuery } from "@tanstack/react-query";
import { Role } from "@prisma/client";

type MenuItemData = {
  id: string;
  text: string;
  link?: string;
  icon?: string;
  color?: string;
  children: MenuItemData[];
  allowedRoles: Role[];
};

async function fetchMenu(role: Role): Promise<MenuItemData[]> {
  const res = await fetch('/api/menu');
  if (!res.ok) throw new Error('Failed to fetch menu');
  return res.json();
}

export default function MenuTest({ role = Role.PUBLIC }: { role?: Role }) {
  const { data: menuItems, isLoading, isError, error } = useQuery<MenuItemData[]>({
    queryKey: ['menu', role],
    queryFn: () => fetchMenu(role),
    staleTime: 60 * 60 * 1000
  });

  if (isLoading) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Menu Test - {role}</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <p className="mt-2 text-sm text-muted-foreground">Loading menu data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Menu Test - {role}</h2>
        <div className="text-red-500 p-4 border border-red-200 rounded-lg">
          <p className="font-semibold">Error loading menu:</p>
          <p className="text-sm mt-1">{error?.message}</p>
        </div>
      </div>
    );
  }

  const renderMenuItem = (item: MenuItemData, level = 0) => (
    <div key={item.id} className="ml-4">
      <div className="flex items-center gap-2 py-1">
        <span className="text-sm font-medium">{item.text}</span>
        {item.link && (
          <span className="text-xs text-muted-foreground">→ {item.link}</span>
        )}
        {item.icon && (
          <span className="text-xs text-blue-500">[{item.icon}]</span>
        )}
        <span className="text-xs text-green-500">
          Roles: {item.allowedRoles.join(', ')}
        </span>
      </div>
      {item.children && item.children.length > 0 && (
        <div className="ml-4">
          {item.children.map(child => renderMenuItem(child, level + 1))}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Menu Test - {role}</h2>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground mb-4">
          Found {menuItems?.length || 0} menu items for role: {role}
        </p>
        {menuItems?.map(item => renderMenuItem(item))}
      </div>
    </div>
  );
} 