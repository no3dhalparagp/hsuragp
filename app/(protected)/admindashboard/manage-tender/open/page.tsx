import { db } from "@/lib/db"
import { formatDateTime } from "@/utils/utils";


const page = async () => {
    const today = new Date();

    const maturetender = await db.nitDetails.findMany({
        where: {
            technicalBidOpeningDate: {
                lt: today, // Filter records where technicalBidOpeningDate is before today
            },
            WorksDetail: {
                some: {
                    tenderStatus: "published", // Only show nitDetails if there is a related WorksDetail with tenderStatus "published"
                },
            },
        },
        include: {
            WorksDetail: true, // Include the related WorksDetail records
        },
    });

    return (
        <div>
            <pre>

                {
                    JSON.stringify(maturetender, null, 2)
                }


            </pre>

            <div>
                {maturetender.map((item) => (
                    <div key={item.id}>
                        <div>{item.memoNumber}/DGP/2024</div><div>{formatDateTime(item.memoDate).dateOnly}</div>

                    </div>
                ))}
            </div>

        </div>
    )
}

export default page