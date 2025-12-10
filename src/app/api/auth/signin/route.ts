import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth-service'
import { Logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const headersList = request.headers
  const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'
  const userAgent = headersList.get('user-agent') || 'unknown'

  try {
    const body = await request.json()
<<<<<<< HEAD
    
=======
>>>>>>> origin/master
    const { email, password, captchaAnswer } = body

    // Basic validation
    if (!email || !password) {
      await Logger.logSecurity('signin_validation_failed', 'Missing email or password', ipAddress, userAgent)
      return NextResponse.json({
        success: false,
<<<<<<< HEAD
        error: 'E-posta ve şifre gereklidir'
      }, { status: 400 })
    }

    // CAPTCHA validation
    if (!captchaAnswer || captchaAnswer.trim() === '') {
      await Logger.logSecurity('signin_validation_failed', 'Missing CAPTCHA', ipAddress, userAgent)
      return NextResponse.json({
        success: false,
        error: 'İnsan doğrulaması gereklidir'
      }, { status: 400 })
    }

    // Basic CAPTCHA validation
    if (!/^\d+$/.test(captchaAnswer.trim())) {
=======
        error: 'Email ve şifre zorunludur'
      }, { status: 400 })
    }

    // CAPTCHA validation (optional for now)
    if (captchaAnswer && !/^\d+$/.test(captchaAnswer.trim())) {
>>>>>>> origin/master
      await Logger.logSecurity('signin_validation_failed', 'Invalid CAPTCHA format', ipAddress, userAgent)
      return NextResponse.json({
        success: false,
        error: 'Geçersiz doğrulama cevabı'
      }, { status: 400 })
    }

    const result = await AuthService.signIn(email, password)

    if (result.error) {
      await Logger.logSecurity('signin_failed', `Signin failed for email: ${email}`, ipAddress, userAgent, {
        email: email,
        error: result.error
      })
      return NextResponse.json({
        success: false,
        error: result.error
<<<<<<< HEAD
      }, { status: 400 })
=======
      }, { status: 401 })
>>>>>>> origin/master
    }

    // Log successful user signin
    await Logger.logUserLogin(result.user!.id, ipAddress, userAgent, true)

    await Logger.logApiRequest('/api/auth/signin', 'POST', 200, Date.now() - startTime, result.user!.id, undefined)

    return NextResponse.json({
      success: true,
      user: result.user,
      token: result.token,
<<<<<<< HEAD
      message: 'Giriş başarılı!'
    })

  } catch (error) {
    console.error('Signin API error:', error)
    console.error('Error stack:', (error as Error).stack)
    
    try {
      await Logger.logError(error as Error, 'POST /api/auth/signin', undefined, undefined)
      await Logger.logApiRequest('/api/auth/signin', 'POST', 500, Date.now() - startTime, undefined, undefined)
    } catch (logError) {
      console.error('Logging failed:', logError)
    }
    
    return NextResponse.json({
      success: false,
      error: 'Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
=======
      message: 'Giriş başarılı! Hoş geldiniz.'
    })

  } catch (error) {
    await Logger.logError(error as Error, 'POST /api/auth/signin', undefined, undefined)
    await Logger.logApiRequest('/api/auth/signin', 'POST', 500, Date.now() - startTime, undefined, undefined)
    
    return NextResponse.json({
      success: false,
      error: 'Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.'
>>>>>>> origin/master
    }, { status: 500 })
  }
}