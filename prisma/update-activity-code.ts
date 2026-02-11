import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting migration: Converting ALL integer activityCode values to String...');

  try {
    // We use $runCommandRaw to perform an updateMany with an aggregation pipeline.
    // This allows us to convert the existing field value to a string in place.
    // q: Matches any document where activityCode is a number (double, int, long, decimal)
    // u: Uses $toString to convert the value
    // multi: true applies it to all matching documents
    
    const result = await prisma.$runCommandRaw({
      update: "ApprovedActionPlanDetails",
      updates: [
        {
          q: { activityCode: { $type: "number" } }, 
          u: [
            { $set: { activityCode: { $toString: "$activityCode" } } }
          ],
          multi: true
        }
      ]
    });

    console.log('Raw command output:', JSON.stringify(result, null, 2));

    const res = result as any;
    if (res.n === 0) {
      console.log('No records found with activityCode as number.');
    } else {
      console.log(`Matched ${res.n} record(s).`);
      console.log(`Modified ${res.nModified} record(s).`);
    }

  } catch (error) {
    console.error('Error executing migration:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
