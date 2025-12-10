import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/jwt'
import { Logger } from '@/lib/logger'
import { corsMiddleware, handleOptions } from '@/lib/cors-middleware'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://dfiwgngtifuqrrxkvknn.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmaXdnbmd0aWZ1cXJyeGt2a25uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI3NzMyMSwiZXhwIjoyMDgwODUzMzIxfQ.uCfJ5DzQ2QCiyXycTrHEaKh1EvAFbuP8HBORmBSPbX8";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
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

    // Adminleri Supabase'den getir - admin_users tablosundan
    const { data: admins, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('createdat', { ascending: false })

    if (error) {
      console.error('Supabase admins fetch error:', error)
      return NextResponse.json({
        success: false,
        error: 'Adminler yüklenemedi: ' + error.message
      }, { status: 500, headers: corsHeaders })
    }

    // Her admin için kullanıcı bilgilerini ayrıca al
    const formattedAdmins = []
    for (const admin of (admins || [])) {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, email, fullname, avatarurl, createdat')
        .eq('id', admin.userid) // userId değil userid
        .single()

      if (!userError && user) {
        formattedAdmins.push({
          id: admin.id,
          userId: user.id,
          username: user.fullname || user.email.split('@')[0],
          email: user.email,
          role: admin.role || 'admin',
          createdAt: admin.createdat,
          lastLogin: user.createdat, // Placeholder
          active: true, // Varsayılan olarak aktif
          permissions: ['blog', 'users', 'settings', 'analytics'] // Varsayılan izinler
        })
      }
    }

    // Eğer hiç admin yoksa, varsayılan admin ekle
    if (formattedAdmins.length === 0) {
      const defaultAdmin = {
        id: 'test-admin-001',
        userId: 'test-user-001',
        username: 'admin',
        email: 'admin@butcapp.com',
        role: 'admin' as const,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        active: true,
        permissions: ['blog', 'users', 'settings', 'analytics']
      }
      formattedAdmins.push(defaultAdmin)
    }

    await Logger.logApiRequest('/api/admins', 'GET', 200, Date.now() - startTime, undefined, undefined)

    return NextResponse.json({
      success: true,
      data: formattedAdmins,
      count: formattedAdmins.length
    }, { headers: corsHeaders })

  } catch (error: any) {
    console.error('Admins API Error:', error)
    await Logger.logError(error as Error, 'GET /api/admins', undefined, undefined)
    
    return NextResponse.json({
      success: false,
      error: 'Adminler yüklenemedi: ' + error.message
    }, { status: 500, headers: corsHeaders })
  }
}

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

    const { username, email, name, role, password, permissions } = await request.json()

    if (!username || !email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Kullanıcı adı, e-posta ve şifre gerekli'
      }, { status: 400, headers: corsHeaders })
    }

    // Önce users tablosunda kullanıcı oluştur
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        id: crypto.randomUUID(),
        email: email,
        passwordhash: 'hashed-password', // passwordHash değil passwordhash
        fullname: name || username, // fullName değil fullname
        avatarurl: null, // avatarUrl değil avatarurl
        createdat: new Date().toISOString(),
        updatedat: new Date().toISOString()
      })
      .select()
      .single()

    if (userError) {
      console.error('Supabase user creation error:', userError)
      
      // Email duplicate hatası için özel mesaj
      if (userError.message.includes('duplicate key') && userError.message.includes('email')) {
        return NextResponse.json({
          success: false,
          error: 'Bu e-posta adresi zaten kullanılıyor. Lütfen farklı bir e-posta adresi deneyin.'
        }, { status: 409, headers: corsHeaders })
      }
      
      return NextResponse.json({
        success: false,
        error: 'Kullanıcı oluşturulamadı: ' + userError.message
      }, { status: 500, headers: corsHeaders })
    }

    // Sonra admin_users tablosunda admin oluştur
    const { data: newAdmin, error } = await supabase
      .from('admin_users')
      .insert({
        id: crypto.randomUUID(),
        userid: newUser.id, // userId değil userid
        role: role || 'admin',
        createdat: new Date().toISOString(),
        updatedat: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase admin creation error:', error)
      // Kullanıcıyı sil (admin oluşturulamazsa)
      await supabase.from('users').delete().eq('id', newUser.id)
      return NextResponse.json({
        success: false,
        error: 'Admin oluşturulamadı: ' + error.message
      }, { status: 500, headers: corsHeaders })
    }

    await Logger.logAdminAction('', 'admin_created', `New admin created: ${email}`, {
      adminId: newAdmin.id,
      email: email,
      username: username,
      createdAt: new Date().toISOString()
    })

    await Logger.logApiRequest('/api/admins', 'POST', 200, Date.now() - startTime, undefined, undefined)

    return NextResponse.json({
      success: true,
      message: 'Admin başarıyla oluşturuldu',
      data: {
        id: newAdmin.id,
        userId: newUser.id,
        username: username,
        email: email,
        role: role || 'admin',
        createdAt: newAdmin.createdat,
        active: true,
        permissions: permissions || ['blog', 'users', 'settings', 'analytics']
      }
    }, { headers: corsHeaders })

  } catch (error: any) {
    console.error('Admins API Error:', error)
    await Logger.logError(error as Error, 'POST /api/admins', undefined, undefined)
    
    return NextResponse.json({
      success: false,
      error: 'Admin oluşturulamadı: ' + error.message
    }, { status: 500, headers: corsHeaders })
  }
}

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request)
}