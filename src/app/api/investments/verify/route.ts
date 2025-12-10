import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { AuthService } from '@/lib/auth-service'

const supabaseUrl = "https://dfiwgngtifuqrrxkvknn.supabase.co"
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmaXdnbmd0aWZ1cXJyeGt2a25uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI3NzMyMSwiZXhwIjoyMDgwODUzMzIxfQ.uCfJ5DzQ2QCiyXycTrHEaKh1EvAFbuP8HBORmBSPbX8"
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Authentication middleware
async function authenticate(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '') ||
                request.nextUrl.searchParams.get('token')
  
  if (!token) {
    return { error: 'Unauthorized', status: 401 }
  }

  const auth = await AuthService.verifyToken(token)
  if (!auth) {
    return { error: 'Unauthorized', status: 401 }
  }

  return { user: auth, token }
}

// GET - Verify if investment exists and belongs to user
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticate(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { searchParams } = new URL(request.url)
    const investmentId = searchParams.get('id')

    if (!investmentId) {
      return NextResponse.json({ 
        success: false,
        error: 'Investment ID is required',
        exists: false
      }, { status: 400 })
    }

    // Check if investment exists and belongs to user
    const { data: investment, error } = await supabase
      .from('investments')
      .select('id')
      .eq('id', investmentId)
      .eq('userid', auth.user!.id)
      .maybeSingle()

    if (error || !investment) {
      return NextResponse.json({
        success: false,
        error: 'Investment not found or access denied',
        exists: false
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      exists: true,
      investmentId: investment.id
    })

  } catch (error) {
    console.error('Investment verification error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      exists: false
    }, { status: 500 })
  }
}
