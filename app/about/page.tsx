import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'サイトについて | Ennek Lab',
  description: 'Ennek Labは最新のAI技術に関する実用的な情報を毎日自動配信するブログです。',
}

export default function AboutPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <section className="hero" style={{ textAlign: 'left', padding: '2rem 0' }}>
        <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>
          Ennek Labについて
        </h1>
      </section>
      
      <div className="article-body">
        <h2>このサイトについて</h2>
        <p>
          Ennek Labは、最新のAI技術に関する実用的で分かりやすい情報を毎日お届けするブログです。
          ChatGPT、Claude、画像生成AI、機械学習など、幅広いAI技術トピックをカバーしています。
        </p>
        
        <h2>特徴</h2>
        <ul>
          <li><strong>毎日更新</strong>: 最新のAI技術トレンドを追跡し、毎日新しい記事を公開</li>
          <li><strong>実用的な内容</strong>: 初心者から中級者まで、すぐに活用できる情報</li>
          <li><strong>4000〜5000文字の詳細解説</strong>: 各トピックを深く掘り下げて解説</li>
          <li><strong>無料の美しい画像</strong>: Unsplash/Pexelsの高品質な画像を使用</li>
        </ul>
        
        <h2>カバーするトピック</h2>
        <ul>
          <li>大規模言語モデル（LLM）- GPT-4、Claude、Geminiなど</li>
          <li>画像生成AI - DALL-E、Midjourney、Stable Diffusionなど</li>
          <li>AIツール・サービスの活用方法</li>
          <li>機械学習の実践的なテクニック</li>
          <li>AIエージェントと自動化</li>
          <li>プロンプトエンジニアリング</li>
          <li>AI倫理と規制の最新動向</li>
        </ul>
        
        <h2>技術スタック</h2>
        <p>このサイトは以下の技術で構築されています：</p>
        <ul>
          <li><strong>フロントエンド</strong>: Next.js 14 (React)</li>
          <li><strong>記事生成</strong>: OpenAI GPT-4o API</li>
          <li><strong>画像</strong>: Unsplash / Pexels API（無料）</li>
          <li><strong>自動化</strong>: GitHub Actions</li>
          <li><strong>ホスティング</strong>: Vercel</li>
        </ul>
        
        <h2>お問い合わせ</h2>
        <p>
          ご質問やフィードバックがありましたら、お気軽にお問い合わせください。
        </p>
      </div>
    </div>
  )
}

