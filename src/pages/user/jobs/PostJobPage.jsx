import { useNavigate } from 'react-router'
import { useAuth } from '@/auth/AuthProvider'
import PostJobForm from '@/components/forms/PostJobForm'
import { DEMO_POST_JOB_DEFAULT } from '@/data/postJobData'
import { DEMO_USER_PROFILE } from '@/data/demoData'

export default function PostJobPage() {
  const navigate = useNavigate()
  const { session } = useAuth()

  return (
    <section className="bg-[#F8FAFC] py-8 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <PostJobForm
          defaultValues={{
            ...DEMO_POST_JOB_DEFAULT,
            customerName: session?.name || DEMO_USER_PROFILE.firstName,
            customerEmail: session?.email || DEMO_USER_PROFILE.email,
            customerPhone: DEMO_USER_PROFILE.phone,
          }}
          onClose={() => navigate(-1)}
          onSubmit={async () => {
            await new Promise((resolve) => setTimeout(resolve, 400))
            navigate('/my-jobs', { replace: true })
          }}
        />
      </div>
    </section>
  )
}
