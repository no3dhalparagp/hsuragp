"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Clock,
  Loader2,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Notification } from "@prisma/client";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMarkingRead, setIsMarkingRead] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/notifications");
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      setNotifications(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setIsMarkingRead(true);
      const response = await fetch("/api/notifications/mark-all-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to mark notifications as read");
      }

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Error marking notifications as read:", err);
      setError("Failed to mark notifications as read");
    } finally {
      setIsMarkingRead(false);
    }
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "INFO":
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case "WARNING":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "ERROR":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-muted/50 rounded-full"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <Badge
              variant="default"
              className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[448px] p-0" sideOffset={8}>
        <Card className="border-0 shadow-none">
          <CardHeader className="border-b px-4 py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Notifications
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    fetchNotifications();
                  }}
                  disabled={loading}
                  aria-label="Refresh notifications"
                >
                  <Loader2
                    className={cn("h-4 w-4", loading ? "animate-spin" : "")}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    handleMarkAllAsRead();
                  }}
                  disabled={unreadCount === 0 || isMarkingRead}
                  aria-label="Mark all as read"
                >
                  {isMarkingRead ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="max-h-[400px] overflow-y-auto">
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <li key={index} className="px-4 py-3 flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-muted animate-pulse mt-1" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-[80%] bg-muted rounded animate-pulse" />
                      <div className="h-3 w-[50%] bg-muted rounded animate-pulse" />
                    </div>
                  </li>
                ))
              ) : error ? (
                <div className="flex items-center justify-center p-6 text-destructive">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span className="text-sm">{error}</span>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <Inbox className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">
                    You&apos;re all caught up! No new notifications.
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={cn(
                      "group flex items-start gap-3 px-4 py-3 transition-colors border-l-4 cursor-pointer",
                      !notification.read
                        ? "bg-accent/10 border-l-primary"
                        : "border-l-transparent hover:bg-muted/50"
                    )}
                    onClick={() => {
                      // Handle notification click if needed
                    }}
                  >
                    <div className="mt-1">{getIcon(notification.type)}</div>
                    <div className="flex-1">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          !notification.read && "text-primary"
                        )}
                      >
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.createdAt).toLocaleString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
          <CardFooter className="border-t px-4 py-3">
            <Button
              variant="link"
              size="sm"
              className="w-full justify-end text-primary hover:no-underline"
              onClick={() => {
                // Navigate to full notifications page
              }}
            >
              View all notifications
            </Button>
          </CardFooter>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
