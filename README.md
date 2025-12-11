# Ennek Lab 🤖

最新のAI技術に関する実用的な記事を毎日自動生成・投稿するブログサイトです。

🌐 **URL**: https://ennekai-lab.com

## ✨ 特徴

- **毎日自動更新**: GitHub Actionsで毎日朝8時に新しい記事を自動生成
- **4000〜5000文字の詳細記事**: GPT-4oによる高品質な記事生成
- **無料の美しい画像**: Unsplash/Pexels APIから関連画像を自動取得
- **重複なし**: 過去の記事トピックを追跡し、ユニークな記事のみ生成
- **モダンなUI**: サイバーパンク風のダークテーマデザイン

## 🚀 セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成し、以下を設定：

```env
# 必須: OpenAI APIキー
OPENAI_API_KEY=sk-your-openai-api-key

# オプション: 画像API（どちらか1つあればOK）
UNSPLASH_ACCESS_KEY=your-unsplash-key
PEXELS_API_KEY=your-pexels-key
```

### APIキーの取得方法

1. **OpenAI API**: https://platform.openai.com/api-keys
2. **Unsplash API** (無料): https://unsplash.com/developers
3. **Pexels API** (無料): https://www.pexels.com/api/

### 3. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でサイトを確認できます。

## 📝 記事の生成

### 手動で1記事生成

```bash
npm run generate
```

### ローカルで自動生成スケジューラーを起動

```bash
npm run generate:daily
```

### 即時実行 + スケジューラー

```bash
npm run generate:daily -- --run-now
```

## 🔄 自動デプロイ（GitHub Actions）

1. GitHubリポジトリの Settings > Secrets and variables > Actions で以下を設定：
   - `OPENAI_API_KEY`
   - `UNSPLASH_ACCESS_KEY` (オプション)
   - `PEXELS_API_KEY` (オプション)

2. `.github/workflows/daily-article.yml` が毎日自動実行されます

3. Vercelにデプロイする場合は、リポジトリを連携するだけで自動デプロイされます

## 📁 プロジェクト構造

```
AI-blog1/
├── app/                      # Next.js App Router
│   ├── page.tsx              # ホームページ
│   ├── layout.tsx            # 共通レイアウト
│   ├── globals.css           # グローバルスタイル
│   ├── about/                # サイトについてページ
│   └── articles/[slug]/      # 記事詳細ページ
├── content/
│   ├── articles/             # 生成された記事（Markdown）
│   └── topics-log.json       # 生成済みトピックのログ
├── lib/
│   ├── articles.ts           # 記事取得ユーティリティ
│   └── markdown.ts           # Markdown変換
├── scripts/
│   ├── generate-article.ts   # 記事生成スクリプト
│   └── daily-generator.ts    # 自動生成スケジューラー
└── .github/workflows/
    └── daily-article.yml     # GitHub Actions設定
```

## 🎨 カスタマイズ

### トピックカテゴリの変更

`scripts/generate-article.ts` の `TOPIC_CATEGORIES` 配列を編集

### トレンドキーワードの更新

`scripts/generate-article.ts` の `TREND_KEYWORDS` 配列を編集

### 生成時刻の変更

`.github/workflows/daily-article.yml` の cron 設定を変更

## 📄 ライセンス

MIT License

## 🙏 クレジット

- 画像: [Unsplash](https://unsplash.com/) / [Pexels](https://pexels.com/)
- 記事生成: [OpenAI GPT-4o](https://openai.com/)

