import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/jwt'
import { Logger } from '@/lib/logger'
import { corsMiddleware, handleOptions } from '@/lib/cors-middleware'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://dfiwgngtifuqrrxkvknn.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmaXdnbmd0aWZ1cXJyeGt2a25uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI3NzMyMSwiZXhwIjoyMDgwODUzMzIxfQ.uCfJ5DzQ2QCiyXycTrHEaKh1EvAFbuP8HBORmBSPbX8";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function PUT(
  request: NextRequest,
  { params }: { params: { adminId: string } }
) {
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

    const { adminId } = params
    const { username, email, name, role, permissions } = await request.json()

    if (!username || !email) {
      return NextResponse.json({
        success: false,
        error: 'Kullanıcı adı ve e-posta gerekli'
      }, { status: 400, headers: corsHeaders })
    }

    // Ana admini koru
    if (adminId === 'test-admin-001') {
      return NextResponse.json({
        success: false,
        error: 'Ana admin düzenlenemez!'
      }, { status: 403, headers: corsHeaders })
    }

    // Önce admin_users tablosundan admin bilgilerini al
    const { data: existingAdmin, error: fetchError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', adminId)
      .single()

    if (fetchError) {
      return NextResponse.json({
        success: false,
        error: 'Admin bulunamadı'
      }, { status: 404, headers: corsHeaders })
    }

    // Users tablosunu güncelle
    const { data: updatedUser, error: userError } = await supabase
      .from('users')
      .update({
        fullname: name || username, // fullName değil fullname
        email: email,
        updatedat: new Date().toISOString()
      })
      .eq('id', existingAdmin.userid) // userId değil userid
      .select()
      .single()

    if (userError) {
      console.error('Supabase user update error:', userError)
      return NextResponse.json({
        success: false,
        error: 'Kullanıcı güncellenemedi: ' + userError.message
      }, { status: 500, headers: corsHeaders })
    }

    // Admin_users tablosunu güncelle
    const { data: updatedAdmin, error } = await supabase
      .from('admin_users')
      .update({
        role: role || 'admin',
        updatedat: new Date().toISOString()
      })
      .eq('id', adminId)
      .select()
      .single()

    if (error) {
      console.error('Supabase admin update error:', error)
      return NextResponse.json({
        success: false,
        error: 'Admin güncellenemedi: ' + error.message
      }, { status: 500, headers: corsHeaders })
    }

    await Logger.logAdminAction('', 'admin_updated', `Admin updated: ${email}`, {
      adminId: adminId,
      email: email,
      username: username,
      updatedAt: new Date().toISOString()
    })

    await Logger.logApiRequest(`/api/admins/${adminId}`, 'PUT', 200, Date.now() - startTime, undefined, undefined)

    return NextResponse.json({
      success: true,
      message: 'Admin başarıyla güncellendi',
      data: {
        id: updatedAdmin.id,
        userId: updatedUser.id,
        username: username,
        email: email,
        role: role || 'admin',
        updatedAt: updatedAdmin.updatedat,
        permissions: permissions || ['blog', 'users', 'settings', 'analytics']
      }
    }, { headers: corsHeaders })

  } catch (error: any) {
    console.error('Admin Update API Error:', error)
    await Logger.logError(error as Error, `PUT /api/admins/${params.adminId}`, undefined, undefined)
    
    return NextResponse.json({
      success: false,
      error: 'Admin güncellenemedi: ' + error.message
    }, { status: 500, headers: corsHeaders })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { adminId: string } }
) {
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

    const { adminId } = params

    // Ana admini koru
    if (adminId === 'test-admin-001') {
      return NextResponse.json({
        success: false,
        error: 'Ana admin silinemez!'
      }, { status: 403, headers: corsHeaders })
    }

    // Önce admin_users tablosundan admin bilgilerini al
    const { data: adminToDelete, error: fetchError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', adminId)
      .single()

    if (fetchError) {
      return NextResponse.json({
        success: false,
        error: 'Admin bulunamadı'
      }, { status: 404, headers: corsHeaders })
    }

    // Kullanıcı bilgilerini al
    const { data: userToDelete, error: userFetchError } = await supabase
      .from('users')
      .select('id, email, fullname') // fullName değil fullname
      .eq('id', adminToDelete.userid) // userId değil userid
      .single()

    if (userFetchError) {
      console.warn('User not found for admin:', adminId)
    }

    // Önce admin_users tablosundan sil
    const { error: adminDeleteError } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', adminId)

    if (adminDeleteError) {
      console.error('Supabase admin delete error:', adminDeleteError)
      return NextResponse.json({
        success: false,
        error: 'Admin silinemedi: ' + adminDeleteError.message
      }, { status: 500, headers: corsHeaders })
    }

    // Sonra users tablosundan sil (kullanıcı varsa)
    if (userToDelete) {
      const { error: userDeleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', userToDelete.id)

      if (userDeleteError) {
        console.error('Supabase user delete error:', userDeleteError)
        // Admin silindi ama kullanıcı silinemedi - logla ama devam et
        console.warn('Admin deleted but user deletion failed:', userDeleteError.message)
      }
    }

    await Logger.logAdminAction('', 'admin_deleted', `Admin deleted: ${userToDelete?.email || 'unknown'}`, {
      adminId: adminId,
      userId: userToDelete?.id || adminToDelete.userid, // userId değil userid
      email: userToDelete?.email || 'unknown',
      fullName: userToDelete?.fullname || 'unknown', // fullName değil fullname
      deletedAt: new Date().toISOString()
    })

    await Logger.logApiRequest(`/api/admins/${adminId}`, 'DELETE', 200, Date.now() - startTime, undefined, undefined)

    return NextResponse.json({
      success: true,
      message: 'Admin başarıyla silindi'
    }, { headers: corsHeaders })

  } catch (error: any) {
    console.error('Admin Delete API Error:', error)
    await Logger.logError(error as Error, `DELETE /api/admins/${params.adminId}`, undefined, undefined)
    
    return NextResponse.json({
      success: false,
      error: 'Admin silinemedi: ' + error.message
    }, { status: 500, headers: corsHeaders })
  }
}

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request)
}