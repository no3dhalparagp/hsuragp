"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getAllGPAdminUsers,
  deleteGPAdminUser,
} from "@/action/gp-admin-users";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Trash2, Eye, Edit, UserCheck } from "lucide-react";

type GPAdminUser = {
  id: string;
  name: string | null;
  email: string | null;
  mobileNumber: string | null;
  userStatus: "active" | "inactive";
  createdAt: string;
  assignedGP: {
    id: string;
    gpname: string;
    gpcode: string;
    status: string;
  } | null;
};

export default function GPAdminUsersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [adminUsers, setAdminUsers] = useState<GPAdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    user: GPAdminUser | null;
  }>({ open: false, user: null });

  useEffect(() => {
    loadAdminUsers();
  }, []);

  const loadAdminUsers = async () => {
    setLoading(true);
    const result = await getAllGPAdminUsers();
    if (result.success && result.data) {
      setAdminUsers(result.data as GPAdminUser[]);
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to load GP admin users",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteDialog.user) return;

    const result = await deleteGPAdminUser(deleteDialog.user.id);

    if (result.success) {
      toast({
        title: "Success",
        description: result.message || "GP admin user deleted successfully",
      });
      setDeleteDialog({ open: false, user: null });
      loadAdminUsers();
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete GP admin user",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge className={colors[status] || "bg-gray-100 text-gray-800"}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">GP Admin Users</h1>
          <p className="text-gray-600 mt-2">
            Manage admin users for Gram Panchayat accounts
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/gp-admin-users/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Create GP Admin User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All GP Admin Users</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : adminUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No GP admin users found. Create your first GP admin user.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Assigned GP</TableHead>
                    <TableHead>GP Code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.name || "N/A"}
                      </TableCell>
                      <TableCell>{user.email || "N/A"}</TableCell>
                      <TableCell>{user.mobileNumber || "N/A"}</TableCell>
                      <TableCell>
                        {user.assignedGP?.gpname || "Not assigned"}
                      </TableCell>
                      <TableCell>
                        {user.assignedGP?.gpcode || "N/A"}
                      </TableCell>
                      <TableCell>{getStatusBadge(user.userStatus)}</TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              router.push(`/dashboard/gp-admin-users/${user.id}`)
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              router.push(
                                `/dashboard/gp-admin-users/${user.id}/edit`
                              )
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              setDeleteDialog({ open: true, user })
                            }
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          !open && setDeleteDialog({ open: false, user: null })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete GP Admin User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deleteDialog.user?.name}? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, user: null })}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

