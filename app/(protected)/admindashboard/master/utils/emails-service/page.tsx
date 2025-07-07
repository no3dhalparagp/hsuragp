"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  emailServiceStatus,
  updateEmailServiceStatus,
  getEmailServiceHistory,
} from "@/lib/emailservide";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Power, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface StatusHistory {
  emailservicestatus: boolean;
  createdAt: Date;
}

const EmailServicePage = () => {
  const [isServiceRunning, setIsServiceRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<StatusHistory[]>([]);

  useEffect(() => {
    fetchServiceStatus();
    fetchHistory();
  }, []);

  const fetchServiceStatus = async () => {
    try {
      const status = await emailServiceStatus();
      setIsServiceRunning(status);
    } catch (error) {
      console.error("Error fetching email service status:", error);
      toast({
        title: "Error",
        description: "Failed to fetch email service status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const historyData = await getEmailServiceHistory();
      setHistory(historyData);
    } catch (error) {
      console.error("Error fetching history:", error);
      toast({
        title: "Error",
        description: "Failed to fetch service history",
        variant: "destructive",
      });
    }
  };

  const handleToggleService = async () => {
    try {
      setIsLoading(true);
      const newStatus = !isServiceRunning;
      const success = await updateEmailServiceStatus(newStatus);

      if (success) {
        setIsServiceRunning(newStatus);
        await fetchHistory();
        toast({
          title: "Success",
          description: `Email service ${
            newStatus ? "started" : "stopped"
          } successfully`,
        });
      } else {
        throw new Error("Failed to update service status");
      }
    } catch (error) {
      console.error("Error toggling email service:", error);
      toast({
        title: "Error",
        description: "Failed to update email service status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Service</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor the email service status
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Service Status</CardTitle>
                <CardDescription className="mt-1">
                  Current state of the email service
                </CardDescription>
              </div>
              <div
                className={`p-2 rounded-full ${
                  isServiceRunning ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <Power
                  className={`h-6 w-6 ${
                    isServiceRunning ? "text-green-600" : "text-red-600"
                  }`}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge
                  variant={isServiceRunning ? "success" : "destructive"}
                  className="text-sm"
                >
                  {isServiceRunning ? "Running" : "Stopped"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {isServiceRunning
                    ? "Email service is currently active"
                    : "Email service is currently inactive"}
                </span>
              </div>
              <Separator />
              <Button
                onClick={handleToggleService}
                disabled={isLoading}
                variant={isServiceRunning ? "destructive" : "default"}
                className="w-full"
                size="lg"
              >
                {isLoading
                  ? "Processing..."
                  : isServiceRunning
                  ? "Stop Service"
                  : "Start Service"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Service History</CardTitle>
                <CardDescription className="mt-1">
                  Latest 5 status changes
                </CardDescription>
              </div>
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {history.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  No history available
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.map((record, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {format(new Date(record.createdAt), "PPpp")}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                record.emailservicestatus
                                  ? "success"
                                  : "destructive"
                              }
                              className="text-xs"
                            >
                              {record.emailservicestatus
                                ? "Enabled"
                                : "Disabled"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Showing the 5 most recent status changes
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailServicePage;
