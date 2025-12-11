import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ennek Lab | 最新AI技術の実用的な解説ブログ',
  description: '最新のAI技術、機械学習、深層学習、自然言語処理などの実用的な情報を毎日更新。ChatGPT、Claude、画像生成AI、自動化ツールなど幅広くカバー。',
  keywords: 'AI, 人工知能, 機械学習, ChatGPT, Claude, 画像生成AI, 深層学習, 自然言語処理',
  openGraph: {
    title: 'Ennek Lab | 最新AI技術の実用的な解説ブログ',
    description: '最新のAI技術、機械学習、深層学習、自然言語処理などの実用的な情報を毎日更新。',
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
        <header className="header">
          <div className="header-inner">
            <Link href="/" className="logo">
              Ennek Lab
              <span className="logo-sub">毎日更新</span>
            </Link>
            <nav className="nav">
              <Link href="/" className="nav-link">ホーム</Link>
              <Link href="/about" className="nav-link">サイトについて</Link>
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
      </body>
    </html>
  )
}

