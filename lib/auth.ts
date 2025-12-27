import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

// 管理者の認証情報（環境変数から取得）
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || ''

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'ユーザー名', type: 'text' },
        password: { label: 'パスワード', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        // ユーザー名チェック
        if (credentials.username !== ADMIN_USERNAME) {
          return null
        }

        // パスワードチェック
        // 環境変数にハッシュがない場合は、直接比較（開発用）
        let isValid = false
        if (ADMIN_PASSWORD_HASH) {
          isValid = await bcrypt.compare(credentials.password, ADMIN_PASSWORD_HASH)
        } else {
          // 開発用：環境変数ADMIN_PASSWORDと直接比較
          const devPassword = process.env.ADMIN_PASSWORD || 'admin123'
          isValid = credentials.password === devPassword
        }

        if (isValid) {
          return {
            id: '1',
            name: ADMIN_USERNAME,
            email: 'admin@ennekai-lab.com',
          }
        }

        return null
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24時間
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-super-secret-key-change-in-production',
}


