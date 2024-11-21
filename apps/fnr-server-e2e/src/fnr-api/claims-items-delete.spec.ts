import { expect, test } from '@jest/globals';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const API_URL = process.env.API_URL || 'http://localhost:3333';

describe('Claims Items Delete API', () => {
  let testClaimNumber: string;
  let testClaimId: number;
  let testItemId: number;

  beforeAll(async () => {
    // Create a test claim and item
    const claim = await prisma.claim.create({
      data: {
        claimNumber: 'TEST-DELETE-001',
        policyNumber: 'POL-001',
        description: 'Test Claim for Delete Tests',
        incidentDate: new Date(),
        totalClaimed: 0,
        insuredId: 1,
        handlerId: 1,
        creatorId: 1,
      },
    });

    const item = await prisma.item.create({
      data: {
        name: 'Test Item for Deletion',
        claimId: claim.id,
        quantity: 1,
      },
    });

    testClaimNumber = claim.claimNumber;
    testClaimId = claim.id;
    testItemId = item.id;
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.item.deleteMany({
      where: { claimId: testClaimId },
    });
    await prisma.claim.deleteMany({
      where: { id: testClaimId },
    });
  });

  test('should soft delete an item', async () => {
    const response = await request(API_URL)
      .post(`/api/claims/${testClaimNumber}/items/${testItemId}/soft-delete`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Item soft deleted');

    // Verify the item is soft deleted
    const item = await prisma.item.findUnique({
      where: { id: testItemId },
    });

    expect(item?.isDeleted).toBe(true);
    expect(item?.deletedAt).toBeTruthy();
  });

  test('should hard delete an item', async () => {
    // Create a new item for hard delete test
    const newItem = await prisma.item.create({
      data: {
        name: 'Test Item for Hard Deletion',
        claimId: testClaimId,
        quantity: 1,
      },
    });

    const response = await request(API_URL)
      .delete(`/api/claims/${testClaimNumber}/items/${newItem.id}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Item permanently deleted');

    // Verify the item is completely deleted
    const item = await prisma.item.findUnique({
      where: { id: newItem.id },
    });

    expect(item).toBeNull();
  });

  test('should return 404 for non-existent claim', async () => {
    const response = await request(API_URL)
      .post(`/api/claims/NONEXISTENT/items/1/soft-delete`)
      .expect(404);

    expect(response.body.error).toBe('Claim not found');
  });

  test('should return 404 for non-existent item', async () => {
    const response = await request(API_URL)
      .post(`/api/claims/${testClaimNumber}/items/999999/soft-delete`)
      .expect(404);

    expect(response.body.error).toBe('Item not found in claim');
  });
});
