 "use server";
 
 import { revalidatePath } from "next/cache";
 import { db } from "@/lib/db";
 import {
   LinkageApplicationStatus,
   LinkageValidationStatus,
   LinkageOwnershipStatus,
   RenewalStatus,
   DisputeStatus,
 } from "@prisma/client";
 
 type ActionResult<T = unknown> = {
   success: boolean;
   message?: string;
   error?: string;
   data?: T;
 };
 
type BeneficiaryTreeInput = {
  name: string;
  relation: string;
  age?: number;
  occupation?: string;
  children?: BeneficiaryTreeInput[];
};

async function createCertificateBeneficiariesRecursively(
  certificateId: string,
  nodes: BeneficiaryTreeInput[],
  parentId?: string,
) {
  for (const node of nodes) {
    const created = await db.linkageBeneficiary.create({
      data: {
        name: node.name,
        relation: node.relation,
        age: node.age,
        occupation: node.occupation,
        parentId,
        certificateId,
      },
    });
    if (node.children && node.children.length > 0) {
      await createCertificateBeneficiariesRecursively(
        certificateId,
        node.children,
        created.id,
      );
    }
  }
}

async function createApplicationBeneficiariesRecursively(
  applicationId: string,
  nodes: BeneficiaryTreeInput[],
  parentId?: string,
) {
  for (const node of nodes) {
    const created = await db.linkageApplicationBeneficiary.create({
      data: {
        name: node.name,
        relation: node.relation,
        age: node.age,
        occupation: node.occupation,
        parentId,
        applicationId,
      },
    });
    if (node.children && node.children.length > 0) {
      await createApplicationBeneficiariesRecursively(
        applicationId,
        node.children,
        created.id,
      );
    }
  }
}

 export async function createLinkageApplication(input: {
   applicationNo: string;
   applicantName: string;
   applicantPhone: string;
   applicantEmail?: string;
   applicantAddress: string;
   linkageType: string;
   linkedEntityName: string;
   linkedEntityAddress: string;
   documents?: string[];
  beneficiariesTree?: BeneficiaryTreeInput[];
  beneficiaries?: {
    id?: string;
    name: string;
    relation: string;
    age?: number;
    occupation?: string;
    parentId?: string;
  }[];
 }): Promise<ActionResult> {
   try {
     const exists = await db.linkageApplication.findUnique({
       where: { applicationNo: input.applicationNo },
     });
     if (exists) {
       return { success: false, error: "Application number already exists" };
     }
     const app = await db.linkageApplication.create({
       data: {
         applicationNo: input.applicationNo,
         applicantName: input.applicantName,
         applicantPhone: input.applicantPhone,
         applicantEmail: input.applicantEmail,
         applicantAddress: input.applicantAddress,
         linkageType: input.linkageType,
         linkedEntityName: input.linkedEntityName,
         linkedEntityAddress: input.linkedEntityAddress,
         documents: input.documents || [],
         status: LinkageApplicationStatus.SUBMITTED,
       },
     });
    if (input.beneficiariesTree && input.beneficiariesTree.length > 0) {
      await createApplicationBeneficiariesRecursively(
        app.id,
        input.beneficiariesTree,
      );
    } else if (input.beneficiaries && input.beneficiaries.length > 0) {
       for (const b of input.beneficiaries) {
         await db.linkageApplicationBeneficiary.create({
           data: {
             name: b.name,
             relation: b.relation,
             age: b.age,
             occupation: b.occupation,
             parentId: b.parentId || undefined,
             applicationId: app.id,
           },
         });
       }
     }
     revalidatePath("/admindashboard/manage-linkage/application");
     return { success: true, message: "Application created", data: app };
   } catch {
     return { success: false, error: "Failed to create application" };
   }
 }
 
 export async function listLinkageApplications(params?: {
   status?: LinkageApplicationStatus;
 }): Promise<ActionResult> {
   try {
     const where = params?.status ? { status: params.status } : {};
     const items = await db.linkageApplication.findMany({
       where,
       orderBy: { createdAt: "desc" },
     });
     return { success: true, data: items };
   } catch {
     return { success: false, error: "Failed to fetch applications" };
   }
 }
 
 export async function validateApplication(input: {
   applicationId: string;
   validatorName: string;
   findings?: string;
   approved: boolean;
 }): Promise<ActionResult> {
   try {
     const validation = await db.linkageDocumentValidation.upsert({
       where: { applicationId: input.applicationId },
       create: {
         applicationId: input.applicationId,
         validatorName: input.validatorName,
         validationDate: new Date(),
         findings: input.findings,
         status: input.approved
           ? LinkageValidationStatus.APPROVED
           : LinkageValidationStatus.REJECTED,
       },
       update: {
         validatorName: input.validatorName,
         validationDate: new Date(),
         findings: input.findings,
         status: input.approved
           ? LinkageValidationStatus.APPROVED
           : LinkageValidationStatus.REJECTED,
       },
     });
     await db.linkageApplication.update({
       where: { id: input.applicationId },
       data: {
         status: input.approved
           ? LinkageApplicationStatus.VALIDATED
           : LinkageApplicationStatus.REJECTED,
       },
     });
     revalidatePath("/admindashboard/manage-linkage/validate");
     return { success: true, message: "Validation updated", data: validation };
   } catch {
     return { success: false, error: "Failed to update validation" };
   }
 }
 
 export async function verifyOwnership(input: {
   applicationId: string;
   officerName: string;
   remarks?: string;
   confirmed: boolean;
 }): Promise<ActionResult> {
   try {
     const ownership = await db.linkageOwnershipVerification.upsert({
       where: { applicationId: input.applicationId },
       create: {
         applicationId: input.applicationId,
         officerName: input.officerName,
         verificationDate: new Date(),
         remarks: input.remarks,
         ownershipConfirmed: input.confirmed,
         status: input.confirmed
           ? LinkageOwnershipStatus.VERIFIED
           : LinkageOwnershipStatus.REJECTED,
       },
       update: {
         officerName: input.officerName,
         verificationDate: new Date(),
         remarks: input.remarks,
         ownershipConfirmed: input.confirmed,
         status: input.confirmed
           ? LinkageOwnershipStatus.VERIFIED
           : LinkageOwnershipStatus.REJECTED,
       },
     });
     await db.linkageApplication.update({
       where: { id: input.applicationId },
       data: {
         status: input.confirmed
           ? LinkageApplicationStatus.OWNERSHIP_VERIFIED
           : LinkageApplicationStatus.REJECTED,
       },
     });
     revalidatePath("/admindashboard/manage-linkage/ownership");
     return { success: true, message: "Ownership updated", data: ownership };
   } catch {
     return { success: false, error: "Failed to update ownership" };
   }
 }
 
 export async function issueLinkageCertificate(input: {
   applicationId: string;
   certificateNo: string;
   conditions?: string[];
   signedBy: string;
   signedDesignation: string;
  beneficiariesTree?: BeneficiaryTreeInput[];
  beneficiaries?: {
    id?: string;
    name: string;
    relation: string;
    age?: number;
    occupation?: string;
    parentId?: string;
  }[];
 }): Promise<ActionResult> {
   try {
     const exists = await db.linkageCertificate.findUnique({
       where: { certificateNo: input.certificateNo },
     });
     if (exists) {
       return { success: false, error: "Certificate number already exists" };
     }
     const cert = await db.linkageCertificate.create({
       data: {
         applicationId: input.applicationId,
         certificateNo: input.certificateNo,
         issueDate: new Date(),
         conditions: input.conditions || [],
         signedBy: input.signedBy,
         signedDesignation: input.signedDesignation,
       },
     });
   if (input.beneficiariesTree && input.beneficiariesTree.length > 0) {
     await createCertificateBeneficiariesRecursively(
       cert.id,
       input.beneficiariesTree,
     );
   } else if (input.beneficiaries && input.beneficiaries.length > 0) {
      for (const b of input.beneficiaries) {
        await db.linkageBeneficiary.create({
          data: {
            name: b.name,
            relation: b.relation,
            age: b.age,
            occupation: b.occupation,
            parentId: b.parentId || undefined,
            certificateId: cert.id,
          },
        });
      }
    }
     await db.linkageApplication.update({
       where: { id: input.applicationId },
       data: { status: LinkageApplicationStatus.ISSUED },
     });
     revalidatePath("/admindashboard/manage-linkage/issue");
     return { success: true, message: "Certificate issued", data: cert };
   } catch {
     return { success: false, error: "Failed to issue certificate" };
   }
 }
 
 export async function createRenewal(input: {
   certificateId: string;
   newExpiryDate?: Date;
   renewalReason: string;
   processedBy?: string;
 }): Promise<ActionResult> {
   try {
     const renewal = await db.linkageRenewal.create({
       data: {
         certificateId: input.certificateId,
         renewalDate: new Date(),
         newExpiryDate: input.newExpiryDate,
         renewalReason: input.renewalReason,
         status: RenewalStatus.PENDING,
         processedBy: input.processedBy,
       },
     });
     revalidatePath("/admindashboard/manage-linkage/renew");
     return { success: true, message: "Renewal created", data: renewal };
   } catch {
     return { success: false, error: "Failed to create renewal" };
   }
 }
 
 export async function createDispute(input: {
   certificateId: string;
   raisedByName: string;
   raisedByPhone: string;
   reason: string;
 }): Promise<ActionResult> {
   try {
     const dispute = await db.linkageDispute.create({
       data: {
         certificateId: input.certificateId,
         raisedByName: input.raisedByName,
         raisedByPhone: input.raisedByPhone,
         reason: input.reason,
         status: DisputeStatus.PENDING,
       },
     });
     revalidatePath("/admindashboard/manage-linkage/disputes");
     return { success: true, message: "Dispute created", data: dispute };
   } catch {
     return { success: false, error: "Failed to create dispute" };
   }
 }
 
