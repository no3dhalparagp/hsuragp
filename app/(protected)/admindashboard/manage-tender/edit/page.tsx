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
import { MoreHorizontal, Pencil, Trash2, Plus } from "lucide-react";
import { db } from "@/lib/db";
import Link from "next/link";

async function getNits() {
  return await db.nitDetails.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function NitTablePage() {
  const nits = await getNits();

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">NIT Table</CardTitle>
          <Link href="/nits/create" passHref>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New NIT
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Sl No</TableHead>
                <TableHead>Memo Number</TableHead>
                <TableHead>Memo Date</TableHead>
                <TableHead>Publishing Date</TableHead>
                <TableHead>Is Supply</TableHead>
                <TableHead>Is Published</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nits.map((nit, index) => (
                <TableRow key={nit.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{nit.memoNumber}</TableCell>
                  <TableCell>
                    {new Date(nit.memoDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(nit.publishingDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{nit.isSupply ? "Yes" : "No"}</TableCell>
                  <TableCell>{nit.isPublished ? "Yes" : "No"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/admindashboard/manage-tender/edit/${nit.id}`}
                            className="flex items-center"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <form>
                            <input type="hidden" name="id" value={nit.id} />
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-100"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </Button>
                          </form>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
