import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.role) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userRole = session.user.role as UserRole;
    
    // Fetch menu configuration for the user's role
    const menuConfig = await prisma.menuConfiguration.findUnique({
      where: { role: userRole },
      include: {
        menuItems: {
          where: { parentId: null }, // Only root items
          include: {
            children: {
              orderBy: { order: 'asc' },
              include: {
                children: {
                  orderBy: { order: 'asc' }
                }
              }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!menuConfig) {
      return NextResponse.json({ error: 'Menu configuration not found' }, { status: 404 });
    }

    return NextResponse.json(menuConfig.menuItems);
  } catch (error) {
    console.error('Failed to fetch menu:', error);
    return NextResponse.json({ error: 'Failed to load menu data' }, { status: 500 });
  }
} 