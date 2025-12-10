import { NextRequest, NextResponse } from 'next/server'
<<<<<<< HEAD
import { AuthService } from '@/lib/auth-service'

export async function POST(request: NextRequest) {
  try {
    console.log('=== ADMIN ACCESS API START ===')
    
    const token = request.cookies.get('auth-token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '') ||
                  request.nextUrl.searchParams.get('token')

    if (!token) {
      console.log('❌ No token provided for admin access check')
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
        isAdmin: false
      }, { status: 401 })
    }

    console.log('🔍 Verifying token for admin access...')
    const user = await AuthService.verifyToken(token)
    
    if (!user) {
      console.log('❌ Invalid token for admin access')
      return NextResponse.json({
        success: false,
        error: 'Invalid token',
        isAdmin: false
      }, { status: 401 })
    }

    // Check if user is admin by checking admin_users table
    const { createClient } = await import('@supabase/supabase-js')
    const supabaseUrl = "https://dfiwgngtifuqrrxkvknn.supabase.co";
    const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmaXdnbmd0aWZ1cXJyeGt2a25uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI3NzMyMSwiZXhwIjoyMDgwODUzMzIxfQ.uCfJ5DzQ2QCiyXycTrHEaKh1EvAFbuP8HBORmBSPbX8";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('userid', user.id)
      .limit(1)

    if (error) {
      console.error('❌ Error checking admin access:', error)
      return NextResponse.json({
        success: false,
        error: 'Database error',
        isAdmin: false
      }, { status: 500 })
    }

    const isAdmin = adminUser && adminUser.length > 0
    
    console.log('✅ Admin access check completed for:', user.email, 'Admin:', isAdmin)
    console.log('=== ADMIN ACCESS API END ===')

    return NextResponse.json({
      success: true,
      isAdmin: isAdmin,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName
=======
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email is required'
      }, { status: 400 })
    }

    // Check if user exists and is admin
    const adminUser = await db.adminUser.findUnique({
      where: {
        user: {
          email: email.toLowerCase().trim()
        }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            avatarUrl: true
          }
        }
      }
    })

    if (!adminUser) {
      return NextResponse.json({
        success: false,
        error: 'Admin user not found'
      }, { status: 404 })
    }

    // Generate admin token
    const jwt = await import('jsonwebtoken')
    const JWT_SECRET = process.env.JWT_SECRET || 'butcapp-secret-key-change-in-production-2024'
    const token = jwt.sign(
      { 
        userId: adminUser.user.id, 
        email: adminUser.user.email,
        role: 'admin'
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    )

    return NextResponse.json({
      success: true,
      data: {
        adminUser: {
          id: adminUser.user.id,
          email: adminUser.user.email,
          fullName: adminUser.user.fullName,
          role: adminUser.role
        },
        token
      }
    }, {
      headers: {
        'Set-Cookie': `auth-token=${token}; Path=/; Max-Age=${24 * 60 * 60}; SameSite=Lax`
>>>>>>> origin/master
      }
    })

  } catch (error) {
<<<<<<< HEAD
    console.error('❌ Admin access API error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      isAdmin: false,
      details: (error as Error).message
=======
    console.error('Admin access API Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Admin access failed: ' + (error as Error).message
>>>>>>> origin/master
    }, { status: 500 })
  }
}