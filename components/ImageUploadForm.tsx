"use client";

import React, { useState, useTransition } from "react";
import { UploadButton } from "@/utils/uploadthing";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { heroImageSchema } from "@/schema";
import Image from "next/image";
import { removeHeroImage } from "@/action/removeHeroImage";
import { addheroImage } from "@/action/heroimage";
import { MdDelete } from "react-icons/md";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const ImageUploadForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [imageUrl, setImageUrl] = useState("");
  const [imageKey, setImageKey] = useState("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof heroImageSchema>>({
    resolver: zodResolver(heroImageSchema),
    defaultValues: {
      heroImageDescription: "",
    },
  });

  const handleRemove = async () => {
    try {
      const res = await removeHeroImage(imageKey);
      if (res?.success) {
        setImageUrl("");
        setImageKey("");
        setSuccess("Image successfully removed");
      }
    } catch (error) {
      setError("Failed to remove image");
    }
  };

  const onSubmit = async (values: z.infer<typeof heroImageSchema>) => {
    setError(undefined);
    setSuccess(undefined);
    const { heroImageDescription } = values;
    startTransition(() => {
      addheroImage(heroImageDescription, imageKey, imageUrl)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
            setImageUrl("");
            setImageKey("");
          }
          if (data?.success) {
            form.reset();
            setSuccess(data.success);
            setImageUrl("");
            setImageKey("");
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      {success && (
        <Alert className="mb-4">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="heroImageDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter image description"
                    type="text"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col items-center space-y-4">
            <UploadButton
              endpoint="profilePicture"
              onClientUploadComplete={(res) => {
                setImageUrl(res[0].url);
                setImageKey(res[0].key);
              }}
              onUploadError={(error: Error) => {
                setError(error.message);
              }}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isPending || !imageUrl}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </Form>
      {imageUrl && (
        <div className="mt-4 border border-gray-200 rounded-lg p-4">
          <div className="relative aspect-video">
            <Image
              src={imageUrl}
              alt="Uploaded image"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          <Button
            onClick={handleRemove}
            variant="destructive"
            className="mt-2 w-full"
          >
            <MdDelete className="mr-2" size={20} />
            Remove Image
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUploadForm;