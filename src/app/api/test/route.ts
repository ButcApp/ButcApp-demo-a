import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'Test endpoint working',
    timestamp: new Date().toISOString(),
    method: 'GET'
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    return NextResponse.json({
      message: 'Test endpoint working',
      timestamp: new Date().toISOString(),
      method: 'POST',
      receivedData: body
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to parse JSON',
      message: 'Test endpoint working',
      timestamp: new Date().toISOString(),
      method: 'POST'
    })
  }
}