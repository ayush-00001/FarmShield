'use server'

import { prisma } from '@/app/lib/prisma'
import { revalidatePath } from 'next/cache'

export interface RiskAssessmentInput {
  score: number
  maxScore: number
  riskLevel: 'low' | 'medium' | 'high'
  riskPercentage: number
  answers: Record<string, string>
  recommendations?: string[]
  userId: string
}

export interface RiskAssessmentOutput {
  id: string
  userId: string
  score: number
  maxScore: number
  riskLevel: string
  riskPercentage: number
  answers: any
  recommendations: any
  createdAt: Date
  updatedAt: Date
}

export async function getRiskAssessments(userId: string): Promise<RiskAssessmentOutput[]> {
  try {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const assessments = await prisma.riskAssessment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return assessments
  } catch (error) {
    console.error('Error fetching risk assessments:', error)
    throw new Error('Failed to fetch risk assessments')
  }
}

export async function getLatestRiskAssessment(userId: string): Promise<RiskAssessmentOutput | null> {
  try {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const assessment = await prisma.riskAssessment.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return assessment
  } catch (error) {
    console.error('Error fetching latest risk assessment:', error)
    throw new Error('Failed to fetch latest risk assessment')
  }
}

export async function createRiskAssessment(
  input: RiskAssessmentInput
): Promise<RiskAssessmentOutput> {
  try {
    if (!input.userId) {
      throw new Error('User ID is required')
    }

    const assessment = await prisma.riskAssessment.create({
      data: {
        userId: input.userId,
        score: input.score,
        maxScore: input.maxScore,
        riskLevel: input.riskLevel,
        riskPercentage: input.riskPercentage,
        answers: input.answers,
        recommendations: input.recommendations || null,
      },
    })

    revalidatePath('/RiskAssesment')
    revalidatePath('/Dashboard')

    return assessment
  } catch (error) {
    console.error('Error creating risk assessment:', error)
    throw new Error('Failed to create risk assessment')
  }
}

export async function getRiskTrendData(userId: string, days: number = 30) {
  try {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const assessments = await prisma.riskAssessment.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    return assessments.map(assessment => ({
      date: assessment.createdAt.toISOString().split('T')[0],
      risk: assessment.riskPercentage,
    }))
  } catch (error) {
    console.error('Error fetching risk trend data:', error)
    throw new Error('Failed to fetch risk trend data')
  }
}

