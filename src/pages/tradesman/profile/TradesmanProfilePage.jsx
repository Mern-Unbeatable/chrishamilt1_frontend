import ProfileSettings from '@/components/forms/ProfileSettings/ProfileSettings'
import { DEMO_TRADESMAN_PROFILE } from '@/data/demoData'

export default function TradesmanProfilePage() {
  return (
    <ProfileSettings
      role="tradesman"
      defaultValue={DEMO_TRADESMAN_PROFILE}
      onUpdateProfile={() => {}}
      onSaveWarehouses={() => {}}
      onChangePassword={() => {}}
      onUploadAvatar={() => {}}
    />
  )
}
