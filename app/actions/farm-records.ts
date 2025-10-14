'use server'

import { prisma } from '@/app/lib/prisma'
import { revalidatePath } from 'next/cache'

export interface FarmRecordInput {
  animalType: string
  quantity: number
  fodder: number
  deaths: number
  symptoms: string
  vaccinations: string
  date: string | Date
  userId?: string | null
}

// Guest user ID - used for unauthenticated users
const GUEST_USER_EMAIL = 'guest@farm.local'
const GUEST_USER_ID = '00000000-0000-0000-0000-000000000000'

// Get or create guest user
async function getOrCreateGuestUser() {
  try {
    // First, try to find by ID
    let guestUser = await prisma.user.findUnique({
      where: { id: GUEST_USER_ID },
    })

    if (guestUser) {
      return guestUser
    }

    // If not found by ID, try to find by email
    guestUser = await prisma.user.findUnique({
      where: { email: GUEST_USER_EMAIL },
    })

    if (guestUser) {
      return guestUser
    }

    // If still not found, create the guest user
    try {
      guestUser = await prisma.user.create({
        data: {
          id: GUEST_USER_ID,
          email: GUEST_USER_EMAIL,
          fullName: 'Guest User',
        },
      })
      return guestUser
    } catch (createError: any) {
      // If creation fails (e.g., ID or email already exists), try to fetch again
      // This handles race conditions
      guestUser = await prisma.user.findUnique({
        where: { id: GUEST_USER_ID },
      })
      if (guestUser) {
        return guestUser
      }
      guestUser = await prisma.user.findUnique({
        where: { email: GUEST_USER_EMAIL },
      })
      if (guestUser) {
        return guestUser
      }
      console.error('Error creating guest user:', createError)
      throw new Error('Failed to create or find guest user')
    }
  } catch (error) {
    console.error('Error getting guest user:', error)
    throw new Error('Failed to get guest user')
  }
}

export interface FarmRecordOutput {
  id: string
  userId: string
  animalType: string
  quantity: number
  fodder: number
  deaths: number
  symptoms: string
  vaccinations: string
  date: Date
  createdAt: Date
  updatedAt: Date
}

export async function getFarmRecords(userId?: string | null): Promise<FarmRecordOutput[]> {
  try {
    // If no userId provided, use guest user
    let finalUserId = userId
    if (!finalUserId) {
      const guestUser = await getOrCreateGuestUser()
      finalUserId = guestUser.id
    }

    const records = await prisma.farmRecord.findMany({
      where: { userId: finalUserId },
      orderBy: { date: 'desc' },
    })

    return records.map(record => ({
      ...record,
      date: record.date,
    }))
  } catch (error) {
    console.error('Error fetching farm records:', error)
    throw new Error('Failed to fetch farm records')
  }
}

export async function createFarmRecord(input: FarmRecordInput): Promise<FarmRecordOutput> {
  try {
    // If no userId provided, use guest user
    let userId = input.userId
    if (!userId) {
      const guestUser = await getOrCreateGuestUser()
      userId = guestUser.id
    }

    const record = await prisma.farmRecord.create({
      data: {
        userId,
        animalType: input.animalType,
        quantity: input.quantity,
        fodder: input.fodder,
        deaths: input.deaths,
        symptoms: input.symptoms,
        vaccinations: input.vaccinations,
        date: new Date(input.date),
      },
    })

    revalidatePath('/FarmRecords')
    revalidatePath('/Dashboard')

    return {
      ...record,
      date: record.date,
    }
  } catch (error) {
    console.error('Error creating farm record:', error)
    throw new Error('Failed to create farm record')
  }
}

export async function updateFarmRecord(
  id: string,
  input: Partial<FarmRecordInput>,
  userId?: string | null
): Promise<FarmRecordOutput> {
  try {
    // If no userId provided, use guest user
    let finalUserId = userId
    if (!finalUserId) {
      const guestUser = await getOrCreateGuestUser()
      finalUserId = guestUser.id
    }

    // Verify the record belongs to the user (or guest user)
    const existingRecord = await prisma.farmRecord.findFirst({
      where: { id, userId: finalUserId },
    })

    if (!existingRecord) {
      throw new Error('Record not found or you do not have permission to update it')
    }

    const updateData: any = {}
    if (input.animalType !== undefined) updateData.animalType = input.animalType
    if (input.quantity !== undefined) updateData.quantity = input.quantity
    if (input.fodder !== undefined) updateData.fodder = input.fodder
    if (input.deaths !== undefined) updateData.deaths = input.deaths
    if (input.symptoms !== undefined) updateData.symptoms = input.symptoms
    if (input.vaccinations !== undefined) updateData.vaccinations = input.vaccinations
    if (input.date !== undefined) updateData.date = new Date(input.date)

    const record = await prisma.farmRecord.update({
      where: { id },
      data: updateData,
    })

    revalidatePath('/FarmRecords')
    revalidatePath('/Dashboard')

    return {
      ...record,
      date: record.date,
    }
  } catch (error) {
    console.error('Error updating farm record:', error)
    throw new Error('Failed to update farm record')
  }
}

export async function deleteFarmRecord(id: string, userId?: string | null): Promise<void> {
  try {
    // If no userId provided, use guest user
    let finalUserId = userId
    if (!finalUserId) {
      const guestUser = await getOrCreateGuestUser()
      finalUserId = guestUser.id
    }

    // Verify the record belongs to the user (or guest user)
    const existingRecord = await prisma.farmRecord.findFirst({
      where: { id, userId: finalUserId },
    })

    if (!existingRecord) {
      throw new Error('Record not found or you do not have permission to delete it')
    }

    await prisma.farmRecord.delete({
      where: { id },
    })

    revalidatePath('/FarmRecords')
    revalidatePath('/Dashboard')
  } catch (error) {
    console.error('Error deleting farm record:', error)
    throw new Error('Failed to delete farm record')
  }
}

