
'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { useState } from "react"
import Image from "next/image"
import { addmemberdetails } from "@/action/memberAction"
import { MemberFormData, memberFormSchema } from "@/schema/member"
import { Loader2, Upload, UserPlus, IdCard, Contact, Banknote, Camera } from "lucide-react"
import { memberFormformSections, selectOptions } from "@/constants"
import { useRouter } from "next/navigation"

export default function MemberForm() {
  const router = useRouter()
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)

  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      salutation: "",
      firstName: "",
      middleName: "",
      lastName: "",
      fatherGuardianName: "",
      dob: "",
      gender: "",
      maritalStatus: "",
      religion: "",
      caste: "",
      eduQualification: "",
      computerLiterate: "",
      motherTongue: "",
      bloodGroup: "",
      contactNo: "",
      whatsappNo: "",
      email: "",
      address: "",
      village: "",
      pin: "",
      postOffice: "",
      district: "",
      policeStation: "",
      aadhar: "",
      pan: "",
      epic: "",
      profession: "",
      annualFamilyIncome: "",
      photo: undefined,
    },
  })

  const onSubmit = async (data: MemberFormData) => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'photo' && value instanceof File) {
            formData.append(key, value)
          } else {
            formData.append(key, value.toString())
          }
        }
      })

      const result = await addmemberdetails(formData)

      if (result.error) {
        throw new Error(result.error)
      }

      if (result.success) {
        toast({
          title: "Success",
          description: result.success,
        })
        form.reset()
        setPhotoPreview(null)

        setIsNavigating(true)
        setTimeout(() => {
          router.push('/admindashboard/viewmenberdetails')
        }, 0)
      }
    } catch (error) {
      console.error("Error submitting the form:", error)

      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while submitting the form. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderField = (name: keyof MemberFormData) => {
    if (selectOptions[name as keyof typeof selectOptions]) {
      return (
        <Select
          onValueChange={(value) => form.setValue(name, value)}
          value={form.getValues(name) as string | undefined}
        >
          <FormControl>
            <SelectTrigger className="hover:border-primary">
              <SelectValue placeholder={`Select ${name}`} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {selectOptions[name as keyof typeof selectOptions].map((option) => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }

    if (name === 'photo') {
      return (
        <div className="space-y-4">
          <label 
            htmlFor="photo-upload" 
            className="group relative block w-full h-32 border-2 border-dashed border-muted rounded-lg hover:border-primary transition-colors cursor-pointer"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
              <span className="text-sm font-medium text-muted-foreground group-hover:text-primary">
                Click to upload photo
              </span>
              <span className="text-xs text-muted-foreground">
                PNG, JPG, WEBP (max 2MB)
              </span>
            </div>
            <Input
              id="photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  form.setValue('photo', file)
                  setPhotoPreview(URL.createObjectURL(file))
                }
              }}
            />
          </label>
          {photoPreview && (
            <div className="relative w-40 h-40 rounded-md overflow-hidden border">
              <Image
                src={photoPreview}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      )
    }

    return <Input {...form.register(name)} className="focus-visible:ring-primary hover:border-primary" />
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <UserPlus className="h-12 w-12 mx-auto text-primary" />
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Member Registration
          </h1>
          <p className="text-muted-foreground">
            Please fill in all required details carefully
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {memberFormformSections.map((section) => (
              <Card key={section.title} className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="bg-muted/50 border-b">
                  <div className="flex items-center gap-3">
                    {section.title === 'Personal Information' && <IdCard className="h-5 w-5" />}
                    {section.title === 'Contact Details' && <Contact className="h-5 w-5" />}
                    {section.title === 'Financial Information' && <Banknote className="h-5 w-5" />}
                    <CardTitle className="text-lg font-semibold">
                      {section.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                  {section.fields.map((field) => (
                    <FormField
                      key={field}
                      control={form.control}
                      name={field as keyof MemberFormData}
                      render={({ field: { onChange, ...fieldProps } }) => (
                        <FormItem className={['address', 'photo'].includes(field) ? 'col-span-full' : ''}>
                          <FormLabel className="font-medium flex items-center gap-2">
                            {field === 'photo' && <Camera className="h-4 w-4" />}
                            {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                          </FormLabel>
                          <FormControl>
                            {renderField(field as keyof MemberFormData)}
                          </FormControl>
                          <FormMessage className="text-xs text-red-600 flex items-center gap-1" />
                        </FormItem>
                      )}
                    />
                  ))}
                </CardContent>
              </Card>
            ))}

            <div className="sticky bottom-0 bg-background py-4 border-t">
              <Button
                type="submit"
                className="w-full max-w-xs mx-auto flex gap-2 py-6 text-lg font-semibold shadow-lg hover:shadow-primary/30 transition-shadow"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Saving Details...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    Register Member
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
