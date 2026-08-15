import PageHeader from '@/components/PageHeader'
import { Link } from 'react-router'

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Sign in"
        description="Access your account to continue."
      />
      <p className="text-sm text-muted-foreground">
        Auth form goes here.{' '}
        <Link to="/auth/register" className="text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  )
}
