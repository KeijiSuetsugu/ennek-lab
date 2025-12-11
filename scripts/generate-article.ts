import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'
import { format } from 'date-fns'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const articlesDir = path.join(process.cwd(), 'content/articles')
const topicsLogPath = path.join(process.cwd(), 'content/topics-log.json')

// AI技術に関するトピックカテゴリ
const TOPIC_CATEGORIES = [
  '大規模言語モデル（LLM）',
  '画像生成AI',
  'AIチャットボット',
  '機械学習の実践',
  'AIツール・サービス',
  'AI開発フレームワーク',
  'AIと倫理・規制',
  'AI活用ビジネス事例',
  'AIエージェント',
  '音声認識・合成AI',
  'コンピュータビジョン',
  'AIの最新研究',
  'ローカルLLM',
  'RAG・検索拡張生成',
  'AIプロンプトエンジニアリング',
  'マルチモーダルAI',
  'AI自動化・RPA',
  'AIセキュリティ',
  'エッジAI',
  '強化学習',
]

// 最新のAI技術トレンドキーワード
const TREND_KEYWORDS = [
  'GPT-4o', 'Claude 3.5', 'Gemini 2.0', 'Llama 3', 'Mistral',
  'DALL-E 3', 'Midjourney V6', 'Stable Diffusion 3', 'Flux',
  'RAG', 'ファインチューニング', 'プロンプトエンジニアリング',
  'AIエージェント', 'AutoGPT', 'CrewAI', 'LangChain', 'LlamaIndex',
  'Ollama', 'vLLM', 'ローカルLLM',
  'マルチモーダル', 'Vision-Language Model',
  'AI規制', 'AI倫理', 'AI安全性',
  'AIコーディング', 'Cursor', 'GitHub Copilot', 'Devin',
  'Text-to-Speech', 'Speech-to-Text', 'ElevenLabs',
  'AI動画生成', 'Sora', 'Runway', 'Pika',
  'リアルタイムAI', 'エッジAI', 'オンデバイスAI',
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
  
  const prompt = `あなたはAI技術ブログのトピック提案者です。

## タスク
「${randomCategory}」カテゴリで、最新のAI技術に関する実用的で興味深い記事トピックを1つ提案してください。

## 考慮すべきトレンドキーワード
${randomTrends}

## 避けるべき既存トピック（類似したものは避けてください）
${existingTopics || '（まだ記事がありません）'}

## 要件
1. 具体的で実用的なトピック（初心者〜中級者向け）
2. 2024-2025年の最新トレンドを反映
3. 4000〜5000文字の記事が書ける深さのあるトピック
4. 他の記事と差別化できるユニークな切り口

## 出力形式（JSON）
{
  "topic": "記事のトピック（具体的なタイトルではなく、テーマ）",
  "suggestedTitle": "提案する記事タイトル",
  "keywords": ["キーワード1", "キーワード2", "キーワード3", "キーワード4", "キーワード5"]
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
  const prompt = `あなたは中学生〜高校生にも分かりやすくAI技術を解説する人気ライターです。以下のトピックについて、4000〜5000文字のワクワクする記事を日本語で執筆してください。

## トピック
${topic}

## キーワード
${keywords.join('、')}

## 記事の要件
1. **文字数**: 4000〜5000文字（これは重要）
2. **対象読者**: 中学生〜社会人まで幅広く（専門知識がなくても楽しめる）
3. **文体**: 
   - フレンドリーで親しみやすい「です・ます」調
   - 難しい専門用語は必ず「〜とは、○○のこと」と説明を入れる
   - 「例えば」「イメージとしては」など具体例を多用
   - 絵文字を適度に使って親しみやすく（🤖💡🎯など）

4. **構成**:
   - 🎯 **つかみ**（「こんな経験ありませんか？」「実は○○って...」など興味を引く導入）
   - 📚 **そもそも○○とは？**（基礎知識を分かりやすく）
   - 🔥 **ここがスゴイ！**（技術の魅力・メリットを熱く解説）
   - 💼 **仕事や生活でこう使える！**（具体的な活用シーン3〜5つ）
   - 🚀 **今すぐ試せる方法**（読者がすぐに実践できるステップ）
   - ✨ **まとめ：未来はこうなる！**（ワクワクする展望）

## 品質基準
- 「へぇ〜！」「すごい！」と思わせる驚きの事実を入れる
- 身近な例え話を使う（「○○は、料理で言うと△△のようなもの」など）
- 仕事で実際に役立つ実践的なテクニックを含める
- 最新の情報を反映（2024-2025年）
- 読んだ後すぐに試したくなる具体的なアクションを提示

## 出力形式（JSON）
{
  "title": "思わずクリックしたくなる魅力的なタイトル（30〜50文字、数字や「〜する方法」などを含む）",
  "excerpt": "記事を読みたくなる概要（100〜150文字、問いかけや驚きを含む）",
  "content": "Markdown形式の本文（## で見出し、### で小見出し、適度に絵文字を使用）",
  "tags": ["タグ1", "タグ2", "タグ3", "タグ4", "タグ5"],
  "category": "カテゴリ名（AI技術、機械学習、LLM、画像生成AI、AIツール のいずれか）"
}

JSONのみを出力してください。`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 8000,
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

