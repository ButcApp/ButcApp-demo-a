import { NextRequest, NextResponse } from 'next/server'
import { generateToken } from '@/lib/jwt'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://dfiwgngtifuqrrxkvknn.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmaXdnbmd0aWZ1cXJyeGt2a25uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI3NzMyMSwiZXhwIjoyMDgwODUzMzIxfQ.uCfJ5DzQ2QCiyXycTrHEaKh1EvAFbuP8HBORmBSPbX8";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    // URL encoded body'yi parse et
    const body = await request.text()
    const params = new URLSearchParams(body)
    const username = params.get('username')
    const password = params.get('password')
    const captchaAnswer = params.get('captchaAnswer')

    console.log('Admin Auth API: Login attempt', { username, hasPassword: !!password })
    
    // URL decode username (özellikle & karakter içeren e-postalar için)
    const decodedUsername = decodeURIComponent(username || '')
    console.log('Admin Auth API: Decoded username:', decodedUsername)

    // Önce hardcoded admin credentials kontrolü
    const validCredentials = [
      { username: 'admin', password: 'admin123', role: 'admin', email: 'admin@butcapp.com' },
      { username: 'demo', password: 'demo123', role: 'admin', email: 'demo@butcapp.com' }
    ]

    const hardcodedUser = validCredentials.find(cred => cred.username === decodedUsername && cred.password === password)

    if (hardcodedUser) {
      console.log('Admin Auth API: Hardcoded credentials found')
      
      // Generate JWT token
      const token = await generateToken({
        id: hardcodedUser.username,
        username: hardcodedUser.username,
        email: hardcodedUser.email,
        role: hardcodedUser.role
      })

      console.log('Admin Auth API: Login successful', { username: decodedUsername, role: hardcodedUser.role })

      const userData = {
        id: hardcodedUser.username,
        username: hardcodedUser.username,
        email: hardcodedUser.email,
        name: hardcodedUser.username,
        role: hardcodedUser.role,
        lastLogin: new Date().toISOString()
      }

      const response = {
        success: true,
        data: {
          user: userData,
          token: token
        }
      }

      console.log('Admin Auth API: Response', JSON.stringify(response))

      return NextResponse.json(response, {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    // Eğer hardcoded kullanıcı yoksa, veritabanından kontrol et
    console.log('Admin Auth API: Checking database for user:', decodedUsername)
    
    // Önce users tablosunda kullanıcıyı ara (email veya ID ile)
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .or(`email.eq.${decodedUsername},id.eq.${decodedUsername}`) // Email veya ID ile ara
      .single()

    console.log('Admin Auth API: User query result:', { user, userError })

    if (userError || !user) {
      console.log('Admin Auth API: User not found in users table', userError)
      return NextResponse.json({
        success: false,
        error: 'Kullanıcı adı veya şifre hatalı'
      }, { 
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    // Sonra admin_users tablosunda kullanıcı admin mi diye kontrol et
    console.log('Admin Auth API: Checking if user is admin, userId:', user.id)
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('userid', user.id)
      .single()

    console.log('Admin Auth API: Admin query result:', { adminUser, adminError })

    if (adminError) {
      console.log('Admin Auth API: Admin not found in admin_users', adminError)
      
      // Basit şifre kontrolü (gerçek uygulamada hash karşılaştırması yapılmalı)
      // Test için: admin yapılan kullanıcıların şifresi "admin123" olsun
      const testPassword = password === "admin123"
      
      if (!testPassword) {
        console.log('Admin Auth API: Invalid password for user')
        return NextResponse.json({
          success: false,
          error: 'Kullanıcı adı veya şifre hatalı'
        }, { 
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        })
      }

      // Kullanıcı admin değil, giriş izni yok
      return NextResponse.json({
        success: false,
        error: 'Bu kullanıcı admin yetkisine sahip değil. Lütfen admin ile iletişime geçin.'
      }, { 
        status: 403,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    // Admin kullanıcısını bul, users tablosundan bilgilerini al
    const { data: adminUserData, error: adminUserDataError } = await supabase
      .from('users')
      .select('*')
      .eq('id', adminUser.userid)
      .single()

    if (adminUserDataError || !adminUserData) {
      console.log('Admin Auth API: Admin user not found in users table', adminUserDataError)
      return NextResponse.json({
        success: false,
        error: 'Kullanıcı bulunamadı'
      }, { 
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    // Basit şifre kontrolü (gerçek uygulamada hash karşılaştırması yapılmalı)
    // Test için: admin yapılan kullanıcıların şifresi "admin123" olsun
    const testPassword = password === "admin123"
    
    if (!testPassword) {
      console.log('Admin Auth API: Invalid password for admin')
      return NextResponse.json({
        success: false,
        error: 'Kullanıcı adı veya şifre hatalı'
      }, { 
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    // Generate JWT token
    const token = await generateToken({
      id: adminUserData.id,
      username: adminUserData.fullname || adminUserData.email,
      email: adminUserData.email,
      role: adminUser.role
    })

    console.log('Admin Auth API: Database login successful', { username: adminUserData.email, role: adminUser.role })

    const userData = {
      id: adminUserData.id,
      username: adminUserData.fullname || adminUserData.email,
      email: adminUserData.email,
      name: adminUserData.fullname,
      role: adminUser.role,
      lastLogin: new Date().toISOString()
    }

    const response = {
      success: true,
      data: {
        user: userData,
        token: token
      }
    }

    console.log('Admin Auth API: Response', JSON.stringify(response))

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    console.error('Admin Auth API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Giriş sırasında bir hata oluştu'
    }, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}