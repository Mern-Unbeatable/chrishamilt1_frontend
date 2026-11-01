import { AUTH_CONFIG } from '@/auth/authConfig'
import {
  mapApiUserToProfile,
  patchSessionUser,
  uploadUserProfileImage,
} from '@/auth/authService'
import { showApiErrorFromError, showErrorAlert, showSuccessAlert } from '@/helpers/showAppAlert'

export async function submitAvatarUpload(file, { role = 'admin' } = {}) {
  if (!file) return null

  if (!file.type || !file.type.startsWith('image/')) {
    await showErrorAlert({
      title: 'Invalid file',
      text: 'Please select a valid image file (PNG, JPG, WEBP, etc.).',
    })
    return null
  }

  const MAX_SIZE = 10 * 1024 * 1024
  if (file.size > MAX_SIZE) {
    await showErrorAlert({
      title: 'File too large',
      text: 'Image size should not exceed 10MB.',
    })
    return null
  }

  if (AUTH_CONFIG.useDemoAuth) {
    const previewUrl = URL.createObjectURL(file)
    patchSessionUser({ avatarUrl: previewUrl, profileImage: previewUrl })
    await showSuccessAlert({
      title: 'Profile photo updated',
      text: 'Profile photo updated (demo mode).',
    })
    return { avatarUrl: previewUrl, profileImage: previewUrl }
  }

  try {
    const user = await uploadUserProfileImage(file)
    const profile = mapApiUserToProfile(user, role)

    const finalAvatarUrl =
      profile?.avatarUrl ||
      user?.profileImage ||
      user?.avatarUrl ||
      user?.avatar ||
      URL.createObjectURL(file)

    const updatedProfile = {
      ...(profile || {}),
      avatarUrl: finalAvatarUrl,
    }

    patchSessionUser({
      avatarUrl: finalAvatarUrl,
      profileImage: finalAvatarUrl,
    })

    await showSuccessAlert({
      title: 'Profile photo updated',
      text: 'Your profile photo has been updated successfully.',
    })

    return updatedProfile
  } catch (err) {
    await showApiErrorFromError(err, 'Unable to upload profile photo')
    return null
  }
}
