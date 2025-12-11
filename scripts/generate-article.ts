import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'
import { format } from 'date-fns'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const articlesDir = path.join(process.cwd(), 'content/articles')
const topicsLogPath = path.join(process.cwd(), 'content/topics-log.json')

// 情報収集元となるAI関連メディア・ソース
const AI_INFORMATION_SOURCES = [
  // 国内AIメディア
  'Ledge.ai - 日本最大級のAIメディア',
  'SHIFT AI - AI活用情報メディア',
  'AI NOW - AI専門ニュースメディア',
  'AI MEDIA BSG - ビジネス向けAI情報',
  'DLab AI Channel - AI技術解説',
  
  // 公式ブログ・リサーチ
  'OpenAI公式ニュース - ChatGPT、GPT-4o、DALL-E、Soraの最新情報',
  'Google AI Research Blog - Gemini、Bard、DeepMindの研究',
  'Meta AI Blog - Llama、Segment Anything、オープンソースAI',
  
  // SNS・個人発信
  'イーロン・マスク (X/Twitter) - xAI、Grok、テスラFSDの情報',
  'Genspark Japan - AI検索エンジンの最新動向',
  'ka2aki86 - AI活用の実践情報',
  'NanoBanana Labs - AI開発・技術情報',
  'antigravity - AI技術トレンド',
  'Sora公式 - OpenAI動画生成AIの情報',
  'イケハヤ (note) - AI活用の実践ノウハウ',
]

// AI技術に関するトピックカテゴリ
const TOPIC_CATEGORIES = [
  '大規模言語モデル（LLM）の最新動向',
  '画像生成AI・動画生成AI',
  'AIチャットボット・アシスタント',
  '機械学習の実践活用',
  'AIツール・サービス比較',
  'AIエージェント・自動化',
  'AI開発フレームワーク',
  'AIと倫理・規制・安全性',
  'AI活用ビジネス事例',
  '音声認識・合成AI',
  'コンピュータビジョン',
  'AIの最新研究・論文',
  'ローカルLLM・オンデバイスAI',
  'RAG・検索拡張生成',
  'AIプロンプトエンジニアリング',
  'マルチモーダルAI',
  'AIセキュリティ・プライバシー',
  '自動運転・モビリティAI',
  'AIロボティクス',
  'AI半導体・ハードウェア',
]

// 最新のAI技術トレンドキーワード（2024-2025年）
const TREND_KEYWORDS = [
  // LLM関連
  'GPT-4o', 'GPT-4o mini', 'o1', 'o1-pro', 'ChatGPT',
  'Claude 3.5 Sonnet', 'Claude 3.5 Opus', 'Claude 4',
  'Gemini 2.0', 'Gemini Pro', 'Gemini Ultra',
  'Llama 3.2', 'Llama 4', 'Mistral Large',
  'Amazon Nova', 'Amazon Nova 2', 'Nova Pro', 'Nova Forge',
  'Grok', 'xAI',
  
  // 画像・動画生成
  'DALL-E 3', 'Midjourney V6', 'Stable Diffusion 3.5', 'Flux',
  'Sora', 'Runway Gen-3', 'Pika Labs', 'Kling',
  
  // AIエージェント・ツール
  'AIエージェント', 'AutoGPT', 'CrewAI', 'LangChain', 'LlamaIndex',
  'Cursor', 'GitHub Copilot', 'Devin', 'Claude Code',
  'Genspark', 'Perplexity', 'NotebookLM',
  
  // 技術トレンド
  'RAG', 'ファインチューニング', 'プロンプトエンジニアリング',
  'マルチモーダルAI', 'Vision-Language Model', 'リアルタイムAI',
  'オンデバイスAI', 'エッジAI', 'ローカルLLM',
  'Ollama', 'vLLM',
  
  // ハードウェア・インフラ
  'Trainium', 'Trainium3', 'NVIDIA H100', 'NVIDIA Blackwell',
  
  // 音声AI
  'ElevenLabs', 'Hume AI', 'OpenAI TTS',
  
  // 社会・ビジネス
  'AI規制', 'AI倫理', 'AI安全性', 'AGI', 'ASI',
  '自動運転', 'FSD', 'テスラ',
]

interface TopicsLog {
  generatedTopics: Array<{
    topic: string
    keywords: string[]
    date: string
    slug: string
  }>
}

