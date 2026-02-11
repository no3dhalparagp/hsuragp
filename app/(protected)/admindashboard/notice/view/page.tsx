import { db } from "@/lib/db";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Calendar,
  Download,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { deleteNotice } from "@/action/notice";
import { revalidatePath } from "next/cache";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IndeterminateCheckbox } from "@/components/ui/indeterminate-checkbox";

const page = async () => {
  const notices = await db.notice.findMany({
    include: { files: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notices</h1>
        <Link href="/admindashboard/notice/add">
          <Button>Add New Notice</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title & Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Files</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notices.map((notice) => (
              <TableRow key={notice.id}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{notice.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {notice.reference}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {notice.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                    {notice.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 className="h-4 w-4 text-green-600" />
                    {notice.department}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 text-green-600" />
                    {new Date(notice.createdAt).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  {notice.files && notice.files.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {notice.files.map((file, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs gap-1 hover:bg-green-50"
                        >
                          <Download className="h-3 w-3 text-green-600" />
                          <span>{file.name}</span>
                        </Button>
                      ))}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-green-50"
                        >
                          <Eye className="h-4 w-4 text-green-600" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold">
                            {notice.title}
                          </DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="max-h-[70vh] pr-4">
                          <div className="space-y-6">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {notice.reference}
                              </Badge>
                              <Badge className="bg-green-100 text-green-700">
                                {notice.type}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-green-600" />
                                {notice.department}
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-green-600" />
                                {new Date(
                                  notice.createdAt
                                ).toLocaleDateString()}
                              </div>
                            </div>

                            <div className="prose max-w-none">
                              <p className="text-gray-700 whitespace-pre-wrap">
                                {notice.description}
                              </p>
                            </div>

                            {notice.files && notice.files.length > 0 && (
                              <div className="space-y-2">
                                <h3 className="font-medium">Attached Files</h3>
                                <div className="flex flex-wrap gap-2">
                                  {notice.files.map((file, index) => (
                                    <Button key={index}>
                                      <Download className="h-4 w-4 text-green-600" />
                                      {file.name}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-green-50"
                      asChild
                    >
                      <Link href={`/admindashboard/notice/edit/${notice.id}`}>
                        <Pencil className="h-4 w-4 text-blue-600" />
                      </Link>
                    </Button>
                    <form
                      action={async () => {
                        "use server";
                        await deleteNotice(notice.id);
                        revalidatePath("/admindashboard/notice/view");
                      }}
                    >
                      <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        className="hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default page;
