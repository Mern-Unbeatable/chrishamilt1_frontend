import { AUTH_CONFIG } from '@/auth/authConfig'
import {
  buildPackagePayload,
  createAdminPackage,
  deleteAdminPackage,
  fetchAdminPackages,
  updateAdminPackage,
} from '@/services/adminPackagesApi'
import { showApiErrorFromError, showConfirmAlert, showSuccessAlert } from '@/helpers/showAppAlert'

export async function submitAdminPackageSave(values, { packageId } = {}) {
  const payload = buildPackagePayload(values)

  try {
    if (packageId) {
      await updateAdminPackage(packageId, payload)
    } else {
      await createAdminPackage(payload)
    }

    const result = await fetchAdminPackages()

    await showSuccessAlert({
      title: packageId ? 'Package updated' : 'Package created',
      text: packageId
        ? 'Token package details have been saved.'
        : 'The new token package is now available.',
    })

    return { ok: true, packages: result.packages }
  } catch (err) {
    await showApiErrorFromError(err, packageId ? 'Unable to update package' : 'Unable to create package')
    return { ok: false, error: err?.message || 'Unable to save package.' }
  }
}

export async function submitAdminPackageDelete(packageId, packageName) {
  const confirmation = await showConfirmAlert({
    title: 'Delete package?',
    text: `"${packageName}" will be permanently removed.`,
    confirmButtonText: 'Delete package',
    cancelButtonText: 'Keep package',
  })

  if (!confirmation.isConfirmed) {
    return { ok: false, cancelled: true }
  }

  if (AUTH_CONFIG.useDemoAuth) {
    return { ok: true, packages: null }
  }

  try {
    await deleteAdminPackage(packageId)
    const result = await fetchAdminPackages()

    await showSuccessAlert({
      title: 'Package deleted',
      text: 'The token package has been removed.',
    })

    return { ok: true, packages: result.packages }
  } catch (err) {
    await showApiErrorFromError(err, 'Unable to delete package')
    return { ok: false, error: err?.message || 'Unable to delete package.' }
  }
}
