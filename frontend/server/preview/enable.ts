import { validatePreviewUrl } from '@sanity/preview-url-secret'

// Replaces the /preview/enable route of @nuxtjs/sanity on Vercel deployments that
// have a read token (registered in nuxt.config). Besides the Sanity preview
// cookie it sets `__prerender_bypass`, so this browser skips the ISR cache and
// sees drafts while everyone else keeps getting cached pages.
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const { token, previewModeId } = config.sanity.visualEditing as { token: string, previewModeId: string }

  const client = useSanity().client.withConfig({ token })
  const { isValid, redirectTo = '/' } = await validatePreviewUrl(client, getRequestURL(event).toString())
  if (!isValid) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid secret' })
  }

  // The Studio shows the site in an iframe on another domain
  const options = { httpOnly: true, sameSite: 'none', secure: true, path: '/' } as const
  setCookie(event, 'sanity-preview-id', previewModeId, options)
  setCookie(event, '__prerender_bypass', config.isrBypassToken, options)
  return sendRedirect(event, redirectTo, 307)
})
