import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bycrptjs from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import { UserModel } from '@/models/user.model'
import { UserAPIType } from '@/types/user'
import { isDevelopment } from '@/utils/general'
import { getUserByEmail } from '@/utils/mongoose'
import { isValidEmail, isValidPassword } from '@/utils/validators'
import { getErrorMessage } from '@/utils/errors'
import { loginSchema } from '@/types/schemas'

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET } = process.env

interface PropTypes {
  user: UserAPIType
  account: { provider: string }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  // Replaces built-in /api/auth/xxx pages with our custom pages
  pages: {
    signIn: '/login',
    /*     error:'/autherror' */ // TODO: complete later
  },
  secret: NEXTAUTH_SECRET!,
  debug: isDevelopment,

  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
    }),

    // Replaces api/login route
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        // For built-in form, useless here
        email: {
          label: 'Email',
          type: 'email',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },

      // Runs on credential login (with email & password)
      async authorize(credentials) {
        try {
          const validatedFields = loginSchema.safeParse(credentials)
          if (validatedFields.success) {
            const { email, password } = validatedFields.data

            if (!isValidEmail(email) || !isValidPassword(password)) {
              throw new Error('Missing fields')
            }
            await connectDB()
            const existingUser = await getUserByEmail(email)

            // If no matching user or user registered via Google (no password)
            if (!existingUser || !existingUser?.password) {
              throw new Error("User doesn't exist")
            }

            const passwordsMatch = await bycrptjs.compare(
              password,
              existingUser.password
            )
            if (!passwordsMatch) throw new Error('Incorrect password')

            // Passing down user to JWT
            return existingUser // TODO: Limit what's passed down
          }
        } catch (err) {
          console.error('Authorization failed:', getErrorMessage(err))
          throw err // Propagate error to frontend
        }
      },
    }),
  ],

  callbacks: {
    // Called after authorize, user is only populated on login
    jwt({ token, user }) {
      if (!user) return token // Logged out

      return { ...token, isVerifiedEmail: user.isVerifiedEmail } // Passing down token to session
    },

    // Called after jwt
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          isVerifiedEmail: token.isVerifiedEmail,
        },
      }
    },

    async signIn({ user, account }: PropTypes) {
      const [withGoogle, withCredentials] = [
        account.provider === 'google',
        account.provider === 'credentials',
      ]

      if (!user) return null

      // Credentials login
      if (withCredentials) {
        // Deny access if unverified email
        if (!user.isVerifiedEmail) return false
      }

      // Google login
      if (withGoogle) {
        try {
          const { name, email, image } = user
          await connectDB()

          const existingUser = await getUserByEmail(email)
          if (existingUser) return user

          const newUser = new UserModel({
            name,
            email,
            image,
            isVerifiedEmail: true, // Verify email automatically
          })
          const res = await newUser.save()
          if (res.status === 200 || res.status === 201) {
            return user
          }
        } catch (err) {
          console.error('Google SignIn failed:', getErrorMessage(err))
        }
      }
      return true
    },
  },
}
