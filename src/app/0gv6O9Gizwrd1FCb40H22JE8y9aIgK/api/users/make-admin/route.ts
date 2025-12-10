import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/jwt'
import { Logger } from '@/lib/logger'
import { corsMiddleware, handleOptions } from '@/lib/cors-middleware'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://dfiwgngtifuqrrxkvknn.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmaXdnbmd0aWZ1cXJyeGt2a25uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI3NzMyMSwiZXhwIjoyMDgwODUzMzIxfQ.uCfJ5DzQ2QCiyXycTrHEaKh1EvAFbuP8HBORmBSPbX8";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  const optionsResponse = handleOptions(request)
  if (optionsResponse) return optionsResponse
  const corsHeaders = corsMiddleware(request)
  const startTime = Date.now()
  const headersList = request.headers
  const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'
  const userAgent = headersList.get('user-agent') || 'unknown'

  try {
    // Token doğrula
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      await Logger.logSecurity('unauthorized_access', 'No token provided', ipAddress, userAgent)
      return NextResponse.json({
        success: false,
        error: 'Yetkilendirme token\'ı gerekli'
      }, { status: 401, headers: corsHeaders })
    }

    const token = authHeader.substring(7)
    const isAdmin = await verifyAdminToken(token)
    
    if (!isAdmin) {
      await Logger.logSecurity('unauthorized_access', 'Invalid admin token', ipAddress, userAgent)
      return NextResponse.json({
        success: false,
        error: 'Geçersiz veya yetkisiz token'
      }, { status: 403, headers: corsHeaders })
    }

    const { userId, email, fullName } = await request.json()

    if (!userId || !email) {
      return NextResponse.json({
        success: false,
        error: 'Kullanıcı ID ve e-posta gerekli'
      }, { status: 400, headers: corsHeaders })
    }

    // Önce kullanıcının zaten admin olup olmadığını kontrol et
    const { data: existingAdmin, error: checkError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('userid', userId)
      .single()

    if (!checkError && existingAdmin) {
      return NextResponse.json({
        success: false,
        error: 'Bu kullanıcı zaten admin'
      }, { status: 409, headers: corsHeaders })
    }

    // Kullanıcının users tablosunda olduğunu kontrol et
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json({
        success: false,
        error: 'Kullanıcı bulunamadı'
      }, { status: 404, headers: corsHeaders })
    }

    // Admin_users tablosuna ekle
    const { data: newAdmin, error } = await supabase
      .from('admin_users')
      .insert({
        id: crypto.randomUUID(),
        userid: userId,
        role: 'admin',
        createdat: new Date().toISOString(),
        updatedat: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase admin creation error:', error)
      return NextResponse.json({
        success: false,
        error: 'Admin yapılamadı: ' + error.message
      }, { status: 500, headers: corsHeaders })
    }

    await Logger.logAdminAction('', 'user_promoted_to_admin', `User promoted to admin: ${email}`, {
      userId: userId,
      email: email,
      fullName: fullName,
      adminId: newAdmin.id,
      promotedAt: new Date().toISOString()
    })

    await Logger.logApiRequest('/api/users/make-admin', 'POST', 200, Date.now() - startTime, undefined, undefined)

    return NextResponse.json({
      success: true,
      message: 'Kullanıcı başarıyla admin yapıldı',
      data: {
        adminId: newAdmin.id,
        userId: userId,
        email: email,
        fullName: fullName,
        promotedAt: newAdmin.createdat
      }
    }, { headers: corsHeaders })

  } catch (error: any) {
    console.error('Make Admin API Error:', error)
    await Logger.logError(error as Error, 'POST /api/users/make-admin', undefined, undefined)
    
    return NextResponse.json({
      success: false,
      error: 'Admin yapılamadı: ' + error.message
    }, { status: 500, headers: corsHeaders })
  }
}

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request)
}