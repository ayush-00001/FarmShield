'use server'

import { prisma } from '@/app/lib/prisma'
import { getLatestRiskAssessment } from './risk-assessments'
import { getActivitiesByWeek, getActivityChartData } from './activities'
import { getUnreadAlertsCount } from './alerts'

export interface DashboardStats {
  currentRiskLevel: string
  riskPercentage: number
  activitiesThisWeek: number
  activeAlerts: number
  complianceScore: number
}

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  try {
    if (!userId) {
      throw new Error('User ID is required')
    }

    // Get latest risk assessment
    const latestAssessment = await getLatestRiskAssessment(userId)
    const currentRiskLevel = latestAssessment?.riskLevel || 'low'
    const riskPercentage = latestAssessment?.riskPercentage || 0

    // Get activities this week
    const activitiesThisWeek = await getActivitiesByWeek(userId)

    // Get active alerts count
    const activeAlerts = await getUnreadAlertsCount(userId)

    // Calculate compliance score based on recent activities and risk level
    // This is a simple calculation - you can make it more sophisticated
    let complianceScore = 100
    if (riskPercentage > 70) {
      complianceScore = 60
    } else if (riskPercentage > 40) {
      complianceScore = 80
    } else if (riskPercentage > 20) {
      complianceScore = 90
    }

    // Adjust based on activities
    if (activitiesThisWeek < 5) {
      complianceScore -= 10
    } else if (activitiesThisWeek > 10) {
      complianceScore += 5
    }

    complianceScore = Math.min(100, Math.max(0, complianceScore))

    return {
      currentRiskLevel,
      riskPercentage,
      activitiesThisWeek,
      activeAlerts,
      complianceScore,
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    throw new Error('Failed to fetch dashboard stats')
  }
}

export async function getRecentActivities(userId: string, limit: number = 5) {
  try {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const activities = await prisma.activity.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: limit,
    })

    return activities.map(activity => ({
      activity: activity.title,
      time: getTimeAgo(activity.date),
      status: activity.status,
    }))
  } catch (error) {
    console.error('Error fetching recent activities:', error)
    throw new Error('Failed to fetch recent activities')
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'Just now'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  }

  const diffInWeeks = Math.floor(diffInDays / 7)
  return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`
}

export async function getRiskDistribution(userId: string) {
  try {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const assessments = await prisma.riskAssessment.findMany({
      where: { userId },
      select: { riskLevel: true },
    })

    const distribution = {
      low: 0,
      medium: 0,
      high: 0,
    }

    assessments.forEach(assessment => {
      if (assessment.riskLevel in distribution) {
        distribution[assessment.riskLevel as keyof typeof distribution]++
      }
    })

    return distribution
  } catch (error) {
    console.error('Error fetching risk distribution:', error)
    throw new Error('Failed to fetch risk distribution')
  }
}

