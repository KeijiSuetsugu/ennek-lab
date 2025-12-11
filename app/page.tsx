import Link from 'next/link'
import Image from 'next/image'
import { getAllArticles } from '@/lib/articles'

export default function Home() {
  const articles = getAllArticles()
  
  return (
    <>
      {/* ヒーローセクション */}
      <section className="hero">
        <div className="hero-badge">🤖 毎日自動更新中</div>
        <h1 className="hero-title">
          最新AI技術を<br />
          わかりやすく解説
        </h1>
        <p className="hero-description">
          ChatGPT、Gemini、画像生成AIなど最新のAI技術に関する仕事でも活躍できる実用的な情報を毎日お届けします。
        </p>
      </section>

      {/* 記事一覧 */}
      <section className="articles-section">
        <div className="section-header">
          <h2 className="section-title">最新の記事</h2>
        </div>
        
        {articles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <h3 className="empty-state-title">記事がまだありません</h3>
            <p>最初の記事を生成するには、npm run generate を実行してください。</p>
          </div>
        ) : (
          <div className="articles-grid">
            {articles.map((article) => (
              <Link href={`/articles/${article.slug}`} key={article.slug}>
                <article className="article-card">
                  <div className="article-image">
                    {article.image ? (
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 350px"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #1a1a25 0%, #252535 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3rem'
                      }}>
                        🤖
                      </div>
                    )}
                    <span className="article-category">{article.category}</span>
                  </div>
                  <div className="article-content">
                    <div className="article-meta">
                      <span>{article.date}</span>
                      <span>·</span>
                      <span>{article.readingTime}分で読めます</span>
                    </div>
                    <h3 className="article-title">{article.title}</h3>
                    <p className="article-excerpt">{article.excerpt}</p>
                    {article.tags && article.tags.length > 0 && (
                      <div className="article-tags">
                        {article.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="article-tag">#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  )
}