// トピックログを読み込む
function loadTopicsLog(): TopicsLog {
  if (!fs.existsSync(topicsLogPath)) {
    return { generatedTopics: [] }
  }
  const data = fs.readFileSync(topicsLogPath, 'utf-8')
  return JSON.parse(data)
}

// トピックログを保存
function saveTopicsLog(log: TopicsLog): void {
  const dir = path.dirname(topicsLogPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(topicsLogPath, JSON.stringify(log, null, 2))
}

// 重複チェック
function isDuplicateTopic(newTopic: string, newKeywords: string[], log: TopicsLog): boolean {
  const normalizedNewTopic = newTopic.toLowerCase()
  const normalizedNewKeywords = newKeywords.map(k => k.toLowerCase())
  
  for (const existing of log.generatedTopics) {
    // トピックの類似度チェック
    const normalizedExisting = existing.topic.toLowerCase()
    if (normalizedNewTopic.includes(normalizedExisting) || normalizedExisting.includes(normalizedNewTopic)) {
      return true
    }
    
    // キーワードの重複チェック（3つ以上一致で重複とみなす）
    const existingKeywords = existing.keywords.map(k => k.toLowerCase())
    const matchCount = normalizedNewKeywords.filter(k => existingKeywords.includes(k)).length
    if (matchCount >= 3) {
      return true
    }
  }
  
  return false
}

// ユニークなトピックを生成
async function generateUniqueTopic(log: TopicsLog): Promise<{ topic: string; keywords: string[] }> {
  const randomCategory = TOPIC_CATEGORIES[Math.floor(Math.random() * TOPIC_CATEGORIES.length)]
  const randomTrends = TREND_KEYWORDS
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .join('、')
  
  // 既存トピックのリスト（最新20件）
  const existingTopics = log.generatedTopics
    .slice(-20)
    .map(t => `- ${t.topic}`)
    .join('\n')
  
  // 参照すべき情報源をランダムに選択
  const randomSources = AI_INFORMATION_SOURCES
    .sort(() => Math.random() - 0.5)
    .slice(0, 5)
    .map(s => `- ${s}`)
    .join('\n')

  const prompt = `あなたはAI技術ブログのトピック提案者です。日本の主要AIメディアや公式ブログ、SNSで話題のAIニュースに詳しいエキスパートです。

## タスク
「${randomCategory}」カテゴリで、最新のAI技術に関する実用的で興味深い記事トピックを1つ提案してください。

## 参考にすべき情報源（これらのメディアで話題になりそうなトピックを選ぶ）
${randomSources}

## 考慮すべきトレンドキーワード
${randomTrends}

## 避けるべき既存トピック（類似したものは避けてください）
${existingTopics || '（まだ記事がありません）'}

## 要件
1. 具体的で実用的なトピック（中学生〜社会人まで楽しめる）
2. 2024-2025年12月時点の最新トレンドを反映
3. 5000〜6000文字の記事が書ける深さのあるトピック
4. 他の記事と差別化できるユニークな切り口
5. 「へぇ〜！」「すごい！」と思わせる驚きのある内容

## トピック選定のヒント
- 最近発表された新しいAIモデル・サービスの紹介
- AIの意外な活用事例（仕事、趣味、日常生活）
- AIを使った具体的な問題解決方法
- AI業界の最新ニュース・トレンド解説
- AIツールの比較・使い方ガイド

## 出力形式（JSON）
{
  "topic": "記事のトピック（具体的なタイトルではなく、テーマ）",
  "suggestedTitle": "提案する記事タイトル",
  "keywords": ["キーワード1", "キーワード2", "キーワード3", "キーワード4", "キーワード5"],
  "newsAngle": "このトピックが今注目される理由（最新ニュースとの関連）"
}

JSONのみを出力してください。`

  let attempts = 0
  const maxAttempts = 5
  
  while (attempts < maxAttempts) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.9,
      response_format: { type: 'json_object' },
    })
    
    const content = response.choices[0]?.message?.content
    if (!content) throw new Error('トピック生成に失敗しました')
    
    const result = JSON.parse(content)
    
    if (!isDuplicateTopic(result.topic, result.keywords, log)) {
      return {
        topic: result.suggestedTitle || result.topic,
        keywords: result.keywords,
      }
    }
    
    attempts++
    console.log(`重複検出、再試行中... (${attempts}/${maxAttempts})`)
  }
  
  throw new Error('ユニークなトピックの生成に失敗しました')
}

