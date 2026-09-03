import { AUTH_CONFIG } from '@/auth/authConfig'
import {
  changeUserPassword,
  validatePasswordChange,
} from '@/auth/authService'
import { showApiErrorFromError, showErrorAlert, showSuccessAlert } from '@/helpers/showAppAlert'

export async function submitPasswordChange(
  { currentPassword, newPassword, confirmPassword },
  { requireCurrent = true } = {},
) {
  const validationError = validatePasswordChange({
    currentPassword,
    newPassword,
    confirmPassword,
    requireCurrent,
  })

  if (validationError) {
    await showErrorAlert({
      title: 'Invalid password',
      text: validationError,
    })
    return false
  }

  if (AUTH_CONFIG.useDemoAuth) {
    await showSuccessAlert({
      title: 'Password updated',
      text: 'Password change is simulated in demo mode.',
    })
    return true
  }

  try {
    await changeUserPassword({
      currentPassword,
      newPassword,
      confirmPassword,
    })

    await showSuccessAlert({
      title: 'Password updated',
      text: 'Your password has been changed successfully.',
    })

    return true
  } catch (err) {
    await showApiErrorFromError(err, 'Unable to change password')
    return false
  }
}
