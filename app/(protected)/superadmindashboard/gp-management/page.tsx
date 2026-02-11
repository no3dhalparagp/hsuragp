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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getAllGPAccounts,
  approveGPAccount,
  deleteGPAccount,
} from "@/action/gp-management";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Plus, CheckCircle2, XCircle, Trash2, Eye } from "lucide-react";

type GPAccount = {
  id: string;
  gpname: string;
  gpcode: string;
  gpaddress: string;
  nameinprodhan: string;
  blockname: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "SUSPENDED";
  createdAt: string;
  approvedAt: string | null;
  rejectionReason: string | null;
  createdByUser: { name: string | null; email: string | null } | null;
  approvedByUser: { name: string | null; email: string | null } | null;
};

export default function GPManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [gpAccounts, setGpAccounts] = useState<GPAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvalDialog, setApprovalDialog] = useState<{
    open: boolean;
    gp: GPAccount | null;
    action: "approve" | "reject" | "suspend" | null;
  }>({ open: false, gp: null, action: null });
  const [rejectionReason, setRejectionReason] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    gp: GPAccount | null;
  }>({ open: false, gp: null });

  useEffect(() => {
    loadGPAccounts();
  }, []);

  const loadGPAccounts = async () => {
    setLoading(true);
    const result = await getAllGPAccounts();
    if (result.success && result.data) {
      setGpAccounts(result.data as GPAccount[]);
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to load GP accounts",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleApprove = async () => {
    if (!approvalDialog.gp) return;

    const result = await approveGPAccount({
      gpId: approvalDialog.gp.id,
      status: approvalDialog.action === "approve" ? "APPROVED" : approvalDialog.action === "reject" ? "REJECTED" : "SUSPENDED",
      rejectionReason: approvalDialog.action === "reject" ? rejectionReason : undefined,
    });

    if (result.success) {
      toast({
        title: "Success",
        description: result.message || "GP account updated successfully",
      });
      setApprovalDialog({ open: false, gp: null, action: null });
      setRejectionReason("");
      loadGPAccounts();
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update GP account",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.gp) return;

    const result = await deleteGPAccount(deleteDialog.gp.id);

    if (result.success) {
      toast({
        title: "Success",
        description: result.message || "GP account deleted successfully",
      });
      setDeleteDialog({ open: false, gp: null });
      loadGPAccounts();
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete GP account",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      PENDING: "secondary",
      APPROVED: "default",
      ACTIVE: "default",
      REJECTED: "destructive",
      SUSPENDED: "outline",
    };

    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      ACTIVE: "bg-blue-100 text-blue-800",
      REJECTED: "bg-red-100 text-red-800",
      SUSPENDED: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge className={colors[status] || "bg-gray-100 text-gray-800"}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">GP Account Management</h1>
          <p className="text-gray-600 mt-2">
            Manage Gram Panchayat accounts and approvals
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/gp-management/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Create GP Account
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All GP Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : gpAccounts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No GP accounts found. Create your first GP account.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>GP Code</TableHead>
                    <TableHead>GP Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Block</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gpAccounts.map((gp) => (
                    <TableRow key={gp.id}>
                      <TableCell className="font-medium">{gp.gpcode}</TableCell>
                      <TableCell>{gp.gpname}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {gp.gpaddress}
                      </TableCell>
                      <TableCell>{gp.blockname}</TableCell>
                      <TableCell>{getStatusBadge(gp.status)}</TableCell>
                      <TableCell>
                        {new Date(gp.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {gp.status === "PENDING" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  setApprovalDialog({
                                    open: true,
                                    gp,
                                    action: "approve",
                                  })
                                }
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  setApprovalDialog({
                                    open: true,
                                    gp,
                                    action: "reject",
                                  })
                                }
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          {gp.status === "APPROVED" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                setApprovalDialog({
                                  open: true,
                                  gp,
                                  action: "suspend",
                                })
                              }
                            >
                              Suspend
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              router.push(`/dashboard/gp-management/${gp.id}`)
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              setDeleteDialog({ open: true, gp })
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

      {/* Approval/Rejection Dialog */}
      <Dialog
        open={approvalDialog.open}
        onOpenChange={(open) =>
          !open && setApprovalDialog({ open: false, gp: null, action: null })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalDialog.action === "approve"
                ? "Approve GP Account"
                : approvalDialog.action === "reject"
                ? "Reject GP Account"
                : "Suspend GP Account"}
            </DialogTitle>
            <DialogDescription>
              {approvalDialog.action === "approve"
                ? `Are you sure you want to approve ${approvalDialog.gp?.gpname}?`
                : approvalDialog.action === "reject"
                ? `Please provide a reason for rejecting ${approvalDialog.gp?.gpname}.`
                : `Are you sure you want to suspend ${approvalDialog.gp?.gpname}?`}
            </DialogDescription>
          </DialogHeader>
          {approvalDialog.action === "reject" && (
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                required
              />
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setApprovalDialog({ open: false, gp: null, action: null })
              }
            >
              Cancel
            </Button>
            <Button onClick={handleApprove}>
              {approvalDialog.action === "approve"
                ? "Approve"
                : approvalDialog.action === "reject"
                ? "Reject"
                : "Suspend"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => !open && setDeleteDialog({ open: false, gp: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete GP Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deleteDialog.gp?.gpname}? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, gp: null })}
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

