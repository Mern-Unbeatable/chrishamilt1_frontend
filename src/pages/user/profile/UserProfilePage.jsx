import ProfileSettings from '@/components/forms/ProfileSettings/ProfileSettings'
import { DEMO_USER_PROFILE } from '@/data/demoData'

export default function UserProfilePage() {
  return (
    <section className="bg-[#F8FAFC] py-8 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <ProfileSettings
            role="user"
            title="My Profile"
            subtitle="Manage your account details and password."
            defaultValue={DEMO_USER_PROFILE}
            onUpdateProfile={() => {}}
            onChangePassword={() => {}}
            onUploadAvatar={() => {}}
          />
        </div>
      </div>
    </section>
  )
}
