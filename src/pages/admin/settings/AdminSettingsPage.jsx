import { useCallback, useEffect, useState } from 'react'
import { AUTH_CONFIG } from '@/auth/authConfig'
import {
  fetchCurrentUser,
  mapApiUserToAdminProfile,
} from '@/auth/authService'
import { useAuth } from '@/auth/AuthProvider'
import ProfileSettings from '@/components/forms/ProfileSettings/ProfileSettings'
import { DEMO_ADMIN_PROFILE } from '@/data/demoData'
import { showApiErrorFromError } from '@/helpers/showAppAlert'
import { submitPasswordChange } from '@/helpers/submitPasswordChange'
import { submitProfileUpdate } from '@/helpers/submitProfileUpdate'

export default function AdminSettingsPage() {
  const useApi = !AUTH_CONFIG.useDemoAuth
  const { refreshSession } = useAuth()

  const [profile, setProfile] = useState(DEMO_ADMIN_PROFILE)
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
          setProfile(mapApiUserToAdminProfile(user))
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
      const updatedProfile = await submitProfileUpdate(payload, { role: 'admin' })

      if (updatedProfile) {
        setProfile(updatedProfile)
        refreshSession()
      }
    },
    [refreshSession],
  )

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#E5E7EB] bg-white px-6 py-16 text-center">
        <p className="text-sm text-[#64748B]">Loading profile…</p>
      </div>
    )
  }

  if (loadError && useApi) {
    return (
      <div className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-6 py-12 text-center">
        <p className="text-base font-semibold text-[#B91C1C]">{loadError}</p>
      </div>
    )
  }

  return (
    <ProfileSettings
      role="admin"
      value={profile}
      onChange={setProfile}
      onUpdateProfile={handleUpdateProfile}
      onChangePassword={(passwords) => submitPasswordChange(passwords)}
    />
  )
}
