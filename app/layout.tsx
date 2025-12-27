import type { Metadata } from 'next'
import Link from 'next/link'
import SessionProvider from '@/components/SessionProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ennek Lab | 最新AI技術の実用的な解説ブログ',
  description: '最新のAI技術などの実用的な情報を毎日更新。ChatGPT、Claude、画像生成AI、自動化ツール、Gemini、NotebookLM,Manus、Deepseekなど幅広くカバー。',
  keywords: 'AI, 人工知能, ChatGPT, Claude, 画像生成AI, 自然言語処理',
  openGraph: {
    title: 'Ennek Lab | 最新AI技術の実用的な解説ブログ',
    description: '最新のAI技術、Gemini、画像生成AI、自動化ツール、AIエージェント、NotebookLM、Manus、Deepseekなどの実用的な情報を毎日更新。',
    type: 'website',
    url: 'https://ennekai-lab.com',
  },
  metadataBase: new URL('https://ennekai-lab.com'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <SessionProvider>
        <header className="header">
          <div className="header-inner">
            <Link href="/" className="logo">
              Ennek Lab
              <span className="logo-sub">毎日更新</span>
            </Link>
            <nav className="nav">
              <Link href="/" className="nav-link">ホーム</Link>
              <Link href="/about" className="nav-link">サイトについて</Link>
              <Link href="/contact" className="nav-link">お問い合わせ</Link>
              <div className="nav-social">
                <a href="https://x.com/enneklab" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="X (Twitter)">
                  𝕏
                </a>
                <a href="https://www.instagram.com/selfmind_ennek/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                  📸
                </a>
                <a href="https://www.youtube.com/channel/UC67sznX4BXhsI-mmaYKCS8A" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="YouTube">
                  ▶️
                </a>
              </div>
            </nav>
          </div>
        </header>

        <main className="main">
          {children}
        </main>

        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-logo">Ennek Lab</div>
            <p className="footer-text">
              © {new Date().getFullYear()} Ennek Lab. 最新AI技術の情報を毎日お届けします。
            </p>
          </div>
        </footer>
        </SessionProvider>
      </body>
    </html>
  )
}

