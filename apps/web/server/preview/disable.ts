// Runs before the /preview/disable route of @nuxtjs/sanity, which clears the
// preview cookie: also clears the ISR bypass cookie set by ./enable.ts
export default defineEventHandler((event) => {
  if (getRequestURL(event).pathname === '/preview/disable') {
    deleteCookie(event, '__prerender_bypass', { path: '/' })
  }
})