// 記事本文を生成
async function generateArticleContent(topic: string, keywords: string[]): Promise<{
  title: string
  excerpt: string
  content: string
  tags: string[]
  category: string
}> {
  // 参照すべき情報源をすべて含める
  const allSources = AI_INFORMATION_SOURCES.map(s => `- ${s}`).join('\n')

  const prompt = `あなたは日本の主要AIメディア（Ledge.ai、SHIFT AI、AI NOWなど）や、OpenAI・Google・Metaの公式ブログ、SNSで話題のAI情報に精通した人気ライターです。

中学生〜社会人まで誰でも楽しめる、**5000〜6000文字**のAI技術解説記事を日本語で執筆してください。

## トピック
${topic}

## キーワード
${keywords.join('、')}

## 参考にすべき情報源（これらのメディアの記事スタイル・情報を参考に）
${allSources}

## 記事の要件

### 1. 文字数
**5000〜6000文字**（これは絶対に守ってください。短いと不合格です）

### 2. 対象読者
- 中学生でも理解できるやさしい言葉
- でも社会人が読んでも「役立つ！」と思える実践的な内容
- AIに興味はあるけど専門知識がない人

### 3. 文体
- フレンドリーで親しみやすい「です・ます」調
- 難しい専門用語は必ず「〜とは、○○のことです」と説明を入れる
- 「例えば」「イメージとしては」「分かりやすく言うと」など具体例を多用
- 絵文字を適度に使って親しみやすく（🤖💡🎯🚀✨など）
- 「すごいですよね！」「驚きですね！」など感情を込めた表現

### 4. 構成（この順番で書く）
1. 🎯 **つかみ**（400〜500文字）
   - 「こんな経験ありませんか？」「実は○○って...」など興味を引く導入
   - 読者が「自分にも関係ある！」と思える身近な例から始める

2. 📚 **そもそも○○とは？**（800〜1000文字）
   - 基礎知識を分かりやすく解説
   - 「料理で例えると」「学校の授業で例えると」など身近な例え
   - 図解の代わりに、ステップを箇条書きで分かりやすく

3. 🔥 **ここがスゴイ！3つのポイント**（1200〜1500文字）
   - 技術の魅力・メリットを3つに整理
   - 「従来は○○だったのが、△△になった！」というビフォー・アフター
   - 具体的な数字やデータを入れる

4. 💼 **仕事や生活でこう使える！活用シーン5選**（1200〜1500文字）
   - 具体的な活用シーンを5つ紹介
   - 「学生なら」「社会人なら」「趣味で使うなら」など読者別に
   - 実際の使用例や成功事例を含める

5. 🚀 **今すぐ試せる！始め方ガイド**（800〜1000文字）
   - 読者がすぐに実践できる具体的なステップ
   - 無料で試せる方法を優先
   - 初心者向けの注意点やコツ

6. ✨ **まとめ：これからどうなる？**（400〜500文字）
   - 記事の要点を3つでまとめ
   - 未来のワクワクする展望
   - 読者への行動を促すメッセージ

### 5. 品質基準
- 「へぇ〜！」「すごい！」と思わせる驚きの事実を最低3つ入れる
- 具体的な数字・データを5つ以上含める
- 仕事で実際に役立つ実践的なテクニック
- 2024-2025年12月時点の最新情報を反映
- 読んだ後すぐに試したくなる具体的なアクションを提示

## 出力形式（JSON）
{
  "title": "思わずクリックしたくなる魅力的なタイトル（30〜50文字、数字や疑問形を含む）",
  "excerpt": "記事を読みたくなる概要（100〜150文字、問いかけや驚きの事実を含む）",
  "content": "Markdown形式の本文（## で見出し、### で小見出し、適度に絵文字を使用）",
  "tags": ["タグ1", "タグ2", "タグ3", "タグ4", "タグ5"],
  "category": "カテゴリ名（AI技術、機械学習、LLM、画像生成AI、AIツール のいずれか）"
}

**重要**: 必ず5000〜6000文字で書いてください。JSONのみを出力してください。`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.75,
    max_tokens: 12000,
    response_format: { type: 'json_object' },
  })
  
  const content = response.choices[0]?.message?.content
  if (!content) throw new Error('記事生成に失敗しました')
  
  return JSON.parse(content)
}

