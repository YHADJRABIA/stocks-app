import createMiddleware from 'next-intl/middleware'
import withAuth, { NextRequestWithAuth } from 'next-auth/middleware'
import { NextFetchEvent, NextResponse } from 'next/server'
import { isLoginOrRegisterPath, isProtectedPath } from './utils/paths'
import {
  defaultLocale,
  localePrefix,
  locales,
  pathnames,
} from './lib/i18n/navigation'
import { DEFAULT_LOGIN_REDIRECT_ROUTE, LOGIN_ROUTE } from './routes/routes'
import { getToken } from 'next-auth/jwt'
import { Pathname } from './types/pathnames'

const intlMiddleware = createMiddleware({
  defaultLocale,
  localePrefix,
  locales,
  pathnames,
})

// AuthMiddleware is skipped if user hits public routes
const authMiddleware = withAuth(
  function onSuccess(req) {
    // Skip to IntlMiddleware if user is authenticated
    return intlMiddleware(req)
  },
  {
    callbacks: {
      authorized: ({ token }) => token !== null, // User is considered authenticated if token isn't null
    },
    pages: {
      // Replace Next-auth's built-in pages with own custom pagess
      signIn: LOGIN_ROUTE, // Unauthenticated user is redirected here when attempting to access protected routes
      error: '/error',
    },
  }
)

// Called whenever request matches config
// Dispatches request to middlewares depending on conditions
export default async function middleware(req: NextRequestWithAuth) {
  const { pathname } = req.nextUrl
  const isProtectedRoute = isProtectedPath(pathname as Pathname)

  // TODO: limit /api calls from same ip to prevent potential abuse

  // Needed outside of authMiddleware to access session (has to be the same as in authOptions at /auth.config.ts)
  const secret = process.env.NEXTAUTH_SECRET
  const session = await getToken({ req, secret })
  const isConnected = !!session

  // Prevent authenticated user from reaching login/register pages by redirecting away
  if (isConnected && isLoginOrRegisterPath(pathname as Pathname)) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT_ROUTE, req.url))
  }

  // Skip authMiddleware if route is public
  return isProtectedRoute
    ? authMiddleware(req, {} as NextFetchEvent)
    : intlMiddleware(req)
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'], // Middleware triggers whenever route matches this regex
}
