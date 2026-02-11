import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Download form Page",
};

const onlineService = () => {
  return (
    <div className="p-2 h-screen">
      <div className="w-3/4 mx-auto mt-1 mb-2 flex justify-center items-center flex-col border border-orange-600 p-3">
        <div className="w-full flex justify-between ">
          <div className="text-center">
            <h1 className="text-lg  p-3">List of Online Form </h1>
          </div>
          <div className="flex w-full max-w-sm items-center  space-x-2">
            <Input type="text" placeholder="Search" />
            <Button type="submit">Search</Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sl No</TableHead>
              <TableHead className="text-left">Scheme Name</TableHead>
              <TableHead>Link</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">1</TableCell>
              <TableCell className="font-medium">Old age Pension</TableCell>
              <TableCell className="font-medium cursor-pointer">
                <button>Download</button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default onlineService;
