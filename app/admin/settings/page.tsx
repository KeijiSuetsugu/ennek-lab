'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

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
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/admin" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
          ← ダッシュボードに戻る
        </Link>
        <h1 style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>
          ⚙️ 設定
        </h1>
      </div>

      {/* 設定カード */}
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {/* サイト情報 */}
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: '12px',
          padding: '1.5rem',
        }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>🌐 サイト情報</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-primary)', borderRadius: '8px' }}>
              <span>サイト名</span>
              <span style={{ color: 'var(--text-secondary)' }}>Ennek Lab</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-primary)', borderRadius: '8px' }}>
              <span>ドメイン</span>
              <span style={{ color: 'var(--text-secondary)' }}>ennekai-lab.com</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-primary)', borderRadius: '8px' }}>
              <span>フレームワーク</span>
              <span style={{ color: 'var(--text-secondary)' }}>Next.js 14</span>
            </div>
          </div>
        </div>

        {/* 自動記事生成 */}
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: '12px',
          padding: '1.5rem',
        }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>🤖 自動記事生成</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-primary)', borderRadius: '8px' }}>
              <span>生成スケジュール</span>
              <span style={{ color: 'var(--accent-primary)' }}>毎日 08:00 (JST)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-primary)', borderRadius: '8px' }}>
              <span>AI モデル</span>
              <span style={{ color: 'var(--text-secondary)' }}>GPT-4o</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-primary)', borderRadius: '8px' }}>
              <span>記事文字数</span>
              <span style={{ color: 'var(--text-secondary)' }}>5,000〜6,000文字</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-primary)', borderRadius: '8px' }}>
              <span>画像取得</span>
              <span style={{ color: 'var(--text-secondary)' }}>Unsplash / Pexels</span>
            </div>
          </div>
        </div>

        {/* ファイル編集ガイド */}
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: '12px',
          padding: '1.5rem',
        }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>📁 ファイル編集ガイド</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            詳細な設定変更はコードエディタ（Cursor）で行います
          </p>
          <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.9rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--bg-primary)', borderRadius: '8px' }}>
              <strong>デザイン・スタイル:</strong>
              <code style={{ marginLeft: '0.5rem', color: 'var(--accent-primary)' }}>app/globals.css</code>
            </div>
            <div style={{ padding: '0.75rem', background: 'var(--bg-primary)', borderRadius: '8px' }}>
              <strong>ヘッダー・フッター:</strong>
              <code style={{ marginLeft: '0.5rem', color: 'var(--accent-primary)' }}>app/layout.tsx</code>
            </div>
            <div style={{ padding: '0.75rem', background: 'var(--bg-primary)', borderRadius: '8px' }}>
              <strong>トップページ:</strong>
              <code style={{ marginLeft: '0.5rem', color: 'var(--accent-primary)' }}>app/page.tsx</code>
            </div>
            <div style={{ padding: '0.75rem', background: 'var(--bg-primary)', borderRadius: '8px' }}>
              <strong>記事生成ロジック:</strong>
              <code style={{ marginLeft: '0.5rem', color: 'var(--accent-primary)' }}>scripts/generate-article.ts</code>
            </div>
            <div style={{ padding: '0.75rem', background: 'var(--bg-primary)', borderRadius: '8px' }}>
              <strong>自動投稿設定:</strong>
              <code style={{ marginLeft: '0.5rem', color: 'var(--accent-primary)' }}>.github/workflows/daily-article.yml</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


