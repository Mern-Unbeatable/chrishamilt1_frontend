import PageHeader from '@/components/PageHeader'
import { Link } from 'react-router'

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Create account"
        description="Join as a user or tradesman."
      />
      <p className="text-sm text-muted-foreground">
        Registration form goes here.{' '}
        <Link to="/auth/login" className="text-primary hover:underline">
          Already have an account?
        </Link>
      </p>
    </div>
  )
}
