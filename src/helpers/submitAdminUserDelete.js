import { deleteAdminUser } from '@/services/adminUsersApi'
import { showApiErrorFromError, showConfirmAlert, showSuccessAlert } from '@/helpers/showAppAlert'

export async function submitAdminUserDelete(
  userId,
  userName = 'User',
  { userType = 'User' } = {},
) {
  const confirmation = await showConfirmAlert({
    title: `Delete ${userType.toLowerCase()}?`,
    text: `"${userName}" will be permanently removed. This action cannot be undone.`,
    confirmButtonText: `Delete ${userType.toLowerCase()}`,
    cancelButtonText: 'Cancel',
  })

  if (!confirmation.isConfirmed) {
    return false
  }

  try {
    await deleteAdminUser(userId)

    await showSuccessAlert({
      title: `${userType} deleted`,
      text: `${userName} has been deleted successfully.`,
    })

    return true
  } catch (err) {
    await showApiErrorFromError(err, `Unable to delete ${userType.toLowerCase()}`)
    return false
  }
}
