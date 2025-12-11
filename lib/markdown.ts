import { marked } from 'marked'

// Markedのオプション設定
marked.setOptions({
  gfm: true,
  breaks: true,
})

export function parseMarkdown(content: string): string {
  return marked.parse(content) as string
}

