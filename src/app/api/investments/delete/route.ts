import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth-service'
<<<<<<< HEAD
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://dfiwgngtifuqrrxkvknn.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmaXdnbmd0aWZ1cXJyeGt2a25uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI3NzMyMSwiZXhwIjoyMDgwODUzMzIxfQ.uCfJ5DzQ2QCiyXycTrHEaKh1EvAFbuP8HBORmBSPbX8";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

// DELETE - Delete investment
export async function DELETE(request: NextRequest) {
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
        error: 'Investment ID is required' 
      }, { status: 400 })
    }

    // Check if investment exists and belongs to user
    const { data: existingInvestment, error: fetchError } = await supabase
      .from('investments')
      .select('*')
      .eq('id', investmentId)
      .eq('userid', auth.user!.id)
      .single()

    if (fetchError || !existingInvestment) {
      return NextResponse.json({ 
        success: false,
        error: 'Investment not found' 
      }, { status: 404 })
    }

    // Delete investment
    const { error: deleteError } = await supabase
      .from('investments')
      .delete()
      .eq('id', investmentId)
      .eq('userid', auth.user!.id)

    if (deleteError) {
      console.error('Investment deletion error:', deleteError)
      return NextResponse.json({ 
        success: false,
        error: 'Failed to delete investment' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Investment deleted successfully' 
    })

  } catch (error) {
    console.error('Investment delete API error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
=======
import { db } from '@/lib/db'

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Investment ID is required'
      }, { status: 400 })
    }

    // Verify user authentication
    const authResult = await AuthService.verifyTokenForAPI(request)
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    // First check if investment belongs to the current user
    const investment = await db.investment.findUnique({
      where: { 
        id: id,
        userId: authResult.user.id 
      }
    })

    if (!investment) {
      return NextResponse.json({
        success: false,
        error: 'Investment not found or access denied'
      }, { status: 404 })
    }

    // Delete the investment
    await db.investment.delete({
      where: { id: id }
    })

    return NextResponse.json({
      success: true,
      message: 'Investment deleted successfully',
      data: { id }
    })

  } catch (error) {
    console.error('Delete investment API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
>>>>>>> origin/master
    }, { status: 500 })
  }
}