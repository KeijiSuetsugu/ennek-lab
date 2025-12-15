'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Article {
  slug: string
  title: string
  date: string
  category: string
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

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
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--border-color)',
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
            📊 管理ダッシュボード
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            ようこそ、{session.user?.name} さん
          </p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          style={{
            padding: '0.5rem 1rem',
            background: 'transparent',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >
          ログアウト
        </button>
      </div>

      {/* 統計カード */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <div style={{
          padding: '1.5rem',
          background: 'var(--bg-secondary)',
          borderRadius: '12px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📝</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{articles.length}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>公開記事数</div>
        </div>

        <div style={{
          padding: '1.5rem',
          background: 'var(--bg-secondary)',
          borderRadius: '12px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🤖</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>毎日</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>自動投稿</div>
        </div>

        <div style={{
          padding: '1.5rem',
          background: 'var(--bg-secondary)',
          borderRadius: '12px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚡</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>24h</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>次回生成まで</div>
        </div>
      </div>

      {/* クイックリンク */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <Link href="/admin/articles" style={{
          padding: '1.5rem',
          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          borderRadius: '12px',
          color: 'white',
          textDecoration: 'none',
          display: 'block',
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📄 記事管理</div>
          <p style={{ opacity: 0.9, fontSize: '0.9rem' }}>記事の一覧・編集・削除</p>
        </Link>

        <Link href="/admin/settings" style={{
          padding: '1.5rem',
          background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
          borderRadius: '12px',
          color: 'white',
          textDecoration: 'none',
          display: 'block',
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚙️ 設定</div>
          <p style={{ opacity: 0.9, fontSize: '0.9rem' }}>サイト設定・自動生成設定</p>
        </Link>
      </div>

      {/* 最近の記事 */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: '12px',
        padding: '1.5rem',
      }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>📰 最近の記事</h2>
        
        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>読み込み中...</p>
        ) : articles.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>まだ記事がありません</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {articles.slice(0, 5).map((article) => (
              <div
                key={article.slug}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  background: 'var(--bg-primary)',
                  borderRadius: '8px',
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                    {article.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {article.date} • {article.category}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link
                    href={`/articles/${article.slug}`}
                    target="_blank"
                    style={{
                      padding: '0.5rem 0.75rem',
                      background: 'var(--bg-secondary)',
                      borderRadius: '6px',
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                      fontSize: '0.8rem',
                    }}
                  >
                    👁️ 表示
                  </Link>
                  <Link
                    href={`/admin/articles/${article.slug}`}
                    style={{
                      padding: '0.5rem 0.75rem',
                      background: 'var(--accent-primary)',
                      borderRadius: '6px',
                      color: 'white',
                      textDecoration: 'none',
                      fontSize: '0.8rem',
                    }}
                  >
                    ✏️ 編集
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {articles.length > 5 && (
          <Link
            href="/admin/articles"
            style={{
              display: 'block',
              textAlign: 'center',
              marginTop: '1rem',
              color: 'var(--accent-primary)',
              textDecoration: 'none',
            }}
          >
            すべての記事を見る →
          </Link>
        )}
      </div>
    </div>
  )
}

