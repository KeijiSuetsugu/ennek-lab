import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'
import { format, subDays } from 'date-fns'
import { ja } from 'date-fns/locale'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const articlesDir = path.join(process.cwd(), 'content/articles')
const topicsLogPath = path.join(process.cwd(), 'content/topics-log.json')

// 情報収集元となるAI関連メディア・ソース
const AI_INFORMATION_SOURCES = [
  // ★★★ メインソース ★★★
  'DaiGo Video Lab AI - メンタリストDaiGoによるAI活用・最新AI技術の解説動画 (https://daigovideolab.jp/?select=ai)',
  
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

// メインの情報源（優先的に参照）
const MAIN_SOURCE = {
  name: 'DaiGo Video Lab AI',
  url: 'https://daigovideolab.jp/?select=ai',
  description: 'メンタリストDaiGoによるAI活用の実践的な解説。心理学×AIの独自視点で、AIの使い方や最新技術を分かりやすく紹介。',
}

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
  
  // 今日と昨日の日付を取得
  const today = new Date()
  const yesterday = subDays(today, 1)
  const todayStr = format(today, 'yyyy年M月d日（E）', { locale: ja })
  const yesterdayStr = format(yesterday, 'yyyy年M月d日（E）', { locale: ja })
  
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

## 📅 今日の日付
${todayStr}

## 🎯 タスク
**昨日（${yesterdayStr}）に発表された、または話題になった**AI関連のニュース・トピックから、「${randomCategory}」カテゴリで記事を書くためのトピックを1つ提案してください。

## ⚠️ 重要：「昨日のニュース」として書く
- 記事は「昨日発表された」「昨日話題になった」内容として書きます
- 最新のリリース情報、アップデート、発表、研究成果などが対象
- 「〇〇が発表されました」「〇〇がリリースされました」という切り口で

## ★★★ メインの情報源（最優先で参考にする）★★★
**${MAIN_SOURCE.name}** (${MAIN_SOURCE.url})
${MAIN_SOURCE.description}

→ このサイトで紹介されているAI活用法、最新技術、心理学×AIの視点を参考に、実用的で分かりやすいトピックを選んでください。

## その他の参考情報源
${randomSources}

## 考慮すべき最新トレンドキーワード
${randomTrends}

## 避けるべき既存トピック（類似したものは避けてください）
${existingTopics || '（まだ記事がありません）'}

## 要件
1. 昨日発表/話題になったニュースとして成立するトピック
2. 具体的で実用的（中学生〜社会人まで楽しめる）
3. 5000〜6000文字の記事が書ける深さのあるトピック
4. 他の記事と差別化できるユニークな切り口
5. 「へぇ〜！」「すごい！」と思わせる驚きのある内容

## トピック選定のヒント（昨日のニュースとして）
- 新しいAIモデル・サービスのリリース発表
- 既存サービスの大型アップデート
- AI企業の新しい取り組み・方針発表
- 注目の研究成果・論文の発表
- AI規制・政策に関する動き
- AI業界の買収・提携・投資ニュース
- 話題になったAI活用事例

## 出力形式（JSON）
{
  "topic": "記事のトピック（具体的なタイトルではなく、テーマ）",
  "suggestedTitle": "提案する記事タイトル（「〇〇が発表」「〇〇をリリース」など速報感のあるもの）",
  "keywords": ["キーワード1", "キーワード2", "キーワード3", "キーワード4", "キーワード5"],
  "newsAngle": "昨日このニュースが発表/話題になった背景と、読者にとっての重要性"
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
  // 今日と昨日の日付を取得
  const today = new Date()
  const yesterday = subDays(today, 1)
  const todayStr = format(today, 'yyyy年M月d日（E）', { locale: ja })
  const yesterdayStr = format(yesterday, 'yyyy年M月d日（E）', { locale: ja })
  const yesterdayShort = format(yesterday, 'M月d日', { locale: ja })
  
  // 参照すべき情報源をすべて含める
  const allSources = AI_INFORMATION_SOURCES.map(s => `- ${s}`).join('\n')

  const prompt = `あなたは日本の主要AIメディアや、メンタリストDaiGoのAI解説動画のスタイルに精通した人気ライターです。

## 📅 日付情報
- 今日: ${todayStr}
- 昨日: ${yesterdayStr}

## 🎯 タスク
**「${yesterdayShort}に発表/話題になった最新ニュース」として**、中学生〜社会人まで誰でも楽しめる、**5000〜6000文字**のAI技術解説記事を日本語で執筆してください。

## トピック（昨日発表/話題になった内容として書く）
${topic}

## キーワード
${keywords.join('、')}

## ★★★ メインの情報源・スタイル参考 ★★★
**${MAIN_SOURCE.name}** (${MAIN_SOURCE.url})
${MAIN_SOURCE.description}

→ DaiGoの動画のように、複雑なAI技術を「誰でも分かる言葉」で、「すぐに使える実践的な内容」として伝えてください。
→ 心理学的な視点や、「なぜこれが重要なのか」という本質的な解説を心がけてください。

## その他の参考情報源
${allSources}

## ⚠️ 重要：「昨日のニュース」として書く
- 記事の冒頭で「${yesterdayShort}、〇〇が発表されました」「昨日、〇〇がリリースされました」のように書き始める
- 「つい昨日のことです」「昨日発表されたばかりの」など、最新感を出す
- 速報性のあるニュース記事のテンションで書く

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
- 絵文字を適度に使って親しみやすく（🤖💡🎯🚀✨🆕📢など）
- 「すごいですよね！」「驚きですね！」など感情を込めた表現
- 「速報です！」「要チェックです！」など緊急感のある表現

### 4. 構成（この順番で書く）
1. 🆕 **速報！何が発表された？**（500〜600文字）
   - 「${yesterdayShort}、〇〇が発表されました！」という書き出し
   - 何が、誰によって、どう発表されたかを簡潔に
   - 「これは〇〇にとって大きなニュースです！」と重要性を強調

2. 📚 **そもそも○○とは？**（800〜1000文字）
   - このニュースを理解するための基礎知識
   - 「料理で例えると」「学校の授業で例えると」など身近な例え
   - 図解の代わりに、ステップを箇条書きで分かりやすく

3. 🔥 **ここがスゴイ！今回の発表の3つのポイント**（1200〜1500文字）
   - 今回の発表・ニュースの何がすごいのか3つに整理
   - 「従来は○○だったのが、△△になった！」というビフォー・アフター
   - 具体的な数字やデータを入れる

4. 💼 **私たちの生活・仕事はこう変わる！活用シーン5選**（1200〜1500文字）
   - このニュースが私たちにどう影響するか
   - 「学生なら」「社会人なら」「趣味で使うなら」など読者別に
   - 「〇〇ができるようになります」と未来形で

5. 🚀 **今すぐ試せる？始め方ガイド**（800〜1000文字）
   - すでに使えるなら：具体的な始め方のステップ
   - まだ使えないなら：いつから使えるか、準備しておくべきこと
   - 無料で試せる方法を優先

6. ✨ **まとめ：この発表が意味すること**（400〜500文字）
   - 今回のニュースの要点を3つでまとめ
   - AI業界全体への影響
   - 「続報に注目です！」で締める

### 5. 品質基準
- 「へぇ〜！」「すごい！」と思わせる驚きの事実を最低3つ入れる
- 具体的な数字・データを5つ以上含める
- 仕事で実際に役立つ実践的なテクニック
- 最新情報として${yesterdayShort}の日付を意識
- 読んだ後すぐに試したくなる具体的なアクションを提示

## 出力形式（JSON）
{
  "title": "【速報】〇〇が発表！〜のような、ニュース性のあるタイトル（30〜50文字）",
  "excerpt": "昨日発表されたばかりの〇〇について...のような、速報感のある概要（100〜150文字）",
  "content": "Markdown形式の本文（## で見出し、### で小見出し、適度に絵文字を使用）",
  "tags": ["タグ1", "タグ2", "タグ3", "タグ4", "タグ5"],
  "category": "カテゴリ名（AI技術、機械学習、LLM、画像生成AI、AIツール のいずれか）"
}

**重要**: 必ず5000〜6000文字で書いてください。「昨日のニュース」として書いてください。JSONのみを出力してください。`

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

