import ProfileSettings from '@/components/forms/ProfileSettings/ProfileSettings'
import { DEMO_ADMIN_PROFILE } from '@/data/demoData'

export default function AdminSettingsPage() {
  return (
    <ProfileSettings
      role="admin"
      defaultValue={DEMO_ADMIN_PROFILE}
      onUpdateProfile={() => {}}
      onChangePassword={() => {}}
    />
  )
}
