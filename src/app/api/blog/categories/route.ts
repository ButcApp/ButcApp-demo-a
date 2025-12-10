import { NextRequest, NextResponse } from 'next/server'
<<<<<<< HEAD
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://dfiwgngtifuqrrxkvknn.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmaXdnbmd0aWZ1cXJyeGt2a25uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI3NzMyMSwiZXhwIjoyMDgwODUzMzIxfQ.uCfJ5DzQ2QCiyXycTrHEaKh1EvAFbuP8HBORmBSPbX8";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET - Fetch blog categories
export async function GET(request: NextRequest) {
  try {
    // Get distinct categories from blog_posts
    const { data: categories, error } = await supabase
      .from('blog_posts')
      .select('category')
      .eq('status', 'published')

    if (error) {
      console.error('Categories fetch error:', error)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to fetch categories' 
      }, { status: 500 })
    }

    // Count posts per category
    const categoryCounts: Record<string, number> = {}
    categories?.forEach(post => {
      if (post.category) {
        categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1
      }
    })

    // Transform to expected format
    const transformedCategories = Object.entries(categoryCounts).map(([name, count]) => ({
      id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: name,
      slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      description: `${name} ile ilgili yazılar`,
      postCount: count,
      color: getCategoryColor(name)
    }))

    // Add default categories if they don't exist
    const defaultCategories = [
      { id: 'genel', name: 'Genel', slug: 'genel', description: 'Genel finans yazıları', postCount: 0, color: '#6366f1' },
      { id: 'butce-yonetimi', name: 'Bütçe Yönetimi', slug: 'butce-yonetimi', description: 'Bütçe planlama ve takip', postCount: 0, color: '#10b981' },
      { id: 'yatirim', name: 'Yatırım', slug: 'yatirim', description: 'Yatırım stratejileri ve tavsiyeler', postCount: 0, color: '#f59e0b' },
      { id: 'birikim', name: 'Birikim', slug: 'birikim', description: 'Para biriktirme teknikleri', postCount: 0, color: '#ef4444' },
      { id: 'kredi', name: 'Kredi', slug: 'kredi', description: 'Kredi ve borç yönetimi', postCount: 0, color: '#8b5cf6' }
    ]

    // Merge with existing categories
    const allCategories = [...defaultCategories]
    
    transformedCategories.forEach(category => {
      const existingIndex = allCategories.findIndex(c => c.id === category.id)
      if (existingIndex >= 0) {
        allCategories[existingIndex].postCount = category.postCount
      } else {
        allCategories.push(category)
=======
import { db } from '@/lib/db'
import { BlogCategoryResponse } from '@/types/blog'

// GET /api/blog/categories - Fetch all blog categories
export async function GET() {
  try {
    const categories = await db.blogCategory.findMany({
      orderBy: { name: 'asc' }
    })

    const response: BlogCategoryResponse = {
      success: true,
      data: categories || []
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Blog categories API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error.message
    }, { status: 500 })
  }
}

// POST /api/blog/categories - Create new blog category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name) {
      return NextResponse.json({
        success: false,
        error: 'Category name is required'
      }, { status: 400 })
    }

    // Generate slug from name
    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    const category = await db.blogCategory.create({
      data: {
        name: body.name,
        slug: body.slug || slug,
        description: body.description || '',
        color: body.color || '#10b981',
        icon: body.icon || 'BookOpen'
>>>>>>> origin/master
      }
    })

    return NextResponse.json({
      success: true,
<<<<<<< HEAD
      data: allCategories
    })

  } catch (error) {
    console.error('Categories API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

// Helper function to assign colors to categories
function getCategoryColor(categoryName: string): string {
  const colors = [
    '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16'
  ]
  
  const index = categoryName.length % colors.length
  return colors[index]
=======
      data: category
    })

  } catch (error) {
    console.error('Blog categories POST error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error.message
    }, { status: 500 })
  }
>>>>>>> origin/master
}