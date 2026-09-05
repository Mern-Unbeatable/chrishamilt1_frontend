import { updateAdminUserStatus } from '@/services/adminUsersApi'
import { showApiErrorFromError, showSuccessAlert } from '@/helpers/showAppAlert'

export async function submitAdminUserStatus(userId, status, { successText } = {}) {
  try {
    const displayStatus = await updateAdminUserStatus(userId, status)

    await showSuccessAlert({
      title: 'Status updated',
      text: successText || `Account is now ${displayStatus.toLowerCase()}.`,
    })

    return displayStatus
  } catch (err) {
    await showApiErrorFromError(err, 'Unable to update status')
    return null
  }
}
