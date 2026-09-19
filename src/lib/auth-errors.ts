export function friendlyAuthError(message: string) {
  const normalized = message.toLowerCase()
  if (normalized.includes('invalid login credentials')) return 'The email or password is incorrect. Please try again.'
  if (normalized.includes('already registered') || normalized.includes('already been registered') || normalized.includes('user already exists')) return 'An account already exists for this email. Try logging in instead.'
  if (normalized.includes('password') && (normalized.includes('weak') || normalized.includes('characters'))) return 'Please choose a stronger password with at least 8 characters.'
  if (normalized.includes('email not confirmed')) return 'Please confirm your email before logging in.'
  if (normalized.includes('rate limit')) return 'Too many attempts. Please wait a moment and try again.'
  return 'Authentication could not be completed. Please try again.'
}
