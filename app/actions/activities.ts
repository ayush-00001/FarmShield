'use server'

import { prisma } from '@/app/lib/prisma'
import { revalidatePath } from 'next/cache'

export interface ActivityInput {
  type: string
  title: string
  description?: string
  status?: 'completed' | 'pending' | 'in_progress'
  date: string | Date
  userId: string
}

export interface ActivityOutput {
  id: string
  userId: string
  type: string
  title: string
  description: string | null
  status: string
  date: Date
  createdAt: Date
  updatedAt: Date
}

export async function getActivities(userId: string, limit?: number): Promise<ActivityOutput[]> {
  try {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const activities = await prisma.activity.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: limit,
    })

    return activities
  } catch (error) {
    console.error('Error fetching activities:', error)
    throw new Error('Failed to fetch activities')
  }
}

export async function createActivity(input: ActivityInput): Promise<ActivityOutput> {
  try {
    if (!input.userId) {
      throw new Error('User ID is required')
    }

    const activity = await prisma.activity.create({
      data: {
        userId: input.userId,
        type: input.type,
        title: input.title,
        description: input.description || null,
        status: input.status || 'completed',
        date: new Date(input.date),
      },
    })

    revalidatePath('/Dashboard')
    revalidatePath('/FarmRecords')

    return activity
  } catch (error) {
    console.error('Error creating activity:', error)
    throw new Error('Failed to create activity')
  }
}

export async function getActivitiesByWeek(userId: string): Promise<number> {
  try {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const startOfWeek = new Date()
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
    startOfWeek.setHours(0, 0, 0, 0)

    const count = await prisma.activity.count({
      where: {
        userId,
        date: {
          gte: startOfWeek,
        },
      },
    })

    return count
  } catch (error) {
    console.error('Error fetching activities by week:', error)
    throw new Error('Failed to fetch activities by week')
  }
}

export async function getActivityChartData(userId: string) {
  try {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const activities = await prisma.activity.findMany({
      where: { userId },
      select: {
        type: true,
        date: true,
      },
      orderBy: { date: 'asc' },
    })

    // Group by month and type
    const grouped = activities.reduce((acc, activity) => {
      const month = activity.date.toISOString().slice(0, 7) // YYYY-MM
      if (!acc[month]) {
        acc[month] = {}
      }
      if (!acc[month][activity.type]) {
        acc[month][activity.type] = 0
      }
      acc[month][activity.type]++
      return acc
    }, {} as Record<string, Record<string, number>>)

    return grouped
  } catch (error) {
    console.error('Error fetching activity chart data:', error)
    throw new Error('Failed to fetch activity chart data')
  }
}

