import cron from 'node-cron'
import { generateArticle } from './generate-article'

const GENERATION_TIME = process.env.GENERATION_TIME || '0 8 * * *' // デフォルト: 毎日朝8時

console.log('🤖 AI記事自動生成スケジューラーを起動します')
console.log(`⏰ 生成スケジュール: ${GENERATION_TIME}`)
console.log('📝 Ctrl+C で終了\n')

// スケジュール実行
cron.schedule(GENERATION_TIME, async () => {
  console.log(`\n[${new Date().toISOString()}] 定期記事生成を開始...`)
  
  try {
    const slug = await generateArticle()
    console.log(`✅ 記事が正常に生成されました: ${slug}`)
  } catch (error) {
    console.error('❌ 記事生成中にエラーが発生しました:', error)
  }
}, {
  timezone: 'Asia/Tokyo'
})

// 起動時のテスト実行（オプション）
if (process.argv.includes('--run-now')) {
  console.log('🚀 即時実行モードで記事を生成します...\n')
  generateArticle()
    .then(slug => console.log(`\n✅ テスト生成完了: ${slug}`))
    .catch(error => console.error('❌ エラー:', error))
}

// プロセス終了時のクリーンアップ
process.on('SIGINT', () => {
  console.log('\n👋 スケジューラーを終了します')
  process.exit(0)
})

