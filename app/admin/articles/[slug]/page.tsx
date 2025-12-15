'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface ArticleData {
  title: string
  date: string
  category: string
  tags: string[]
  excerpt: string
  content: string
}

export default function EditArticlePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  const [article, setArticle] = useState<ArticleData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated' && slug) {
      fetchArticle()
    }
  }, [status, slug])

  const fetchArticle = async () => {
    try {
      const res = await fetch(`/api/admin/articles/${slug}`)
      if (res.ok) {
        const data = await res.json()
        setArticle(data)
      } else {
        setMessage('記事が見つかりません')
      }
    } catch (error) {
      console.error('Failed to fetch article:', error)
      setMessage('記事の読み込みに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!article) return

    setSaving(true)
    setMessage('')

    try {
      const res = await fetch(`/api/admin/articles/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
      })

      if (res.ok) {
        setMessage('✅ 保存しました！')
      } else {
        setMessage('❌ 保存に失敗しました')
      }
    } catch (error) {
      console.error('Failed to save article:', error)
      setMessage('❌ 保存に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>読み込み中...</p>
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (!article) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <Link href="/admin/articles" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
          ← 記事一覧に戻る
        </Link>
        <p style={{ marginTop: '2rem', color: 'var(--text-secondary)' }}>{message || '記事が見つかりません'}</p>
      </div>
    )
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
          <Link href="/admin/articles" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
            ← 記事一覧に戻る
          </Link>
          <h1 style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>
            ✏️ 記事を編集
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {message && (
            <span style={{ fontSize: '0.9rem' }}>{message}</span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '0.75rem 1.5rem',
              background: saving ? 'var(--text-secondary)' : 'var(--accent-primary)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontWeight: 'bold',
              cursor: saving ? 'not-allowed' : 'pointer',
            }}
          >
            {saving ? '保存中...' : '💾 保存'}
          </button>
        </div>
      </div>

      {/* 編集フォーム */}
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {/* タイトル */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            タイトル
          </label>
          <input
            type="text"
            value={article.title}
            onChange={(e) => setArticle({ ...article, title: e.target.value })}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              fontSize: '1rem',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        {/* メタ情報 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              日付
            </label>
            <input
              type="text"
              value={article.date}
              onChange={(e) => setArticle({ ...article, date: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '1rem',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              カテゴリ
            </label>
            <select
              value={article.category}
              onChange={(e) => setArticle({ ...article, category: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '1rem',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
              }}
            >
              <option value="AI技術">AI技術</option>
              <option value="機械学習">機械学習</option>
              <option value="LLM">LLM</option>
              <option value="画像生成AI">画像生成AI</option>
              <option value="AIツール">AIツール</option>
            </select>
          </div>
        </div>

        {/* タグ */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            タグ（カンマ区切り）
          </label>
          <input
            type="text"
            value={article.tags.join(', ')}
            onChange={(e) => setArticle({ ...article, tags: e.target.value.split(',').map(t => t.trim()) })}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              fontSize: '1rem',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        {/* 抜粋 */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            抜粋
          </label>
          <textarea
            value={article.excerpt}
            onChange={(e) => setArticle({ ...article, excerpt: e.target.value })}
            rows={3}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              fontSize: '1rem',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              resize: 'vertical',
            }}
          />
        </div>

        {/* 本文 */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            本文（Markdown形式）
          </label>
          <textarea
            value={article.content}
            onChange={(e) => setArticle({ ...article, content: e.target.value })}
            rows={20}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              fontSize: '0.95rem',
              fontFamily: 'monospace',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              resize: 'vertical',
            }}
          />
        </div>
      </div>
    </div>
  )
}

