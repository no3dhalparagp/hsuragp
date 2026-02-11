"use client";

import { toggleTwoFactor, updateUserRole, UserRole } from "@/action/userinfo";
import { useState, useTransition, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ShieldCheck,
  ShieldX,
  Users,
  User,
  UserCog,
  Shield,
  KeyRound,
} from "lucide-react";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  isTwoFactorEnabled: boolean;
  role: UserRole;
  slno: number;
  avatar: string;
};

type UserManagementClientProps = {
  initialUsers: User[];
};

export default function Component({ initialUsers }: UserManagementClientProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [selectedRole, setSelectedRole] = useState<UserRole>("user");
  const [resettingEmails, setResettingEmails] = useState<Set<string>>(
    new Set()
  );

  const currentFilteredUsers = users.filter(
    (user) => user.role === selectedRole
  );
  const currentUserIds = currentFilteredUsers.map((user) => user.id);
  const allSelected =
    currentUserIds.length > 0 &&
    currentUserIds.every((id) => selectedUsers.includes(id));

  useEffect(() => {
    setSelectedUsers([]);
  }, [selectedRole]);

  const handleSelectAll = () => {
    setSelectedUsers((prev) =>
      prev.length === currentUserIds.length ? [] : currentUserIds
    );
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleToggle2FA = async (enable: boolean) => {
    if (selectedUsers.length === 0) {
      toast({
        title: "Warning",
        description: "Please select at least one user.",
        variant: "default",
      });
      return;
    }
    startTransition(async () => {
      try {
        await toggleTwoFactor(selectedUsers, enable);
        const updatedUsers = users.map((user) =>
          selectedUsers.includes(user.id)
            ? { ...user, isTwoFactorEnabled: enable }
            : user
        );
        setUsers(updatedUsers);
        setSelectedUsers([]);
        toast({
          title: "Success",
          description: `Two-factor authentication ${
            enable ? "enabled" : "disabled"
          } for selected users.`,
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Error",
          description:
            "Failed to update two-factor authentication. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const handleRoleChange = async (userId: string, role: UserRole) => {
    startTransition(async () => {
      try {
        await updateUserRole(userId, role);
        const updatedUsers = users.map((user) =>
          user.id === userId ? { ...user, role } : user
        );
        setUsers(updatedUsers);
        toast({
          title: "Success",
          description: `User role updated to ${role}.`,
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update user role. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const handleSendPasswordReset = async (email: string | null) => {
    if (!email) {
      toast({
        title: "Error",
        description: "User email is not available.",
        variant: "destructive",
      });
      return;
    }

    setResettingEmails((prev) => new Set(prev).add(email));

    startTransition(async () => {
      try {
        const response = await fetch("/api/send-reset-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (data.success) {
          toast({
            title: "Success",
            description:
              "Password reset link has been sent to the user's email.",
            variant: "default",
          });
        } else {
          throw new Error(data.message || "Failed to send reset link");
        }
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to send password reset link. Please try again.",
          variant: "destructive",
        });
      } finally {
        setResettingEmails((prev) => {
          const newSet = new Set(prev);
          newSet.delete(email);
          return newSet;
        });
      }
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Manage user roles, two-factor authentication, and other settings.
        </p>
      </div>

      <Tabs
        value={selectedRole}
        onValueChange={(value) => setSelectedRole(value as UserRole)}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="user">
            <User className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="staff">
            <Users className="h-4 w-4 mr-2" />
            Staff
          </TabsTrigger>
          <TabsTrigger value="admin">
            <UserCog className="h-4 w-4 mr-2" />
            Admins
          </TabsTrigger>
        </TabsList>

        {(["user", "staff", "admin"] as const).map((role) => (
          <TabsContent key={role} value={role}>
            <Card className="shadow-sm mt-4">
              <CardHeader className="border-b p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
                  </CardTitle>
                  <div className="space-x-2">
                    <Button
                      onClick={() => handleToggle2FA(true)}
                      variant="default"
                      disabled={isPending || selectedUsers.length === 0}
                      className="gap-2"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      {isPending ? "Updating..." : "Enable 2FA"}
                    </Button>
                    <Button
                      onClick={() => handleToggle2FA(false)}
                      variant="outline"
                      disabled={isPending || selectedUsers.length === 0}
                      className="gap-2"
                    >
                      <ShieldX className="h-4 w-4" />
                      {isPending ? "Updating..." : "Disable 2FA"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-220px)]">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox
                            checked={allSelected}
                            onCheckedChange={handleSelectAll}
                            aria-label="Select all users"
                          />
                        </TableHead>
                        <TableHead>S.No</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>2FA Status</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentFilteredUsers.map((user) => (
                        <TableRow
                          key={user.id}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedUsers.includes(user.id)}
                              onCheckedChange={() => handleSelectUser(user.id)}
                              aria-label={`Select ${user.name}`}
                            />
                          </TableCell>
                          <TableCell>{user.slno}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={user.avatar}
                                  alt={`Avatar of ${user.name}`}
                                />
                                <AvatarFallback>
                                  {user.name?.charAt(0) || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">
                                {user.name || "N/A"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{user.email || "N/A"}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.isTwoFactorEnabled
                                  ? "default"
                                  : "secondary"
                              }
                              className="gap-1"
                            >
                              <Shield className="h-3 w-3" />
                              {user.isTwoFactorEnabled ? "Enabled" : "Disabled"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Select
                                value={user.role}
                                onValueChange={(value: UserRole) =>
                                  handleRoleChange(user.id, value)
                                }
                                disabled={isPending}
                              >
                                <SelectTrigger className="w-[140px]">
                                  <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="user">
                                    <div className="flex items-center gap-2">
                                      <User className="h-4 w-4" />
                                      <span>User</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="admin">
                                    <div className="flex items-center gap-2">
                                      <UserCog className="h-4 w-4" />
                                      <span>Admin</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="staff">
                                    <div className="flex items-center gap-2">
                                      <Users className="h-4 w-4" />
                                      <span>Staff</span>
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  handleSendPasswordReset(user.email)
                                }
                                disabled={
                                  isPending ||
                                  !user.email ||
                                  resettingEmails.has(user.email || "")
                                }
                                title="Send password reset link"
                              >
                                <KeyRound
                                  className={`h-4 w-4 ${
                                    resettingEmails.has(user.email || "")
                                      ? "animate-spin"
                                      : ""
                                  }`}
                                />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
