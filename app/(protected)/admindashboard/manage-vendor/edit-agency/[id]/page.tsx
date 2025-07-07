import { Suspense } from "react";
import EditVendorForm from "@/components/form/Edit-vendor-details-form";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { AgencyDetails } from "@prisma/client";
import { z } from "zod";
import { vendorSchema } from "@/schema/venderschema";

interface PageProps {
  params: { id: string };
}

async function getAgencyDetails(id: string): Promise<AgencyDetails | null> {
  const agency = await db.agencyDetails.findUnique({
    where: { id },
  });

  return agency;
}

export default async function EditPage({ params }: PageProps) {
  const agency = await getAgencyDetails(params.id);

  if (!agency) {
    notFound();
  }

  const defaultValues: Partial<z.infer<typeof vendorSchema>> = {
    name: agency.name,
    mobileNumber: agency.mobileNumber ?? undefined,
    email: agency.email ?? undefined,
    pan: agency.pan ?? undefined,
    tin: agency.tin ?? undefined,
    gst: agency.gst ?? undefined,
    postalAddress: agency.contactDetails,
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Edit Vendor Details</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <EditVendorForm defaultValues={defaultValues} id={params.id} />
      </Suspense>
    </div>
  );
}
