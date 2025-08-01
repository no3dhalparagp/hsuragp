import { Prisma } from "@prisma/client";

export type aoctype = Prisma.WorksDetailGetPayload<{
    include:{
        nitDetails: true;
        ApprovedActionPlanDetails: true;
        biddingAgencies:{
            include:{
                agencydetails:true;
               
            }
        }
    }
}>