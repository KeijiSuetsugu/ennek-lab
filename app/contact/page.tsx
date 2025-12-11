import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'お問い合わせ | Ennek Lab',
  description: 'Ennek Labへのお問い合わせはこちらから。',
}

export default function ContactPage() {
  return (
    <div className="contact-page">
      <section className="hero" style={{ textAlign: 'left', padding: '2rem 0' }}>
        <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>
          お問い合わせ
        </h1>
      </section>
      
      <div className="contact-content">
        <div className="contact-intro">
          <p>
            Ennek Labに関するご質問、ご意見、お仕事のご依頼などは、
            以下の方法でお気軽にお問い合わせください。
          </p>
        </div>

        <div className="contact-methods">
          <div className="contact-card">
            <div className="contact-icon">📧</div>
            <h3>メール</h3>
            <p>お問い合わせはメールで受け付けています</p>
            <a href="mailto:contact@ennekai-lab.com" className="contact-link">
              contact@ennekai-lab.com
            </a>
          </div>

          <div className="contact-card">
            <div className="contact-icon">𝕏</div>
            <h3>X (Twitter)</h3>
            <p>最新情報やお気軽なご質問はこちら</p>
            <a href="https://x.com/enneklab" target="_blank" rel="noopener noreferrer" className="contact-link">
              @enneklab
            </a>
          </div>

          <div className="contact-card">
            <div className="contact-icon">📸</div>
            <h3>Instagram</h3>
            <p>ビジュアルコンテンツはこちら</p>
            <a href="https://www.instagram.com/selfmind_ennek/" target="_blank" rel="noopener noreferrer" className="contact-link">
              @selfmind_ennek
            </a>
          </div>
        </div>

        <div className="contact-note">
          <h3>📝 お問い合わせの際のお願い</h3>
          <ul>
            <li>お返事には数日いただく場合がございます</li>
            <li>記事の内容に関するご質問も歓迎です</li>
            <li>AI技術に関するご相談もお気軽にどうぞ</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .contact-page {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }
        .contact-content {
          margin-top: 2rem;
        }
        .contact-intro {
          font-size: 1.1rem;
          color: var(--text-secondary);
          margin-bottom: 3rem;
          line-height: 1.8;
        }
        .contact-methods {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        .contact-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
        }
        .contact-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-hover);
          border-color: var(--accent-primary);
        }
        .contact-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        .contact-card h3 {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }
        .contact-card p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }
        .contact-link {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: var(--accent-gradient);
          color: #000;
          border-radius: 50px;
          font-weight: 600;
          font-size: 0.85rem;
          transition: transform 0.2s;
        }
        .contact-link:hover {
          transform: scale(1.05);
        }
        .contact-note {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 2rem;
        }
        .contact-note h3 {
          font-size: 1.1rem;
          margin-bottom: 1rem;
          color: var(--accent-primary);
        }
        .contact-note ul {
          list-style: none;
          padding: 0;
        }
        .contact-note li {
          padding: 0.5rem 0;
          color: var(--text-secondary);
          padding-left: 1.5rem;
          position: relative;
        }
        .contact-note li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: var(--accent-primary);
        }
      `}</style>
    </div>
  )
}

