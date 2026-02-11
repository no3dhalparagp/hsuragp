"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FormDownload } from "@/types/form";
import { deleteForm } from "@/action/public-action";

interface FormListProps {
  initialForms: FormDownload[];
  total: number;
  page: number;
  pageSize: number;
}

export default function FormList({
  initialForms,
  total,
  page,
  pageSize,
}: FormListProps) {
  const [forms, setForms] = useState<FormDownload[]>(initialForms);
  const router = useRouter();

  const handleDelete = async (id: FormDownload["id"]) => {
    try {
      await deleteForm(id);
      setForms(forms.filter((form) => form.id !== id));
    } catch (error) {
      console.error("Failed to delete form:", error);
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sl No</TableHead>
            <TableHead>Form Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Download</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {forms.map((form, i) => (
            <TableRow key={form.id}>
              <TableCell>{(page - 1) * pageSize + i + 1}</TableCell>
              <TableCell>{form.name}</TableCell>
              <TableCell>{form.category}</TableCell>
              <TableCell>
                <a
                  href={form.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Download
                </a>
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(form.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between mt-4">
        <Button
          onClick={() => router.push(`?page=${page - 1}`)}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          onClick={() => router.push(`?page=${page + 1}`)}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </>
  );
}
