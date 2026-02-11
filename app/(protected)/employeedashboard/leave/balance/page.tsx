import React from 'react';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';

const Page = async () => {
  const cuser = await currentUser();

  if (!cuser) {
    return <pre>User not found or not logged in.</pre>;
  }

  const userWithNotifications = await db.user.findUnique({
    where: {
      id: cuser.id,
    },
    include: {
      notifications: true, // Ensure it matches the schema
    },
  });

  if (!userWithNotifications) {
    return <pre>No notifications found for this user.</pre>;
  }

  return (
    <pre>
      {JSON.stringify(userWithNotifications, null, 2)}
    </pre>
  );
};

export default Page;
