import { db } from "@/lib/db";
import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { revalidatePath } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Trash2 } from "lucide-react";

async function deleteAllNotifications(formData: FormData): Promise<void> {
  "use server";

  try {
    const result = await db.notification.deleteMany({
      where: {
        read: true,
      },
    });

    if (result.count === 0) {
      throw new Error("No notifications to delete");
    }

    revalidatePath("/admindashboard/master/utils/notification");
  } catch (error) {
    console.error("Failed to delete notifications:", error);
    throw error;
  }
}

const NotificationPage = async () => {
  const notifications = await db.notification.findMany({
    where: {
      read: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6" />
            Notifications
          </CardTitle>
          <form action={deleteAllNotifications}>
            <Button
              variant="destructive"
              type="submit"
              disabled={notifications.length === 0}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete All
            </Button>
          </form>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="flex items-center justify-center h-[50vh]">
              <p className="text-muted-foreground">No notifications found</p>
            </div>
          ) : (
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <Card key={notification.id} className="bg-card">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationPage;
