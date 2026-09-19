export function safeReturnTo(search: string) {
  const candidate = new URLSearchParams(search).get('returnTo')
  return candidate?.startsWith('/') && !candidate.startsWith('//') ? candidate : '/dashboard'
}
