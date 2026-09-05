import { useCallback, useEffect, useState } from 'react'
import { AUTH_CONFIG } from '@/auth/authConfig'
import {
  fetchCurrentUser,
  mapApiUserToProfile,
} from '@/auth/authService'
import { useAuth } from '@/auth/AuthProvider'
import ProfileSettings from '@/components/forms/ProfileSettings/ProfileSettings'
import { DEMO_USER_PROFILE } from '@/data/demoData'
import { showApiErrorFromError } from '@/helpers/showAppAlert'
import { submitPasswordChange } from '@/helpers/submitPasswordChange'
import { submitProfileUpdate } from '@/helpers/submitProfileUpdate'

export default function UserProfilePage() {
  const useApi = !AUTH_CONFIG.useDemoAuth
  const { refreshSession } = useAuth()

  const [profile, setProfile] = useState(DEMO_USER_PROFILE)
  const [loading, setLoading] = useState(useApi)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    if (!useApi) return undefined

    let cancelled = false

    async function loadProfile() {
      setLoading(true)
      setLoadError('')

      try {
        const user = await fetchCurrentUser()
        if (!cancelled) {
          setProfile(mapApiUserToProfile(user, 'user'))
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(err?.message || 'Unable to load profile.')
          await showApiErrorFromError(err, 'Unable to load profile')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadProfile()

    return () => {
      cancelled = true
    }
  }, [useApi])

  const handleUpdateProfile = useCallback(
    async (payload) => {
      const updatedProfile = await submitProfileUpdate(payload, { role: 'user' })

      if (updatedProfile) {
        setProfile(updatedProfile)
        refreshSession()
      }
    },
    [refreshSession],
  )

  if (loading) {
    return (
      <section className="bg-[#F8FAFC] py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-2xl border border-[#E5E7EB] bg-white px-6 py-16 text-center">
            <p className="text-sm text-[#64748B]">Loading profile…</p>
          </div>
        </div>
      </section>
    )
  }

  if (loadError && useApi) {
    return (
      <section className="bg-[#F8FAFC] py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-6 py-12 text-center">
            <p className="text-base font-semibold text-[#B91C1C]">{loadError}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-[#F8FAFC] py-8 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <ProfileSettings
            role="user"
            title="My Profile"
            subtitle="Manage your account details and password."
            value={profile}
            onChange={setProfile}
            onUpdateProfile={handleUpdateProfile}
            onChangePassword={(passwords) => submitPasswordChange(passwords)}
          />
        </div>
      </div>
    </section>
  )
}
