import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Get today's quote
    let quote = await prisma.dailyQuote.findFirst({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    })

    // If no quote for today, get a random quote
    if (!quote) {
      const quotes = await prisma.dailyQuote.findMany()
      if (quotes.length > 0) {
        quote = quotes[Math.floor(Math.random() * quotes.length)]
      }
    }

    return NextResponse.json(quote)
  } catch (error) {
    console.error('Error fetching daily quote:', error)
    return NextResponse.json(
      { error: 'Failed to fetch daily quote' },
      { status: 500 }
    )
  }
}
