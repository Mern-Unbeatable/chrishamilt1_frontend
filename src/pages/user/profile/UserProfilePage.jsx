import ProfileSettings from '@/components/forms/ProfileSettings/ProfileSettings'
import { DEMO_USER_PROFILE } from '@/data/demoData'

export default function UserProfilePage() {
  return (
    <ProfileSettings
      role="user"
      defaultValue={DEMO_USER_PROFILE}
      onUpdateProfile={() => {}}
      onChangePassword={() => {}}
      onUploadAvatar={() => {}}
    />
  )
}
