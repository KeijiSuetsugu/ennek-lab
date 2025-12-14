import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'お問い合わせ | Ennek Lab',
  description: 'Ennek Labへのお問い合わせはこちらから。',
}

export default function ContactPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <section style={{ textAlign: 'left', padding: '2rem 0' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          お問い合わせ
        </h1>
      </section>
      
      <div className="article-body">
        <p style={{ marginBottom: '2rem', fontSize: '1.1rem', lineHeight: '1.8' }}>
          Ennek Labに関するご質問、ご意見、お仕事のご依頼などは、
          以下の方法でお気軽にお問い合わせください。
        </p>

        <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📧</div>
            <h3 style={{ marginBottom: '0.5rem' }}>メール</h3>
            <p style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>お問い合わせはメールで受け付けています</p>
            <a href="mailto:contact@ennekai-lab.com" style={{ color: 'var(--accent-primary)' }}>
              contact@ennekai-lab.com
            </a>
          </div>

          <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>𝕏</div>
            <h3 style={{ marginBottom: '0.5rem' }}>X (Twitter)</h3>
            <p style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>最新情報やお気軽なご質問はこちら</p>
            <a href="https://x.com/enneklab" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)' }}>
              @enneklab
            </a>
          </div>

          <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📸</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Instagram</h3>
            <p style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>ビジュアルコンテンツはこちら</p>
            <a href="https://www.instagram.com/selfmind_ennek/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)' }}>
              @selfmind_ennek
            </a>
          </div>
        </div>

        <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '1rem' }}>📝 お問い合わせの際のお願い</h3>
          <ul style={{ paddingLeft: '1.5rem', lineHeight: '2' }}>
            <li>お返事には数日いただく場合がございます</li>
            <li>記事の内容に関するご質問も歓迎です</li>
            <li>AI技術に関するご相談もお気軽にどうぞ</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
