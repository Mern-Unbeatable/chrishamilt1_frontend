import { AUTH_CONFIG } from '@/auth/authConfig'
import {
  buildProfileUpdateBody,
  getSessionNameFromProfile,
  mapApiUserToProfile,
  patchSessionUser,
  updateUserProfile,
  validateProfileUpdatePayload,
} from '@/auth/authService'
import { showApiErrorFromError, showErrorAlert, showSuccessAlert } from '@/helpers/showAppAlert'

export async function submitProfileUpdate(payload, { role = 'admin' } = {}) {
  const validationError = validateProfileUpdatePayload(payload, role)

  if (validationError) {
    await showErrorAlert({
      title: 'Invalid profile',
      text: validationError,
    })
    return null
  }

  if (AUTH_CONFIG.useDemoAuth) {
    await showSuccessAlert({
      title: 'Profile updated',
      text: 'Profile update is simulated in demo mode.',
    })

    const firstName = payload.firstName?.trim() ?? ''
    const lastName = payload.lastName?.trim() ?? ''
    const fullName =
      payload.fullName ||
      [firstName, lastName].filter(Boolean).join(' ').trim() ||
      payload.name?.trim() ||
      ''

    const demoUser = {
      fullName,
      firstName,
      lastName,
      email: payload.email?.trim() ?? '',
      phoneNumber: (payload.phone ?? payload.phoneNumber ?? '').trim(),
      region: payload.region ?? '',
      city: payload.city ?? '',
      zipCode: payload.zipCode?.trim() ?? '',
      address: payload.address?.trim() ?? '',
      warehouses: payload.warehouses ?? [],
    }

    return mapApiUserToProfile(demoUser, role)
  }

  try {
    const body = buildProfileUpdateBody(payload, role)
    const user = await updateUserProfile(body)
    const profile = mapApiUserToProfile(user, role)

    patchSessionUser({
      name: getSessionNameFromProfile(profile, role),
      email: profile.email,
    })

    await showSuccessAlert({
      title: 'Profile updated',
      text: 'Your account details have been saved.',
    })

    return profile
  } catch (err) {
    await showApiErrorFromError(err, 'Unable to update profile')
    return null
  }
}
