import { AUTH_CONFIG } from '@/auth/authConfig'
import {
  mapApiUserToAdminProfile,
  patchSessionUser,
  updateUserProfile,
  validateProfileUpdate,
} from '@/auth/authService'
import { showApiErrorFromError, showErrorAlert, showSuccessAlert } from '@/helpers/showAppAlert'

export async function submitProfileUpdate({ name, email }) {
  const validationError = validateProfileUpdate({
    fullName: name,
    email,
  })

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

    return mapApiUserToAdminProfile({
      fullName: name.trim(),
      email: email.trim(),
    })
  }

  try {
    const user = await updateUserProfile({
      fullName: name,
      email,
    })

    const profile = mapApiUserToAdminProfile(user)

    patchSessionUser({
      name: profile.name,
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
