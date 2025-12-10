import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth-service'

<<<<<<< HEAD
// GET /api/auth/me - Get current user info
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '') ||
                  request.nextUrl.searchParams.get('token')

    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'Oturum bulunamadı',
        debug: {
          environment: 'development',
          authHeader: request.headers.get('authorization')
        }
      }, { status: 401 })
    }

    const user = await AuthService.verifyToken(token)
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Oturum bulunamadı',
        debug: {
          environment: 'development',
          authHeader: request.headers.get('authorization')
        }
=======
export async function GET(request: NextRequest) {
  try {
    const user = await AuthService.getCurrentUserFromRequest(request)

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Oturum bulunamadı'
>>>>>>> origin/master
      }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
<<<<<<< HEAD
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl
      }
=======
      user
>>>>>>> origin/master
    })

  } catch (error) {
    console.error('Auth me error:', error)
    return NextResponse.json({
      success: false,
<<<<<<< HEAD
      error: 'Internal server error',
      debug: {
        environment: 'development',
        error: (error as Error).message
      }
=======
      error: 'Kullanıcı bilgileri alınamadı'
>>>>>>> origin/master
    }, { status: 500 })
  }
}