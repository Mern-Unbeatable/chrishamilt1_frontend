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

    const demoUser =
      role === 'user'
        ? {
            firstName: payload.firstName?.trim() ?? '',
            lastName: payload.lastName?.trim() ?? '',
            email: payload.email?.trim() ?? '',
            phoneNumber: payload.phone?.trim() ?? '',
            region: payload.region ?? '',
            city: payload.city ?? '',
            zipCode: payload.zipCode?.trim() ?? '',
            address: payload.address?.trim() ?? '',
          }
        : {
            fullName: payload.name?.trim() ?? '',
            email: payload.email?.trim() ?? '',
            phoneNumber: payload.phone?.trim() ?? '',
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
