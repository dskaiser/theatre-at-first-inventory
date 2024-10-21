import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/item-upload', '/update-tags'])
const isProtectedPostRoute = createRouteMatcher(['/item'])

export default clerkMiddleware((auth, req) => {
    if (isProtectedRoute(req)) auth().protect()
    if (isProtectedPostRoute(req) && req.method === 'GET') auth().protect()
})

export const config = {
    // Protects all routes, including api/trpc.
    // See https://clerk.com/docs/references/nextjs/auth-middleware
    // for more information about configuring your Middleware
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
