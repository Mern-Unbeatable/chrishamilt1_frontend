import { AUTH_CONFIG } from '@/auth/authConfig'
import ProfileSettings from '@/components/forms/ProfileSettings/ProfileSettings'
import { DEMO_TRADESMAN_PROFILE } from '@/data/demoData'
import { submitPasswordChange } from '@/helpers/submitPasswordChange'

export default function TradesmanProfilePage() {
  const useApi = !AUTH_CONFIG.useDemoAuth

  return (
    <ProfileSettings
      role="tradesman"
      defaultValue={DEMO_TRADESMAN_PROFILE}
      passwordMode={useApi ? 'full' : undefined}
      onUpdateProfile={() => {}}
      onSaveWarehouses={() => {}}
      onChangePassword={(passwords) =>
        submitPasswordChange(passwords, { requireCurrent: useApi })
      }
      onUploadAvatar={() => {}}
    />
  )
}
