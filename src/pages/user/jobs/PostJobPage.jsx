import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { useAuth } from '@/auth/AuthProvider'
import PostJobForm from '@/components/forms/PostJobForm'
import { DEMO_POST_JOB_DEFAULT } from '@/data/postJobData'
import { DEMO_USER_PROFILE } from '@/data/demoData'
import { showApiErrorFromError, showSuccessAlert } from '@/helpers/showAppAlert'
import {
  createUserJob,
  extractCityFromLocation,
  fetchPostJobCategories,
  fetchUserJob,
  getFallbackPostJobCategories,
  isUserJobsApiEnabled,
  updateUserJob,
} from '@/services/userJobsApi'

export default function PostJobPage() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const { session } = useAuth()
  const useApi = isUserJobsApiEnabled()
  const isEditMode = Boolean(jobId)

  const [categories, setCategories] = useState(() =>
    useApi ? [] : getFallbackPostJobCategories(),
  )
  const [categoriesLoading, setCategoriesLoading] = useState(useApi)
  const [jobLoading, setJobLoading] = useState(useApi && isEditMode)
  const [loadError, setLoadError] = useState('')
  const [formDefaults, setFormDefaults] = useState({
    ...DEMO_POST_JOB_DEFAULT,
    customerName: session?.name || DEMO_USER_PROFILE.firstName,
    customerEmail: session?.email || DEMO_USER_PROFILE.email,
    customerPhone: DEMO_USER_PROFILE.phone,
  })

  useEffect(() => {
    if (!useApi) return undefined

    let cancelled = false

    fetchPostJobCategories()
      .then((nextCategories) => {
        if (!cancelled) setCategories(nextCategories)
      })
      .catch(async (err) => {
        if (!cancelled) {
          setCategories([])
          await showApiErrorFromError(err, 'Unable to load job categories')
        }
      })
      .finally(() => {
        if (!cancelled) setCategoriesLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [useApi])

  useEffect(() => {
    if (!useApi || !isEditMode) return undefined

    let cancelled = false

    async function loadJob() {
      setJobLoading(true)
      setLoadError('')

      try {
        const jobValues = await fetchUserJob(jobId)
        if (cancelled) return

        setFormDefaults((current) => ({
          ...current,
          ...jobValues,
        }))
      } catch (err) {
        if (!cancelled) {
          setLoadError(err?.message || 'Unable to load this job for editing.')
        }
      } finally {
        if (!cancelled) setJobLoading(false)
      }
    }

    loadJob()

    return () => {
      cancelled = true
    }
  }, [useApi, isEditMode, jobId])

  const handleSubmit = async (values) => {
    const payload = {
      title: values.title,
      description: values.description,
      categoryId: values.categoryId,
      location: values.location,
      city: values.city || extractCityFromLocation(values.location),
      budgetMin: values.budgetMin,
      budgetMax: values.budgetMax,
      urgency: values.urgency,
      preferredStart: values.preferredStart,
      completionBy: values.completionBy,
      specialNotes: values.specialNotes,
      requirements: values.requirements,
      files: values.files,
    }

    if (useApi) {
      if (isEditMode) {
        await updateUserJob(jobId, payload)
        await showSuccessAlert({
          title: 'Job updated',
          text: 'Your job post has been saved.',
        })
      } else {
        await createUserJob(payload)
        await showSuccessAlert({
          title: 'Job posted',
          text: 'Your job is live and ready to receive quotes.',
        })
      }
    } else {
      await new Promise((resolve) => setTimeout(resolve, 400))
    }

    navigate('/my-jobs', { replace: true })
  }

  if (jobLoading) {
    return (
      <section className="bg-[#F8FAFC] py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-xl border border-[#E5E7EB] bg-white px-6 py-16 text-center">
            <p className="text-sm text-[#64748B]">Loading job details…</p>
          </div>
        </div>
      </section>
    )
  }

  if (loadError) {
    return (
      <section className="bg-[#F8FAFC] py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-6 py-12 text-center">
            <p className="text-base font-semibold text-[#B91C1C]">{loadError}</p>
            <Link
              to="/my-jobs"
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-btn-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC]"
            >
              Back to My Jobs
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-[#F8FAFC] py-8 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <PostJobForm
          key={isEditMode ? `${jobId}-${formDefaults.title}` : 'create'}
          mode={isEditMode ? 'edit' : 'create'}
          categories={categories}
          categoriesLoading={categoriesLoading}
          defaultValues={formDefaults}
          onClose={() => navigate(-1)}
          onSubmit={handleSubmit}
        />
      </div>
    </section>
  )
}
