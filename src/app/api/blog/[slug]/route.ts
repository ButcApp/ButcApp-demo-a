import { NextRequest, NextResponse } from 'next/server'
<<<<<<< HEAD
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://dfiwgngtifuqrrxkvknn.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmaXdnbmd0aWZ1cXJyeGt2a25uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI3NzMyMSwiZXhwIjoyMDgwODUzMzIxfQ.uCfJ5DzQ2QCiyXycTrHEaKh1EvAFbuP8HBORmBSPbX8";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET - Fetch single blog post by slug
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params

    // Fetch blog post
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error || !post) {
      console.error('Blog post fetch error:', error)
      return NextResponse.json({ 
        success: false, 
        error: 'Blog post not found' 
=======
import { db } from '@/lib/db'
import { BlogPostResponse } from '@/types/blog'

// GET /api/blog/[slug] - Fetch single blog post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    const post = await db.blogPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            fullName: true,
            avatarUrl: true
          }
        }
      }
    })

    if (!post || post.status !== 'published') {
      return NextResponse.json({
        success: false,
        error: 'Blog post not found'
>>>>>>> origin/master
      }, { status: 404 })
    }

    // Increment view count
<<<<<<< HEAD
    await supabase
      .from('blog_posts')
      .update({ viewCount: (post.viewCount || 0) + 1 })
      .eq('id', post.id)

    // Transform post to match frontend interface
    const transformedPost = {
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
      views: (post.viewCount || 0) + 1,
      status: post.status
    }

    // Get related posts
    const { data: relatedPosts } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('category', post.category)
      .eq('status', 'published')
      .neq('id', post.id)
      .order('createdat', { ascending: false })
      .limit(3)

    const transformedRelatedPosts = (relatedPosts || []).map(relatedPost => ({
      id: relatedPost.id,
      title: relatedPost.title,
      slug: relatedPost.slug,
      excerpt: relatedPost.excerpt,
      coverImage: relatedPost.cover_image,
      category: relatedPost.category,
      publishedAt: relatedPost.createdat,
      readingTime: relatedPost.reading_time || Math.ceil(relatedPost.content?.length / 1000) || 5,
      featured: relatedPost.featured || false
    }))

    return NextResponse.json({
      success: true,
      post: transformedPost,
      relatedPosts: transformedRelatedPosts
    })

  } catch (error) {
    console.error('Blog post API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
=======
    await db.blogPost.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } }
    })

    // Track analytics
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referrer = request.headers.get('referer') || null

    await db.blogAnalytics.create({
      data: {
        postId: post.id,
        ipAddress: clientIP,
        userAgent,
        referrer
      }
    })

    const response: BlogPostResponse = {
      success: true,
      post: {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        featuredImage: post.featuredImage,
        authorId: post.authorId,
        authorName: post.authorName,
        authorAvatar: post.authorAvatar,
        category: post.category,
        tags: post.tags ? JSON.parse(post.tags) : [],
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        metaKeywords: post.metaKeywords ? JSON.parse(post.metaKeywords) : [],
        status: post.status,
        featured: post.featured,
        viewCount: post.viewCount + 1,
        readingTime: post.readingTime,
        publishedAt: post.publishedAt,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        category_data: {
          name: post.category,
          slug: post.category?.toLowerCase().replace(/\s+/g, '-'),
          color: '#10b981',
          icon: 'BookOpen'
        },
        author: post.author
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Blog post API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: (error as Error).message
>>>>>>> origin/master
    }, { status: 500 })
  }
}