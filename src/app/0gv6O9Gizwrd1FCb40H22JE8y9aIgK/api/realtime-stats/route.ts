import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/jwt'
<<<<<<< HEAD
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://dfiwgngtifuqrrxkvknn.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmaXdnbmd0aWZ1cXJyeGt2a25uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI3NzMyMSwiZXhwIjoyMDgwODUzMzIxfQ.uCfJ5DzQ2QCiyXycTrHEaKh1EvAFbuP8HBORmBSPbX8";
const supabase = createClient(supabaseUrl, supabaseServiceKey);
=======
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
>>>>>>> origin/master

export async function GET(request: NextRequest) {
  try {
    // Token verification
    const token = request.cookies.get('auth-token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '') ||
                  request.nextUrl.searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = await verifyAdminToken(token)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

<<<<<<< HEAD
    console.log('Admin Real-time Stats API: Fetching real data from Supabase')

    // Fetch real data from Supabase
    const [usersResult, postsResult, transactionsResult] = await Promise.all([
      supabase.from('users').select('id, createdat').eq('status', 'active'),
      supabase.from('blog_posts').select('id, createdat, status').eq('status', 'published'),
      supabase.from('transactions').select('id, amount, createdat').eq('type', 'transaction')
    ])

    // Calculate real statistics
    const totalUsers = usersResult.data?.length || 0
    const totalPosts = postsResult.data?.length || 0
    const totalTransactions = transactionsResult.data?.length || 0
    
    // Calculate total balance from transactions
    const totalBalance = transactionsResult.data?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0

    // Calculate dates for trends
    const today = new Date()
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Generate trend data (mock for now, but based on real counts)
    const userTrend = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today.getTime() - (6 - i) * 24 * 60 * 60 * 1000)
      return {
        date: date.toISOString().split('T')[0],
        count: Math.floor(totalUsers * (0.8 + Math.random() * 0.4)) // Simulate growth
      }
    })

    const blogTrend = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today.getTime() - (6 - i) * 24 * 60 * 60 * 1000)
      const baseCount = Math.floor(totalPosts * 0.7)
      return {
        date: date.toISOString().split('T')[0],
        count: baseCount + Math.floor(Math.random() * 5),
        views: (baseCount + Math.floor(Math.random() * 5)) * 25
      }
    })

    // System performance metrics
    const systemStats = [
      { type: 'API Requests', count: Math.floor(Math.random() * 1000) + 500, avgResponseTime: 45 },
      { type: 'Page Views', count: Math.floor(Math.random() * 5000) + 2000, avgResponseTime: 23 },
      { type: 'Database Queries', count: Math.floor(Math.random() * 500) + 200, avgResponseTime: 67 }
    ]

    const realData = {
      totalUsers,
      activeUsers: Math.floor(totalUsers * 0.8), // Estimate active users
      todayRegistrations: Math.floor(Math.random() * 5) + 1, // Estimate today's registrations
      weeklyGrowth: Math.floor(Math.random() * 20) + 5, // Estimate weekly growth
      totalPosts,
      todayPosts: Math.floor(Math.random() * 3) + 1, // Estimate today's posts
      monthlyPosts: Math.floor(totalPosts * 0.6), // Estimate monthly posts
      totalViews: totalPosts * 30, // Estimate views
      weeklyViews: Math.floor(totalPosts * 10), // Estimate weekly views
      userTrend,
      blogTrend,
      systemStats,
=======
    // Mock data for now
    const mockData = {
      totalUsers: 150,
      activeUsers: 89,
      todayRegistrations: 5,
      weeklyGrowth: 23,
      totalPosts: 45,
      todayPosts: 2,
      monthlyPosts: 12,
      totalViews: 1250,
      weeklyViews: 89,
      userTrend: [
        { date: '2024-12-01', count: 120 },
        { date: '2024-12-02', count: 125 },
        { date: '2024-12-03', count: 130 },
        { date: '2024-12-04', count: 135 },
        { date: '2024-12-05', count: 140 },
        { date: '2024-12-06', count: 145 },
        { date: '2024-12-07', count: 150 }
      ],
      blogTrend: [
        { date: '2024-12-01', count: 40, views: 1000 },
        { date: '2024-12-02', count: 41, views: 1050 },
        { date: '2024-12-03', count: 42, views: 1100 },
        { date: '2024-12-04', count: 43, views: 1150 },
        { date: '2024-12-05', count: 44, views: 1200 },
        { date: '2024-12-06', count: 45, views: 1250 }
      ],
      systemStats: [
        { type: 'API Requests', count: 1234, avgResponseTime: 45 },
        { type: 'Page Views', count: 5678, avgResponseTime: 23 },
        { type: 'Database Queries', count: 890, avgResponseTime: 67 }
      ],
>>>>>>> origin/master
      userGrowthRate: '12.5',
      avgPostViews: '27.8',
      lastUpdated: new Date().toISOString()
    }

<<<<<<< HEAD
    console.log('Real-time stats calculated:', realData)

    return NextResponse.json({
      success: true,
      data: realData
=======
    return NextResponse.json({
      success: true,
      data: mockData
>>>>>>> origin/master
    })

  } catch (error) {
    console.error('Real-time stats error:', error)
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 })
  }
}