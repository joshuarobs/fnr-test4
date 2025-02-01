import { PrismaClient, ActivityType } from '@prisma/client';

export async function seedItemActivities(
  prisma: PrismaClient,
  createdClaim: { id: number; claimNumber: string },
  handlerId: number | undefined,
  items: any[]
) {
  if (!handlerId) return;

  // Create individual activities for each item, matching the API behavior
  for (const item of items) {
    await prisma.activityLog.create({
      data: {
        activityType: ActivityType.ITEM_CREATED,
        userId: handlerId,
        claimId: createdClaim.id,
        metadata: {
          itemName: item.name,
          category: item.category,
          roomCategory: item.roomCategory,
          group: item.group,
          modelSerialNumber: item.modelSerialNumber,
          description: item.description,
          quantity: item.quantity,
          purchaseDate: item.purchaseDate,
          age: item.age,
          condition: item.condition,
          insuredsQuote: item.insuredsQuote,
          ourQuote: item.ourQuote,
          itemStatus: item.itemStatus,
        },
        items: {
          create: {
            item: {
              connect: {
                id: item.id,
              },
            },
          },
        },
      },
    });
  }
}
