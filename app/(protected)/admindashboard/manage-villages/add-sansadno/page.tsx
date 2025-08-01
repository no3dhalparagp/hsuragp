"use client";

import React, { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Pencil, Trash2 } from "lucide-react";
import {
  addSansad,
  updateSansad,
  deleteSansad,
  getSansadList,
} from "@/action/villagemanage";
import { toast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Sansad {
  id: string;
  sansadname: string;
  sansadnumber: string;
}

const formSchema = z.object({
  sansadname: z.string().min(2, {
    message: "Sansad name must be at least 2 characters.",
  }),
  sansadnumber: z.string().min(1, {
    message: "Sansad number is required.",
  }),
});

// Wrapper functions for server actions
const addSansadWrapper = async (
  state: { success: boolean; message: string },
  formData: FormData
) => {
  const result = await addSansad(formData);
  return result;
};

const updateSansadWrapper = async (
  state: { success: boolean; message: string },
  formData: FormData
) => {
  const result = await updateSansad(formData);
  return result;
};

const deleteSansadWrapper = async (
  state: { success: boolean; message: string },
  formData: FormData
) => {
  const result = await deleteSansad(formData);
  return result;
};

export default function SansadManagement() {
  const [sansadList, setSansadList] = useState<Sansad[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sansadname: "",
      sansadnumber: "",
    },
  });

  const [addState, addAction] = useFormState(addSansadWrapper, {
    success: false,
    message: "",
  });
  const [updateState, updateAction] = useFormState(updateSansadWrapper, {
    success: false,
    message: "",
  });
  const [deleteState, deleteAction] = useFormState(deleteSansadWrapper, {
    success: false,
    message: "",
  });

  const fetchSansadList = async () => {
    try {
      const list = await getSansadList();
      setSansadList(list);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch Sansad list.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSansadList();
  }, []);

  useEffect(() => {
    const currentState = addState.message
      ? addState
      : updateState.message
      ? updateState
      : deleteState;

    if (currentState.message) {
      toast({
        title: currentState.success ? "Success" : "Error",
        description: currentState.message,
        variant: currentState.success ? "default" : "destructive",
      });

      if (currentState.success) {
        fetchSansadList();
        resetForm();
      }
    }
  }, [addState, updateState, deleteState]);

  const resetForm = () => {
    setEditingId(null);
    form.reset({ sansadname: "", sansadnumber: "" });
  };

  const handleEdit = (sansad: Sansad) => {
    setEditingId(sansad.id);
    form.reset({
      sansadname: sansad.sansadname,
      sansadnumber: sansad.sansadnumber,
    });
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    if (editingId) {
      formData.append("id", editingId);
      updateAction(formData);
    } else {
      addAction(formData);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sansad Management</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mb-8">
          <FormField
            control={form.control}
            name="sansadname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sansad Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Sansad Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sansadnumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sansad Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Sansad Number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <Button type="submit">{editingId ? "Update" : "Save"}</Button>
            {editingId && (
              <Button variant="outline" type="button" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sansad Name</TableHead>
            <TableHead>Sansad Number</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sansadList.map((sansad) => (
            <TableRow key={sansad.id}>
              <TableCell>{sansad.sansadname}</TableCell>
              <TableCell>{sansad.sansadnumber}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(sansad)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <form action={deleteAction}>
                    <input type="hidden" name="id" value={sansad.id} />
                    <Button variant="outline" size="icon" type="submit">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
