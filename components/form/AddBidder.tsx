"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useCallback, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import type { AgencyDetails } from "@prisma/client"
import { ChevronDown, Check } from "lucide-react"

import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { addBiderDetails, getAgencyDetails } from "@/action/bookNitNuber"
import { useToast } from "@/components/ui/use-toast"

// Add this array of colors
const agencyColors = [
  "bg-red-100",
  "bg-blue-100",
  "bg-green-100",
  "bg-yellow-100",
  "bg-purple-100",
  "bg-pink-100",
  "bg-indigo-100",
  "bg-teal-100",
]

export const biderdetailsValidationSchema = z.object({
  bidderdetails: z.array(z.string()).min(1, "Please select at least one bidder"),
})

type FormValues = z.infer<typeof biderdetailsValidationSchema>

interface AddBidderTechnicalDetailsProps {
  workid: string
}

export default function AddBidderTechnicalDetails({ workid }: AddBidderTechnicalDetailsProps) {
  const { toast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const form = useForm<FormValues>({
    defaultValues: {
      bidderdetails: [],
    },
    resolver: zodResolver(biderdetailsValidationSchema),
  })

  const {
    data: agencyList,
    error: fetchError,
    isLoading,
  } = useQuery<AgencyDetails[], Error>({
    queryKey: ["getAgencyDetails"],
    queryFn: async () => {
      const result = await getAgencyDetails()
      if (!result) {
        throw new Error("No data returned from getAgencyDetails")
      }
      return result
    },
  })

  const onSubmit = useCallback(
    async (values: FormValues) => {
      try {
        const result = await addBiderDetails(values, workid)
        if (result?.error) {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          })
        } else if (result?.success) {
          toast({
            title: "Success",
            description: result.success,
          })
          form.reset()
          setIsModalOpen(false)
        }
      } catch (err) {
        console.error("Failed to add bidder details:", err)
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
      }
    },
    [form, workid, toast],
  )

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="p-4 text-center text-red-500 bg-red-100 rounded-lg">
        Error loading agency details. Please refresh the page.
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Add Bidder Details</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="bidderdetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Bidders</FormLabel>
                <FormControl>
                  <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full justify-between text-left font-normal">
                        <span>
                          {field.value.length > 0
                            ? `${field.value.length} bidder${field.value.length > 1 ? "s" : ""} selected`
                            : "Select bidders"}
                        </span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-semibold mb-4">Select Bidders</DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="h-[400px] pr-4 rounded-md border">
                        <div className="p-4 space-y-4">
                          {agencyList?.map((agency, index) => (
                            <div
                              key={agency.id}
                              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${agencyColors[index % agencyColors.length]} hover:bg-opacity-80`}
                            >
                              <Checkbox
                                id={agency.id}
                                checked={field.value.includes(agency.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...field.value, agency.id])
                                  } else {
                                    field.onChange(field.value.filter((id) => id !== agency.id))
                                  }
                                }}
                                className="h-4 w-4"
                              />
                              <label
                                htmlFor={agency.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-grow cursor-pointer"
                              >
                                {agency.name}
                              </label>
                              {field.value.includes(agency.id) && <Check className="h-4 w-4 text-primary" />}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      <div className="mt-4 flex justify-end">
                        <Button onClick={() => setIsModalOpen(false)}>Done</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </FormControl>
                <FormDescription>Select one or more bidders from the list</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Please wait..." : "Add"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

