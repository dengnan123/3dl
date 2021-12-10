export const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
export const isProduction = process.env.NODE_ENV === 'production'

export function isOpenPages(pathname) {
  return pathname.startsWith('/o/')
}

export function resolvePublicPath(pathname) {
  const base = window.routerBase || ''
  if (isProduction) {
    return `${base.endsWith('/') ? base.slice(0, base.length - 1) : base}${pathname}`
  }
  return pathname
}
