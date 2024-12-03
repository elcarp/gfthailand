import { cookies } from 'next/headers'
import ProtectedContent from './protected-content'
import PasswordForm from './password-form'

export default async function ProtectedPage() {
  const cookieStore = cookies()
  const isAuthenticated = (await cookieStore).get('auth')?.value === 'true'

  if (!isAuthenticated) {
    return <PasswordForm />
  }

  return <ProtectedContent />
}
