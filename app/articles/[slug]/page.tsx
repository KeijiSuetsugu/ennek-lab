import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getArticleBySlug, getAllArticleSlugs } from '@/lib/articles'
import { parseMarkdown } from '@/lib/markdown'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  
  if (!article) {
    return {
      title: '記事が見つかりません | Ennek Lab',
    }
  }
  
  return {
    title: `${article.title} | Ennek Lab`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      images: article.image ? [article.image] : [],
    },
  }
}

export async function generateStaticParams() {
  const slugs = getAllArticleSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  
  if (!article) {
    notFound()
  }
  
  const htmlContent = parseMarkdown(article.content)
  
  return (
    <article className="article-page">
      <div className="article-header">
        <span className="article-category">{article.category}</span>
        <h1 className="article-title">{article.title}</h1>
        <div className="article-meta">
          <span>📅 {article.date}</span>
          <span>·</span>
          <span>⏱️ {article.readingTime}分で読めます</span>
        </div>
        
        {article.tags && article.tags.length > 0 && (
          <div className="article-tags">
            {article.tags.map((tag) => (
              <span key={tag} className="article-tag">#{tag}</span>
            ))}
          </div>
        )}
      </div>
      
      {article.image && (
        <div className="article-featured-image">
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="800px"
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      )}
      {article.imageCredit && (
        <p style={{ 
          fontSize: '0.75rem', 
          color: 'var(--text-muted)', 
          textAlign: 'center',
          marginTop: '-1.5rem',
          marginBottom: '2rem'
        }}>
          Photo: {article.imageCredit}
        </p>
      )}
      
      <div 
        className="article-body"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
      
      <div style={{ 
        marginTop: '4rem', 
        paddingTop: '2rem', 
        borderTop: '1px solid var(--border-color)',
        textAlign: 'center'
      }}>
        <Link 
          href="/"
          style={{
            display: 'inline-block',
            padding: '0.75rem 2rem',
            background: 'var(--accent-gradient)',
            color: '#000',
            borderRadius: '50px',
            fontWeight: '600',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
        >
          ← 記事一覧に戻る
        </Link>
      </div>
    </article>
  )
}