// Unsplash APIから画像を取得
async function fetchUnsplashImage(keywords: string[]): Promise<{
  url: string
  credit: string
} | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY
  if (!accessKey) {
    console.log('Unsplash APIキーが設定されていません')
    return null
  }
  
  const query = keywords.slice(0, 2).join(' ') + ' technology'
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=10&orientation=landscape`
  
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
      },
    })
    
    if (!response.ok) {
      console.log('Unsplash API エラー:', response.status)
      return null
    }
    
    const data = await response.json()
    if (data.results && data.results.length > 0) {
      // ランダムに1枚選択
      const randomIndex = Math.floor(Math.random() * Math.min(data.results.length, 5))
      const photo = data.results[randomIndex]
      return {
        url: photo.urls.regular,
        credit: `${photo.user.name} on Unsplash`,
      }
    }
  } catch (error) {
    console.log('Unsplash API エラー:', error)
  }
  
  return null
}

// Pexels APIから画像を取得（Unsplashの代替）
async function fetchPexelsImage(keywords: string[]): Promise<{
  url: string
  credit: string
} | null> {
  const apiKey = process.env.PEXELS_API_KEY
  if (!apiKey) {
    console.log('Pexels APIキーが設定されていません')
    return null
  }
  
  const query = keywords.slice(0, 2).join(' ') + ' technology'
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=10&orientation=landscape`
  
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: apiKey,
      },
    })
    
    if (!response.ok) {
      console.log('Pexels API エラー:', response.status)
      return null
    }
    
    const data = await response.json()
    if (data.photos && data.photos.length > 0) {
      const randomIndex = Math.floor(Math.random() * Math.min(data.photos.length, 5))
      const photo = data.photos[randomIndex]
      return {
        url: photo.src.large,
        credit: `${photo.photographer} on Pexels`,
      }
    }
  } catch (error) {
    console.log('Pexels API エラー:', error)
  }
  
  return null
}

// スラッグを生成
function generateSlug(title: string, date: string): string {
  const dateStr = date.replace(/-/g, '')
  const hash = Math.random().toString(36).substring(2, 8)
  return `${dateStr}-${hash}`
}

// メイン処理
export async function generateArticle(): Promise<string> {
  console.log('🚀 記事生成を開始します...')
  
  // ディレクトリ確認
  if (!fs.existsSync(articlesDir)) {
    fs.mkdirSync(articlesDir, { recursive: true })
  }
  
  // トピックログを読み込み
  const log = loadTopicsLog()
  
  // ユニークなトピックを生成
  console.log('📝 ユニークなトピックを生成中...')
  const { topic, keywords } = await generateUniqueTopic(log)
  console.log(`✅ トピック: ${topic}`)
  
  // 記事本文を生成
  console.log('✍️ 記事本文を生成中...')
  const article = await generateArticleContent(topic, keywords)
  console.log(`✅ タイトル: ${article.title}`)
  console.log(`✅ 文字数: ${article.content.length}文字`)
  
  // 画像を取得
  console.log('🖼️ 画像を取得中...')
  let image = await fetchUnsplashImage(keywords)
  if (!image) {
    image = await fetchPexelsImage(keywords)
  }
  if (image) {
    console.log(`✅ 画像取得成功: ${image.credit}`)
  } else {
    console.log('⚠️ 画像の取得に失敗しました（デフォルト画像を使用）')
  }
  
  // 日付とスラッグ
  const date = format(new Date(), 'yyyy-MM-dd')
  const slug = generateSlug(article.title, date)
  
  // Markdownファイルを作成
  const frontmatter = `---
title: "${article.title.replace(/"/g, '\\"')}"
date: "${date}"
excerpt: "${article.excerpt.replace(/"/g, '\\"')}"
category: "${article.category}"
tags: [${article.tags.map(t => `"${t}"`).join(', ')}]
image: "${image?.url || ''}"
imageCredit: "${image?.credit || ''}"
---

`
  
  const filePath = path.join(articlesDir, `${slug}.md`)
  fs.writeFileSync(filePath, frontmatter + article.content)
  console.log(`✅ 記事を保存しました: ${filePath}`)
  
  // トピックログを更新
  log.generatedTopics.push({
    topic,
    keywords,
    date,
    slug,
  })
  saveTopicsLog(log)
  
  console.log('🎉 記事生成が完了しました！')
  return slug
}

// コマンドライン実行
if (require.main === module) {
  generateArticle()
    .then(slug => {
      console.log(`\n📖 生成された記事: /articles/${slug}`)
      process.exit(0)
    })
    .catch(error => {
      console.error('❌ エラー:', error)
      process.exit(1)
    })
}

