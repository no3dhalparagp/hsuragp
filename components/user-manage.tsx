"use client";

import {
  toggleTwoFactor,
  updateUserRole,
  UserRole,
  createUser,
} from "@/action/userinfo";
import { Designation } from "@prisma/client";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CreateUserSchema } from "@/schema";

import {
  ShieldCheck,
  ShieldX,
  Users,
  User,
  UserCog,
  Shield,
  KeyRound,
  UserPlus,
} from "lucide-react";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  isTwoFactorEnabled: boolean;
  role: UserRole;
  designation: Designation | null;
  slno: number;
  avatar: string;
};

type Props = {
  initialUsers: User[];
};

export default function UserManagementClient({ initialUsers }: Props) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [selectedRole, setSelectedRole] = useState<UserRole>("user");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof CreateUserSchema>>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
      mobileNumber: "",
    },
  });

  const onSubmit = (values: z.infer<typeof CreateUserSchema>) => {
    startTransition(async () => {
      const result = await createUser(values);

      if (result.success) {
        toast({
          title: "Success",
          description: result.success,
        });
        setIsDialogOpen(false);
        form.reset();

        // Refresh user list (ideally we should use a more robust way like router.refresh() but updating state works too)
        if (result.user) {
          const newUser: User = {
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            isTwoFactorEnabled: result.user.isTwoFactorEnabled,
            role: result.user.role as UserRole,
            designation: result.user.designation as Designation | null,
            slno: users.length + 1,
            avatar: result.user.image || "/placeholder.svg?height=40&width=40",
          };
          setUsers((prev) => [...prev, newUser]);
        }
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    });
  };

  // FIX: store userId instead of email
  const [resettingUsers, setResettingUsers] = useState<Set<string>>(new Set());

  const currentFilteredUsers = users.filter(
    (user) => user.role === selectedRole,
  );

  const currentUserIds = currentFilteredUsers.map((user) => user.id);

  const allSelected =
    currentUserIds.length > 0 &&
    currentUserIds.every((id) => selectedUsers.includes(id));

  useEffect(() => {
    setSelectedUsers([]);
  }, [selectedRole]);

  const handleSelectAll = () => {
    setSelectedUsers(allSelected ? [] : currentUserIds);
  };

  const handleSelectUser = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id],
    );
  };

  const handleToggle2FA = async (enable: boolean) => {
    if (selectedUsers.length === 0) {
      toast({
        title: "Warning",
        description: "Select at least one user",
      });
      return;
    }

    startTransition(async () => {
      await toggleTwoFactor(selectedUsers, enable);

      setUsers((prev) =>
        prev.map((u) =>
          selectedUsers.includes(u.id)
            ? { ...u, isTwoFactorEnabled: enable }
            : u,
        ),
      );

      setSelectedUsers([]);

      toast({
        title: "Success",
        description: `2FA ${enable ? "enabled" : "disabled"} successfully`,
      });
    });
  };

  const handleRoleChange = async (userId: string, role: UserRole) => {
    startTransition(async () => {
      await updateUserRole(userId, role);

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role } : u)),
      );

      toast({
        title: "Role Updated",
        description: `User role changed to ${role}`,
      });
    });
  };

  const handleSendPasswordReset = async (user: User) => {
    if (!user.email) {
      toast({
        title: "Error",
        description: "User email not available",
        variant: "destructive",
      });
      return;
    }

    setResettingUsers((prev) => new Set(prev).add(user.id));

    try {
      await fetch("/api/send-reset-password", {
        method: "POST",
        body: JSON.stringify({ email: user.email }),
      });

      toast({
        title: "Reset Link Sent",
        description: "Password reset email sent successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to send reset link",
        variant: "destructive",
      });
    }

    setResettingUsers((prev) => {
      const set = new Set(prev);
      set.delete(user.id);
      return set;
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add User / Staff
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New User or Staff</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="john@example.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mobileNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number</FormLabel>
                      <FormControl>
                        <Input placeholder="1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={(v) => {
                          field.onChange(v);
                          if (v !== "staff") {
                            form.setValue("designation", undefined);
                          }
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="superadmin">
                            Super Admin
                          </SelectItem>
                          <SelectItem value="agency">Agency</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("role") === "staff" && (
                  <FormField
                    control={form.control}
                    name="designation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Designation</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select designation" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(Designation).map((d) => (
                              <SelectItem key={d} value={d}>
                                {d.replace(/_/g, " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <DialogFooter>
                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? "Creating..." : "Create User"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs
        value={selectedRole}
        onValueChange={(v) => setSelectedRole(v as UserRole)}
      >
        <TabsList className="grid w-full grid-cols-5">
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
            Admin
          </TabsTrigger>

          <TabsTrigger value="superadmin">
            <Shield className="h-4 w-4 mr-2" />
            Super Admin
          </TabsTrigger>

          <TabsTrigger value="agency">
            <ShieldCheck className="h-4 w-4 mr-2" />
            Agency
          </TabsTrigger>
        </TabsList>

        {(["user", "staff", "admin", "superadmin", "agency"] as const).map(
          (role) => (
            <TabsContent key={role} value={role}>
              <Card className="mt-4">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {role.toUpperCase()} USERS
                  </CardTitle>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleToggle2FA(true)}
                      disabled={selectedUsers.length === 0 || isPending}
                      className="gap-2"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Enable 2FA
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => handleToggle2FA(false)}
                      disabled={selectedUsers.length === 0 || isPending}
                      className="gap-2"
                    >
                      <ShieldX className="h-4 w-4" />
                      Disable
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <ScrollArea className="h-[600px]">
                    <Table>
                      <TableHeader className="bg-muted sticky top-0">
                        <TableRow>
                          <TableHead className="w-[50px]">
                            <Checkbox
                              checked={allSelected}
                              onCheckedChange={handleSelectAll}
                            />
                          </TableHead>

                          <TableHead>S.No</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Designation</TableHead>
                          <TableHead>2FA</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {currentFilteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedUsers.includes(user.id)}
                                onCheckedChange={() =>
                                  handleSelectUser(user.id)
                                }
                              />
                            </TableCell>

                            <TableCell>{user.slno}</TableCell>

                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage
                                    src={user.avatar || "/avatar.png"}
                                  />
                                  <AvatarFallback>
                                    {user.name?.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>

                                <span className="font-medium">{user.name}</span>
                              </div>
                            </TableCell>

                            <TableCell>{user.email}</TableCell>

                            <TableCell>
                              {user.designation ? (
                                <Badge variant="outline">
                                  {user.designation.replace(/_/g, " ")}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground text-xs">
                                  N/A
                                </span>
                              )}
                            </TableCell>

                            <TableCell>
                              <Badge
                                variant={
                                  user.isTwoFactorEnabled
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {user.isTwoFactorEnabled
                                  ? "Enabled"
                                  : "Disabled"}
                              </Badge>
                            </TableCell>

                            <TableCell>
                              <Select
                                value={user.role}
                                onValueChange={(v: UserRole) =>
                                  handleRoleChange(user.id, v)
                                }
                              >
                                <SelectTrigger className="w-[130px]">
                                  <SelectValue />
                                </SelectTrigger>

                                <SelectContent>
                                  <SelectItem value="user">User</SelectItem>
                                  <SelectItem value="staff">Staff</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="superadmin">
                                    Super Admin
                                  </SelectItem>
                                  <SelectItem value="agency">Agency</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>

                            <TableCell>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => handleSendPasswordReset(user)}
                                disabled={
                                  !user.email || resettingUsers.has(user.id)
                                }
                              >
                                <KeyRound
                                  className={`h-4 w-4 ${
                                    resettingUsers.has(user.id)
                                      ? "animate-spin"
                                      : ""
                                  }`}
                                />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          ),
        )}
      </Tabs>
    </div>
  );
}
