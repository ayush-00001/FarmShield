'use server'

import { prisma } from '@/app/lib/prisma'
import { revalidatePath } from 'next/cache'

export interface AlertInput {
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  location: string
  date: string | Date
  source: string
  affectedSpecies: string[]
  recommendations: string[]
}

export interface AlertOutput {
  id: string
  title: string
  description: string
  severity: string
  location: string
  date: Date
  source: string
  affectedSpecies: string[]
  recommendations: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  isRead?: boolean
}

export async function getAlerts(
  userId?: string | null,
  filter?: {
    severity?: string
    unreadOnly?: boolean
  }
): Promise<AlertOutput[]> {
  try {
    // Get all active alerts
    const where: any = {
      isActive: true,
    }

    if (filter?.severity) {
      where.severity = filter.severity
    }

    const alerts = await prisma.alert.findMany({
      where,
      orderBy: { date: 'desc' },
    })

    // Get read status for each alert (if userId provided)
    let readAlertIds = new Set<string>()
    if (userId) {
      const readStatuses = await prisma.alertRead.findMany({
        where: {
          userId,
          alertId: {
            in: alerts.map(a => a.id),
          },
        },
      })
      readAlertIds = new Set(readStatuses.map(r => r.alertId))
    }

    let result = alerts.map(alert => ({
      ...alert,
      date: alert.date,
      isRead: userId ? readAlertIds.has(alert.id) : false,
    }))

    // Filter by unread if requested
    if (filter?.unreadOnly) {
      result = result.filter(alert => !alert.isRead)
    }

    return result
  } catch (error) {
    console.error('Error fetching alerts:', error)
    throw new Error('Failed to fetch alerts')
  }
}

export async function getUnreadAlertsCount(userId?: string | null): Promise<number> {
  try {
    const activeAlerts = await prisma.alert.findMany({
      where: { isActive: true },
      select: { id: true },
    })

    let readAlertIds = new Set<string>()
    if (userId) {
      const readAlerts = await prisma.alertRead.findMany({
        where: {
          userId,
          alertId: {
            in: activeAlerts.map(a => a.id),
          },
        },
        select: { alertId: true },
      })
      readAlertIds = new Set(readAlerts.map(r => r.alertId))
    }

    // Include predicted alerts count (always unread)
    const { analyzeFarmRecordsForDiseases } = await import('./disease-prediction')
    const predictedAlerts = await analyzeFarmRecordsForDiseases(userId)
    
    return activeAlerts.filter(a => !readAlertIds.has(a.id)).length + predictedAlerts.length
  } catch (error) {
    console.error('Error fetching unread alerts count:', error)
    throw new Error('Failed to fetch unread alerts count')
  }
}

export async function markAlertAsRead(alertId: string, userId?: string | null): Promise<void> {
  try {
    // For predicted alerts (starting with "predicted-"), we just skip marking as read
    // since they're generated dynamically
    if (alertId.startsWith('predicted-')) {
      // Predicted alerts can't be marked as read in database
      // They will be filtered out based on timestamp or user preference
      return
    }

    if (!userId) {
      // For guest users, we can't track read status in database
      // Could use localStorage on client side instead
      return
    }

    await prisma.alertRead.upsert({
      where: {
        userId_alertId: {
          userId,
          alertId,
        },
      },
      create: {
        userId,
        alertId,
      },
      update: {},
    })

    revalidatePath('/AlertCenter')
    revalidatePath('/Dashboard')
  } catch (error) {
    console.error('Error marking alert as read:', error)
    throw new Error('Failed to mark alert as read')
  }
}

export async function markAllAlertsAsRead(userId?: string | null): Promise<void> {
  try {
    if (!userId) {
      // For guest users, can't track read status
      return
    }

    const activeAlerts = await prisma.alert.findMany({
      where: { isActive: true },
      select: { id: true },
    })

    const readAlerts = await prisma.alertRead.findMany({
      where: {
        userId,
        alertId: {
          in: activeAlerts.map(a => a.id),
        },
      },
      select: { alertId: true },
    })

    const readAlertIds = new Set(readAlerts.map(r => r.alertId))
    const unreadAlerts = activeAlerts.filter(a => !readAlertIds.has(a.id))

    if (unreadAlerts.length > 0) {
      await prisma.alertRead.createMany({
        data: unreadAlerts.map(alert => ({
          userId,
          alertId: alert.id,
        })),
        skipDuplicates: true,
      })
    }

    revalidatePath('/AlertCenter')
    revalidatePath('/Dashboard')
  } catch (error) {
    console.error('Error marking all alerts as read:', error)
    throw new Error('Failed to mark all alerts as read')
  }
}

// Admin function to create alerts (you might want to protect this with admin check)
export async function createAlert(input: AlertInput): Promise<AlertOutput> {
  try {
    const alert = await prisma.alert.create({
      data: {
        title: input.title,
        description: input.description,
        severity: input.severity,
        location: input.location,
        date: new Date(input.date),
        source: input.source,
        affectedSpecies: input.affectedSpecies,
        recommendations: input.recommendations,
      },
    })

    revalidatePath('/AlertCenter')
    revalidatePath('/Dashboard')

    return {
      ...alert,
      date: alert.date,
      isRead: false,
    }
  } catch (error) {
    console.error('Error creating alert:', error)
    throw new Error('Failed to create alert')
  }
}

