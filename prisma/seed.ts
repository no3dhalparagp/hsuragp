import { PrismaClient, Role } from '@prisma/client';
import {
  publicUserMenuItems,
  adminMenuItems,
  employeeMenuItems,
  superAdminMenuItems,
} from '../constants/protected-menu';

const prisma = new PrismaClient();

// Utility to extract icon name from React component
function getIconName(icon: any): string | null {
  if (!icon) return null;
  return icon.displayName || icon.name || null;
}

// Recursive function to create menu hierarchy
async function createMenuItems(
  items: any[],
  parentId: string | null = null
): Promise<string[]> {
  const itemIds: string[] = [];
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const menuItem = await prisma.menuItem.create({
      data: {
        text: item.menuItemText,
        link: item.menuItemLink,
        icon: getIconName(item.Icon),
        color: item.color,
        order: i,
        parentId: parentId,
        allowedRoles: item.allowedRoles as Role[],
      },
    });

    itemIds.push(menuItem.id);

    if (item.subMenuItems && item.subMenuItems.length > 0) {
      const childIds = await createMenuItems(item.subMenuItems, menuItem.id);
      await prisma.menuItem.update({
        where: { id: menuItem.id },
        data: { children: { connect: childIds.map(id => ({ id })) } }
      });
    }
  }
  
  return itemIds;
}

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.menuConfiguration.deleteMany({});
  await prisma.menuItem.deleteMany({});
  console.log('🧹 Cleared existing menu data');

  // Seed menus for each role
  const publicIds = await createMenuItems(publicUserMenuItems);
  await prisma.menuConfiguration.create({
    data: {
      role: Role.PUBLIC,
      menuItems: { connect: publicIds.map(id => ({ id })) }
    }
  });
  console.log('✅ Public user menu created');

  const adminIds = await createMenuItems(adminMenuItems);
  await prisma.menuConfiguration.create({
    data: {
      role: Role.ADMIN,
      menuItems: { connect: adminIds.map(id => ({ id })) }
    }
  });
  console.log('✅ Admin menu created');

  const employeeIds = await createMenuItems(employeeMenuItems);
  await prisma.menuConfiguration.create({
    data: {
      role: Role.EMPLOYEE,
      menuItems: { connect: employeeIds.map(id => ({ id })) }
    }
  });
  console.log('✅ Employee menu created');

  const superAdminIds = await createMenuItems(superAdminMenuItems);
  await prisma.menuConfiguration.create({
    data: {
      role: Role.SUPERADMIN,
      menuItems: { connect: superAdminIds.map(id => ({ id })) }
    }
  });
  console.log('✅ Super Admin menu created');

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 