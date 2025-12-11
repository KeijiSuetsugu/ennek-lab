import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const articlesDirectory = path.join(process.cwd(), 'content/articles')

export interface Article {
  slug: string
  title: string
  date: string
  excerpt: string
  category: string
  tags: string[]
  image: string
  imageCredit: string
  content: string
  readingTime: number
}

export interface ArticleMeta {
  slug: string
  title: string
  date: string
  excerpt: string
  category: string
  tags: string[]
  image: string
  imageCredit: string
  readingTime: number
}

// 記事ディレクトリが存在することを確認
function ensureArticlesDirectory() {
  if (!fs.existsSync(articlesDirectory)) {
    fs.mkdirSync(articlesDirectory, { recursive: true })
  }
}

// 読了時間を計算（日本語は400文字/分として計算）
function calculateReadingTime(content: string): number {
  const charCount = content.length
  const minutes = Math.ceil(charCount / 400)
  return minutes
}

// すべての記事のメタデータを取得
export function getAllArticles(): ArticleMeta[] {
  ensureArticlesDirectory()
  
  const fileNames = fs.readdirSync(articlesDirectory)
  const articles = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(articlesDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      
      return {
        slug,
        title: data.title || '',
        date: data.date || '',
        excerpt: data.excerpt || '',
        category: data.category || 'AI',
        tags: data.tags || [],
        image: data.image || '',
        imageCredit: data.imageCredit || '',
        readingTime: calculateReadingTime(content),
      }
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
  
  return articles
}

// 特定の記事を取得
export function getArticleBySlug(slug: string): Article | null {
  ensureArticlesDirectory()
  
  const fullPath = path.join(articlesDirectory, `${slug}.md`)
  
  if (!fs.existsSync(fullPath)) {
    return null
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  
  return {
    slug,
    title: data.title || '',
    date: data.date || '',
    excerpt: data.excerpt || '',
    category: data.category || 'AI',
    tags: data.tags || [],
    image: data.image || '',
    imageCredit: data.imageCredit || '',
    content,
    readingTime: calculateReadingTime(content),
  }
}

// すべての記事のスラッグを取得
export function getAllArticleSlugs(): string[] {
  ensureArticlesDirectory()
  
  const fileNames = fs.readdirSync(articlesDirectory)
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => fileName.replace(/\.md$/, ''))
}

// 既存の記事タイトルを取得（重複チェック用）
export function getAllArticleTitles(): string[] {
  const articles = getAllArticles()
  return articles.map(article => article.title)
}

// キーワードでの重複チェック
export function checkDuplicateKeywords(keywords: string[]): boolean {
  const existingTitles = getAllArticleTitles()
  const normalizedKeywords = keywords.map(k => k.toLowerCase())
  
  return existingTitles.some(title => {
    const normalizedTitle = title.toLowerCase()
    // タイトルに含まれるキーワードが3つ以上一致したら重複とみなす
    const matchCount = normalizedKeywords.filter(k => normalizedTitle.includes(k)).length
    return matchCount >= 3
  })
}

