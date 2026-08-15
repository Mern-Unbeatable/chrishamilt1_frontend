import { Link } from 'react-router'
import PageHeader from '@/components/PageHeader'

export default function NotFoundPage() {
  return (
    <section className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center lg:px-8">
      <PageHeader
        title="404 — Page not found"
        description="The page you are looking for does not exist or has been moved."
        className="text-center"
      />
      <Link
        to="/"
        className="mt-8 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Back to home
      </Link>
    </section>
  )
}
