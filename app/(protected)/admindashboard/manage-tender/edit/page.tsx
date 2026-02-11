import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal, Pencil, Trash2, Plus, Check, X } from "lucide-react";
import { db } from "@/lib/db";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

async function getNits() {
  return await db.nitDetails.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function NitTablePage() {
  const nits = await getNits();

  // Format date as DD/MM/YYYY
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-GB");
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="rounded-xl shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-2xl font-bold text-gray-800">
              NIT Management
            </CardTitle>
            <Link href="/nits/create" passHref>
              <Button className="bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md">
                <Plus className="h-4 w-4 mr-2" />
                Create New NIT
              </Button>
            </Link>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {nits.length === 0 ? (
            <div className="py-12 text-center">
              <div className="text-gray-500 mb-4">No NIT records found</div>
              <Link href="/nits/create" passHref>
                <Button className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
                  Create your first NIT
                </Button>
              </Link>
            </div>
          ) : (
            <div className="rounded-b-xl overflow-hidden border-t">
              <Table className="min-w-full">
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-[80px] font-bold text-gray-700">Sl No</TableHead>
                    <TableHead className="font-bold text-gray-700">Memo Number</TableHead>
                    <TableHead className="font-bold text-gray-700">Memo Date</TableHead>
                    <TableHead className="font-bold text-gray-700">Publishing Date</TableHead>
                    <TableHead className="font-bold text-gray-700">Supply</TableHead>
                    <TableHead className="font-bold text-gray-700">Status</TableHead>
                    <TableHead className="text-right font-bold text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nits.map((nit, index) => (
                    <TableRow 
                      key={nit.id} 
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-medium text-gray-600">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-semibold text-gray-800">
                        {nit.memoNumber || "-"}
                      </TableCell>
                      <TableCell>
                        {nit.memoDate ? formatDate(nit.memoDate) : "-"}
                      </TableCell>
                      <TableCell>
                        {nit.publishingDate ? formatDate(nit.publishingDate) : "-"}
                      </TableCell>
                      <TableCell>
                        {nit.isSupply ? (
                          <Badge className="bg-green-100 text-green-800">
                            <Check className="h-4 w-4 mr-1" /> Supply
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-800">
                            <X className="h-4 w-4 mr-1" /> Non-Supply
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {nit.isPublished ? (
                          <Badge className="bg-blue-100 text-blue-800">Published</Badge>
                        ) : (
                          <Badge variant="outline">Draft</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              className="h-8 w-8 p-0 focus:ring-2 focus:ring-indigo-200"
                            >
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4 text-gray-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent 
                            align="end" 
                            className="rounded-lg shadow-lg border border-gray-200"
                          >
                            <DropdownMenuLabel className="text-gray-700">
                              Actions
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/admindashboard/manage-tender/edit/${nit.id}`}
                                className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-700"
                              >
                                <Pencil className="mr-2 h-4 w-4 text-indigo-600" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="p-0">
                              <button className="w-full flex items-center px-4 py-2 hover:bg-red-50 cursor-pointer text-red-700">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </button>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
