import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const articlesDirectory = path.join(process.cwd(), 'content')

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { slug } = await params
    const fullPath = path.join(articlesDirectory, `${slug}.md`)

    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return NextResponse.json({
      title: data.title || '',
      date: data.date || '',
      category: data.category || '',
      tags: data.tags || [],
      excerpt: data.excerpt || '',
      image: data.image || '',
      content: content,
    })
  } catch (error) {
    console.error('Error fetching article:', error)
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { slug } = await params
    const fullPath = path.join(articlesDirectory, `${slug}.md`)
    const body = await request.json()

    // 既存ファイルを読み込んで画像URLを保持
    let existingImage = ''
    if (fs.existsSync(fullPath)) {
      const existingContents = fs.readFileSync(fullPath, 'utf8')
      const { data: existingData } = matter(existingContents)
      existingImage = existingData.image || ''
    }

    // Markdown形式で保存
    const frontmatter = {
      title: body.title,
      date: body.date,
      category: body.category,
      tags: body.tags,
      excerpt: body.excerpt,
      image: body.image || existingImage,
    }

    const fileContent = matter.stringify(body.content, frontmatter)
    fs.writeFileSync(fullPath, fileContent, 'utf8')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving article:', error)
    return NextResponse.json({ error: 'Failed to save article' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { slug } = await params
    const fullPath = path.join(articlesDirectory, `${slug}.md`)

    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    fs.unlinkSync(fullPath)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 })
  }
}

