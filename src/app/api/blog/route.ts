import { NextRequest, NextResponse } from 'next/server'
<<<<<<< HEAD
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://dfiwgngtifuqrrxkvknn.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmaXdnbmd0aWZ1cXJyeGt2a25uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI3NzMyMSwiZXhwIjoyMDgwODUzMzIxfQ.uCfJ5DzQ2QCiyXycTrHEaKh1EvAFbuP8HBORmBSPbX8";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET - Fetch blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')

    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      // .eq('status', 'published') // Test için kaldırıldı

    // Apply filters
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }
    if (featured === 'true') {
      query = query.eq('featured', true)
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,excerpt.ilike.%${search}%`)
    }

    // Apply sorting and pagination
    query = query
      .order('createdat', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data: posts, error, count } = await query

    if (error) {
      console.error('Blog posts fetch error:', error)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to fetch blog posts' 
      }, { status: 500 })
    }

    // Transform posts to match frontend interface
    const transformedPosts = (posts || []).map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.cover_image,
      category: post.category,
      author: {
        name: post.author_name || 'ButcApp Team',
        avatar: post.author_avatar || '/images/default-avatar.png',
        bio: post.author_bio || 'Finansal okuryazarlık uzmanları'
      },
      publishedAt: post.createdat,
      updatedAt: post.updatedat,
      readingTime: post.reading_time || Math.ceil(post.content?.length / 1000) || 5,
      featured: post.featured || false,
      tags: post.tags ? post.tags.split(',').map((tag: string) => tag.trim()) : [],
      views: post.viewCount || 0,
      status: post.status
    }))

    return NextResponse.json({
=======
import { db } from '@/lib/db'
import { BlogPostResponse, BlogFilters, BlogPaginationOptions, CreateBlogPostRequest } from '@/types/blog'

// GET /api/blog - Fetch blog posts with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category') || undefined
    const featured = searchParams.get('featured') === 'true'
    const search = searchParams.get('search') || undefined
    const status = searchParams.get('status') || 'published'
    const sortBy = searchParams.get('sortBy') || 'publishedAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const author_id = searchParams.get('author_id') || undefined

    // Build WHERE clause
    const where: any = { status }
    
    if (category) {
      where.category = category
    }
    
    if (featured) {
      where.featured = true
    }
    
    if (author_id) {
      where.authorId = author_id
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
        { excerpt: { contains: search } }
      ]
    }

    // Count query
    const total = await db.blogPost.count({ where })

    // Data query
    const offset = (page - 1) * limit
    const posts = await db.blogPost.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: offset,
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true
          }
        }
      }
    })

    // Transform data to match our types
    const transformedPosts = posts.map(post => ({
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : [],
      meta_keywords: post.metaKeywords ? JSON.parse(post.metaKeywords) : [],
      author_name: post.author?.fullName || post.authorName,
      author_avatar: post.author?.avatarUrl || post.authorAvatar,
      category_data: {
        name: post.category,
        slug: post.category?.toLowerCase().replace(/\s+/g, '-'),
        color: '#10b981',
        icon: 'BookOpen'
      }
    }))

    const response: BlogPostResponse = {
>>>>>>> origin/master
      success: true,
      data: transformedPosts,
      pagination: {
        page,
        limit,
<<<<<<< HEAD
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Blog API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
=======
        total,
        totalPages: Math.ceil(total / limit)
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Blog API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error.message
>>>>>>> origin/master
    }, { status: 500 })
  }
}

<<<<<<< HEAD
// POST - Create new blog post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.content || !body.excerpt) {
      return NextResponse.json({ 
        success: false,
        error: 'Title, content, and excerpt are required' 
      }, { status: 400 })
    }

    // Generate slug from title
    const slug = body.slug || body.title
      .toLowerCase()
      .replace(/[^a-z0-9ğüşıöç]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    // Create blog post
    const blogPost = {
      id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: body.title.trim(),
      slug: slug,
      excerpt: body.excerpt.trim(),
      content: body.content.trim(),
      authorid: `author_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      authorname: body.author?.name || 'ButcApp Team',
      category: body.category,
      status: body.status || 'draft'
    }

    const { data: newPost, error } = await supabase
      .from('blog_posts')
      .insert([blogPost])
      .select()
      .single()

    if (error) {
      console.error('Blog post creation error:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      console.error('Blog post data attempted:', blogPost)
      return NextResponse.json({ 
        success: false,
        error: 'Failed to create blog post',
        details: error.message 
      }, { status: 500 })
    }

    // Transform response
    const transformedPost = {
      id: newPost.id,
      title: newPost.title,
      slug: newPost.slug,
      excerpt: newPost.excerpt,
      content: newPost.content,
      status: newPost.status
    }

    return NextResponse.json({ 
      success: true,
      message: 'Blog post created successfully',
      data: transformedPost 
    }, { status: 201 })

  } catch (error) {
    console.error('Blog API error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
=======
// POST /api/blog - Create new blog post
export async function POST(request: NextRequest) {
  try {
    const body: CreateBlogPostRequest = await request.json()

    // Validate required fields
    if (!body.title || !body.content || !body.author_name || !body.category) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: title, content, author_name, category'
      }, { status: 400 })
    }

    // Generate slug if not provided
    let slug = body.slug
    if (!slug) {
      slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim()
    }

    // Check if slug is unique
    const existingPost = await db.blogPost.findUnique({
      where: { slug }
    })

    if (existingPost) {
      // Add random suffix to make it unique
      slug = `${slug}-${Date.now()}`
    }

    // Calculate reading time (rough estimate: 200 words per minute)
    const wordCount = body.content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

    // Create post
    const postData = {
      title: body.title,
      slug,
      excerpt: body.excerpt || '',
      content: body.content,
      featuredImage: body.featured_image || '',
      authorName: body.author_name,
      authorAvatar: body.author_avatar || '',
      category: body.category,
      tags: JSON.stringify(body.tags || []),
      metaTitle: body.meta_title || '',
      metaDescription: body.meta_description || '',
      metaKeywords: JSON.stringify(body.meta_keywords || []),
      status: body.status || 'draft',
      featured: body.featured || false,
      viewCount: 0,
      readingTime: body.reading_time || readingTime,
      publishedAt: body.status === 'published' ? new Date() : null,
      authorId: body.author_id || null
    }

    const newPost = await db.blogPost.create({
      data: postData
    })

    return NextResponse.json({
      success: true,
      post: {
        ...newPost,
        tags: JSON.parse(newPost.tags || '[]'),
        meta_keywords: JSON.parse(newPost.metaKeywords || '[]')
      }
    })

  } catch (error) {
    console.error('Blog POST error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error.message
>>>>>>> origin/master
    }, { status: 500 })
  }
}