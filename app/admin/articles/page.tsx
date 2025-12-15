'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Article {
  slug: string
  title: string
  date: string
  category: string
  tags: string[]
}

export default function ArticlesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchArticles()
    }
  }, [status])

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/admin/articles')
      if (res.ok) {
        const data = await res.json()
        setArticles(data)
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (status === 'loading') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>読み込み中...</p>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      {/* ヘッダー */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
      }}>
        <div>
          <Link href="/admin" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
            ← ダッシュボードに戻る
          </Link>
          <h1 style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>
            📄 記事管理
          </h1>
        </div>
      </div>

      {/* 検索バー */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="記事を検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
          }}
        />
      </div>

      {/* 記事一覧 */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)' }}>読み込み中...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)' }}>
              {searchTerm ? '検索結果がありません' : 'まだ記事がありません'}
            </p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-primary)' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>タイトル</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold', width: '120px' }}>カテゴリ</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold', width: '120px' }}>日付</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold', width: '150px' }}>アクション</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map((article, index) => (
                <tr
                  key={article.slug}
                  style={{
                    borderTop: '1px solid var(--border-color)',
                    background: index % 2 === 0 ? 'transparent' : 'var(--bg-primary)',
                  }}
                >
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                      {article.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {article.tags.slice(0, 3).join(', ')}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      background: 'var(--accent-primary)',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      color: 'white',
                    }}>
                      {article.category}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {article.date}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <Link
                        href={`/articles/${article.slug}`}
                        target="_blank"
                        style={{
                          padding: '0.4rem 0.6rem',
                          background: 'var(--bg-primary)',
                          borderRadius: '4px',
                          color: 'var(--text-secondary)',
                          textDecoration: 'none',
                          fontSize: '0.8rem',
                        }}
                      >
                        👁️
                      </Link>
                      <Link
                        href={`/admin/articles/${article.slug}`}
                        style={{
                          padding: '0.4rem 0.6rem',
                          background: 'var(--accent-primary)',
                          borderRadius: '4px',
                          color: 'white',
                          textDecoration: 'none',
                          fontSize: '0.8rem',
                        }}
                      >
                        ✏️
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p style={{
        marginTop: '1rem',
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
      }}>
        全 {filteredArticles.length} 件の記事
      </p>
    </div>
  )
}

