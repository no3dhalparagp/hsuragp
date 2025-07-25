"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import {
  Eye,
  Search,
  Paperclip,
  File,
  Download,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

interface Email {
  id: string;
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  content: string;
  from: string;
  status: "SENT" | "FAILED" | "PENDING";
  createdAt: string;
  attachments: {
    fileName: string;
    fileUrl: string;
  }[];
}

const SentEmailsPage = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchEmails();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/email/list");
      if (!response.ok) throw new Error("Failed to fetch emails");
      const data = await response.json();
      setEmails(data);
    } catch (error) {
      console.error("Error fetching emails:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshEmails = async () => {
    setRefreshing(true);
    await fetchEmails();
    setRefreshing(false);
  };

  const filteredEmails = emails.filter((email) => {
    const matchesSearch =
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.to.some((recipient) =>
        recipient.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus =
      statusFilter === "all" || email.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEmails.length / itemsPerPage);
  const paginatedEmails = filteredEmails.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewEmail = (email: Email) => {
    setSelectedEmail(email);
    setIsDialogOpen(true);
  };

  const handleDownloadAttachments = (attachments: Email["attachments"]) => {
    attachments.forEach((attachment) => {
      window.open(attachment.fileUrl, "_blank");
    });
  };

  const getStatusBadgeStyles = (status: Email["status"]) => {
    switch (status) {
      case "SENT":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "FAILED":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const showEllipsisStart = totalPages > 5 && currentPage > 3;
    const showEllipsisEnd = totalPages > 5 && currentPage < totalPages - 2;

    let pageNumbers = [];
    if (totalPages <= 5) {
      pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else if (currentPage <= 3) {
      pageNumbers = [1, 2, 3, 4, 5];
    } else if (currentPage >= totalPages - 2) {
      pageNumbers = Array.from({ length: 5 }, (_, i) => totalPages - 4 + i);
    } else {
      pageNumbers = [
        currentPage - 2,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        currentPage + 2,
      ];
    }

    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {showEllipsisStart && (
            <>
              <PaginationItem>
                <PaginationLink onClick={() => setCurrentPage(1)}>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            </>
          )}

          {pageNumbers.map((pageNum) => (
            <PaginationItem key={pageNum}>
              <PaginationLink
                onClick={() => setCurrentPage(pageNum)}
                isActive={currentPage === pageNum}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          ))}

          {showEllipsisEnd && (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink onClick={() => setCurrentPage(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  const renderEmailSkeletons = () => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          <TableCell>
            <Skeleton className="h-10 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-10 w-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-10 w-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-10" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8 w-8 rounded-full ml-auto" />
          </TableCell>
        </TableRow>
      ));
  };

  const handleDeleteEmail = async (emailId: string) => {
    if (!confirm("Are you sure you want to delete this email?")) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/email/delete/${emailId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete email");

      await fetchEmails();
      setIsDialogOpen(false);
      toast.success("Email deleted successfully");
    } catch (error) {
      console.error("Error deleting email:", error);
      toast.error("Failed to delete email");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedEmails.length) return;
    if (
      !confirm(
        `Are you sure you want to delete ${selectedEmails.length} emails?`
      )
    )
      return;

    try {
      setIsBulkDeleting(true);
      const response = await fetch("/api/email/bulk-delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailIds: selectedEmails }),
      });

      if (!response.ok) throw new Error("Failed to delete emails");

      await fetchEmails();
      setSelectedEmails([]);
      toast.success(`${selectedEmails.length} emails deleted successfully`);
    } catch (error) {
      console.error("Error deleting emails:", error);
      toast.error("Failed to delete emails");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedEmails.length === paginatedEmails.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(paginatedEmails.map((email) => email.id));
    }
  };

  const toggleSelectEmail = (emailId: string) => {
    setSelectedEmails((prev) =>
      prev.includes(emailId)
        ? prev.filter((id) => id !== emailId)
        : [...prev, emailId]
    );
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Sent Emails History
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {selectedEmails.length > 0 && (
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {isBulkDeleting
                ? "Deleting..."
                : `Delete Selected (${selectedEmails.length})`}
            </Button>
          )}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full md:w-[300px] h-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px] h-10">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="SENT">Sent</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={refreshEmails}
            disabled={refreshing}
            className="h-10 w-10"
          >
            <RefreshCcw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedEmails.length === paginatedEmails.length}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead className="w-[100px] font-medium text-gray-700">
                  Date
                </TableHead>
                <TableHead className="min-w-[150px] font-medium text-gray-700">
                  To
                </TableHead>
                <TableHead className="font-medium text-gray-700">
                  Subject / Content
                </TableHead>
                <TableHead className="w-[100px] font-medium text-gray-700">
                  Status
                </TableHead>
                <TableHead className="w-[80px] font-medium text-gray-700 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                renderEmailSkeletons()
              ) : paginatedEmails.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-gray-500"
                  >
                    {searchTerm || statusFilter !== "all"
                      ? "No emails match your search criteria"
                      : "No emails found"}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedEmails.map((email) => (
                  <TableRow
                    key={email.id}
                    className="hover:bg-gray-50 group cursor-pointer"
                    onClick={() => handleViewEmail(email)}
                  >
                    <TableCell>
                      <div onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedEmails.includes(email.id)}
                          onCheckedChange={() => toggleSelectEmail(email.id)}
                          aria-label={`Select ${email.subject}`}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="py-2 w-[100px]">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900">
                          {format(new Date(email.createdAt), "MMM d")}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(email.createdAt), "h:mm a")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 min-w-[150px]">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900 truncate">
                          {email.to.join(", ")}
                        </span>
                        {email.attachments.length > 0 && (
                          <Paperclip className="h-3 w-3 text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900 truncate">
                          {email.subject || (
                            <span className="text-gray-400">(No subject)</span>
                          )}
                        </span>
                        {email.content && (
                          <span className="text-xs text-gray-500 truncate">
                            -{" "}
                            {email.content
                              .replace(/<[^>]*>/g, "")
                              .substring(0, 50)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-2 w-[100px]">
                      <Badge
                        variant="outline"
                        className={`${getStatusBadgeStyles(
                          email.status
                        )} text-xs`}
                      >
                        {email.status.charAt(0) +
                          email.status.slice(1).toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2 text-right w-[80px]">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewEmail(email);
                        }}
                        className="text-gray-400 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {renderPagination()}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Email Details
            </DialogTitle>
          </DialogHeader>
          {selectedEmail && (
            <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700">
                  Subject
                </Label>
                <p className="text-sm text-gray-900 font-medium">
                  {selectedEmail.subject || "No subject"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-700">
                    From
                  </Label>
                  <p className="text-sm text-gray-900">{selectedEmail.from}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-700">
                    Date Sent
                  </Label>
                  <p className="text-sm text-gray-900">
                    {format(
                      new Date(selectedEmail.createdAt),
                      "MMM d, yyyy 'at' h:mm a"
                    )}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700">
                  Status
                </Label>
                <div>
                  <Badge
                    variant="outline"
                    className={`${getStatusBadgeStyles(selectedEmail.status)}`}
                  >
                    {selectedEmail.status.charAt(0) +
                      selectedEmail.status.slice(1).toLowerCase()}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-700">
                    To
                  </Label>
                  <p className="text-sm text-gray-900 break-words">
                    {selectedEmail.to.join(", ")}
                  </p>
                </div>
                {selectedEmail.cc.length > 0 && (
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-700">
                      CC
                    </Label>
                    <p className="text-sm text-gray-900 break-words">
                      {selectedEmail.cc.join(", ")}
                    </p>
                  </div>
                )}
                {selectedEmail.bcc.length > 0 && (
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-700">
                      BCC
                    </Label>
                    <p className="text-sm text-gray-900 break-words">
                      {selectedEmail.bcc.join(", ")}
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              {selectedEmail.attachments.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-gray-700">
                      Attachments ({selectedEmail.attachments.length})
                    </Label>
                    {selectedEmail.attachments.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleDownloadAttachments(selectedEmail.attachments)
                        }
                        className="text-xs"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download All
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-2 bg-gray-50 p-3 rounded-md">
                    {selectedEmail.attachments.map((attachment, index) => (
                      <a
                        key={index}
                        href={attachment.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between text-sm text-blue-600 hover:text-blue-800 transition-colors p-2 hover:bg-gray-100 rounded"
                      >
                        <div className="flex items-center">
                          <File className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate max-w-[300px]">
                            {attachment.fileName}
                          </span>
                        </div>
                        <Download className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Content
                </Label>
                <div
                  className="prose prose-sm max-w-none border rounded-lg p-4 bg-white overflow-auto max-h-[300px]"
                  dangerouslySetInnerHTML={{ __html: selectedEmail.content }}
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex items-center justify-between gap-4 pt-4 border-t">
            <Button
              variant="destructive"
              onClick={() =>
                selectedEmail && handleDeleteEmail(selectedEmail.id)
              }
              disabled={isDeleting}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {isDeleting ? "Deleting..." : "Delete Email"}
            </Button>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SentEmailsPage;
