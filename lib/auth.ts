import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      isAdmin?: boolean
    }
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // For admin login, check against hardcoded credentials
        if (credentials.email === "kezia.cindy@gmail.com" && credentials.password === "geniusmind") {
          return {
            id: "admin",
            email: "kezia.cindy@gmail.com",
            name: "Admin User",
            image: null,
          };
        }

        // For regular users, check database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          return null;
        }

        // Note: In a real app, you'd hash passwords and compare hashes
        // For now, we'll just check if the user exists
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow sign in for all providers
      return true
    },
    async session({ session, user, token }) {
      // Send properties to the client
      if (session.user) {
        if (user) {
          (session.user as { id: string }).id = user.id
        } else if (token) {
          (session.user as { id: string }).id = token.sub || token.id as string
        }
        
        // Add admin role check
        (session.user as { isAdmin: boolean }).isAdmin = 
          session.user.email === "kezia.cindy@gmail.com" || 
          (token as any)?.isAdmin === true
      }
      return session
    },
    async jwt({ token, account, user }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
      }
      
      // Add admin role to token
      if (user?.email === "kezia.cindy@gmail.com") {
        (token as any).isAdmin = true
      }
      
      return token
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
