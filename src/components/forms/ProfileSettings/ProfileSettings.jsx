import { useId, useRef, useState } from 'react'
import { Camera, ChevronDown, Eye, EyeOff, User } from 'lucide-react'
import { cn } from '@/helpers/cn'
import { DEMO_PROFILE_CITY_OPTIONS, DEMO_PROFILE_REGION_OPTIONS } from '@/data/demoData'

const ROLE_CONFIG = {
  user: {
    layout: 'account',
    showPageHeader: true,
    showAvatarUpload: false,
    showAccountPhone: true,
    showAddressFields: true,
    showWarehouses: false,
    passwordMode: 'full',
    passwordInSeparateCard: true,
    profileActionsAlign: 'start',
    passwordActionsAlign: 'start',
  },
  tradesman: {
    layout: 'dashboard',
    showPageHeader: true,
    showAvatarUpload: false,
    showAccountPhone: true,
    showAddressFields: false,
    showWarehouses: true,
    passwordMode: 'simple',
    passwordInSeparateCard: false,
    profileActionsAlign: 'end',
    passwordActionsAlign: 'end',
  },
  admin: {
    layout: 'dashboard',
    showPageHeader: true,
    showAvatarUpload: false,
    showAccountPhone: false,
    showAddressFields: false,
    showWarehouses: false,
    passwordMode: 'full',
    passwordInSeparateCard: false,
    profileActionsAlign: 'end',
    passwordActionsAlign: 'end',
  },
}

function resolveConfig(role, overrides = {}) {
  const base = ROLE_CONFIG[role] || ROLE_CONFIG.tradesman
  const cleaned = Object.fromEntries(
    Object.entries(overrides).filter(([, value]) => value !== undefined),
  )
  return { ...base, ...cleaned }
}

function emptyPassword() {
  return { currentPassword: '', newPassword: '', confirmPassword: '' }
}

function nextWarehouseId(list) {
  return `wh-${Date.now()}-${list.length + 1}`
}

function alignClass(align) {
  return align === 'start' ? 'justify-start' : 'justify-end'
}

function Field({ label, children, className = '' }) {
  return (
    <label className={cn('flex w-full flex-col gap-1.5', className)}>
      {label ? (
        <span className="text-sm font-medium text-[var(--primary-text)]">{label}</span>
      ) : null}
      {children}
    </label>
  )
}

const controlBase =
  'w-full rounded-md border border-[#E5E7EB] bg-white text-sm text-[var(--primary-text)] outline-none transition-colors placeholder:text-[var(--secondary-text)] focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/20'

function TextInput({ value, onChange, placeholder, type = 'text', className = '', ...rest }) {
  return (
    <input
      type={type}
      value={value ?? ''}
      onChange={(event) => onChange?.(event.target.value)}
      placeholder={placeholder}
      className={cn(controlBase, 'h-11 px-3', className)}
      {...rest}
    />
  )
}

function SelectInput({ value, onChange, options = [], className = '' }) {
  return (
    <div className={cn('relative w-full', className)}>
      <select
        value={value ?? ''}
        onChange={(event) => onChange?.(event.target.value)}
        className={cn(controlBase, 'h-11 appearance-none px-3 pr-9')}
      >
        {options.map((option) => (
          <option key={option.value || 'empty'} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[var(--secondary-text)]"
        aria-hidden
      />
    </div>
  )
}

function PasswordInput({ value, onChange, placeholder, className = '', ...rest }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative w-full">
      <input
        type={visible ? 'text' : 'password'}
        value={value ?? ''}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className={cn(controlBase, 'h-11 px-3 pr-11', className)}
        autoComplete="off"
        {...rest}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--secondary-text)] hover:text-[var(--primary-text)]"
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )
}

function PrimaryButton({ children, className = '', size = 'md', ...rest }) {
  const sizeClass =
    size === 'lg'
      ? 'h-12 min-w-[11rem] rounded-lg px-8 text-base'
      : 'h-10 rounded-md px-5 text-sm'

  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center bg-btn-primary font-semibold text-white transition-colors hover:bg-[#0150CC] disabled:cursor-not-allowed disabled:opacity-50',
        sizeClass,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

function Card({ children, className = '' }) {
  return (
    <section
      className={cn(
        'overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm',
        className,
      )}
    >
      {children}
    </section>
  )
}

function CardHeader({ children }) {
  return (
    <div className="border-b border-[#E5E7EB] bg-[#F9FAFB] px-5 py-4 sm:px-6">
      <h3 className="text-sm font-bold tracking-wide text-[var(--primary-text)] uppercase">
        {children}
      </h3>
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <h3 className="text-base font-semibold text-[var(--primary-text)]">{children}</h3>
  )
}

function AvatarUpload({ form, fileRef, fileInputId, onPick }) {
  return (
    <div className="relative inline-flex shrink-0 self-start">
      <div className="flex size-20 items-center justify-center overflow-hidden rounded-full bg-[#E5E7EB] text-[var(--secondary-text)] sm:size-24">
        {form.avatarUrl ? (
          <img src={form.avatarUrl} alt="" className="size-full object-cover" />
        ) : (
          <User className="size-10" strokeWidth={1.5} />
        )}
      </div>
      <input
        ref={fileRef}
        id={fileInputId}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={onPick}
      />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full border-2 border-white bg-btn-primary text-white shadow-sm hover:bg-[#0150CC]"
        aria-label="Upload profile photo"
      >
        <Camera className="size-4" />
      </button>
    </div>
  )
}

function AvatarHeader({ form, showUpload, fileRef, fileInputId, onPick }) {
  if (showUpload) {
    return (
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <AvatarUpload
          form={form}
          fileRef={fileRef}
          fileInputId={fileInputId}
          onPick={onPick}
        />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-semibold text-[var(--primary-text)] sm:text-lg">
            {form.displayName || form.name || '—'}
          </h2>
          <p className="truncate text-sm text-[var(--secondary-text)]">
            {form.displayEmail || form.email || '—'}
          </p>
        </div>
      </div>
    )
  }

  return <AvatarDisplay form={form} />
}

function AvatarDisplay({ form }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E5E7EB] text-[var(--secondary-text)] sm:size-[72px]">
        {form.avatarUrl ? (
          <img src={form.avatarUrl} alt="" className="size-full object-cover" />
        ) : (
          <User className="size-8" strokeWidth={1.5} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-base font-semibold text-[var(--primary-text)] sm:text-lg">
          {form.displayName || form.name || '—'}
        </h2>
        <p className="truncate text-sm text-[var(--secondary-text)]">
          {form.displayEmail || form.email || '—'}
        </p>
      </div>
    </div>
  )
}

/**
 * Shared profile / account settings for user, tradesman, and admin dashboards.
 * role drives layout and visible sections. Callbacks come from the parent page.
 */
export default function ProfileSettings({
  role = 'tradesman',
  value,
  defaultValue,
  onChange,
  onUpdateProfile,
  onSaveWarehouses,
  onChangePassword,
  onUploadAvatar,
  title = 'My Profile',
  subtitle = 'Manage your account and store preferences.',
  regionOptions = DEMO_PROFILE_REGION_OPTIONS,
  cityOptions = DEMO_PROFILE_CITY_OPTIONS,
  className = '',
  ...configOverrides
}) {
  const cfg = resolveConfig(role, configOverrides)
  const isControlled = value !== undefined
  const [internal, setInternal] = useState(() => defaultValue || {})
  const form = isControlled ? value : internal
  const fileInputId = useId()
  const fileRef = useRef(null)
  const [changingPassword, setChangingPassword] = useState(false)
  const [updatingProfile, setUpdatingProfile] = useState(false)

  const patch = (partial) => {
    const next = { ...form, ...partial }
    if (!isControlled) setInternal(next)
    onChange?.(next)
  }

  const setField = (key) => (nextValue) => patch({ [key]: nextValue })

  const updateWarehouse = (id, address) => {
    patch({
      warehouses: (form.warehouses || []).map((item) =>
        item.id === id ? { ...item, address } : item,
      ),
    })
  }

  const addWarehouse = () => {
    const list = form.warehouses || []
    patch({
      warehouses: [
        ...list,
        {
          id: nextWarehouseId(list),
          address: '',
        },
      ],
    })
  }

  const handleAvatarPick = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    onUploadAvatar?.(file)
    patch({ avatarUrl: URL.createObjectURL(file) })
    event.target.value = ''
  }

  const handleUpdateProfile = async () => {
    setUpdatingProfile(true)

    try {
      const payload =
        cfg.layout === 'account'
          ? {
              firstName: form.firstName,
              lastName: form.lastName,
              email: form.email,
              phone: form.phone,
              region: form.region,
              city: form.city,
              zipCode: form.zipCode,
              address: form.address,
            }
          : {
              name: form.name,
              email: form.email,
              phone: form.phone,
            }

      await onUpdateProfile?.(payload)
    } finally {
      setUpdatingProfile(false)
    }
  }

  const handleSaveWarehouses = () => {
    onSaveWarehouses?.(form.warehouses || [])
  }

  const handleChangePassword = async () => {
    setChangingPassword(true)

    try {
      const success = await onChangePassword?.({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      })

      if (success !== false) {
        patch(emptyPassword())
      }
    } finally {
      setChangingPassword(false)
    }
  }

  const warehouses = form.warehouses || []
  const isFullPassword = cfg.passwordMode === 'full'
  const passwordGridClass = isFullPassword
    ? 'grid-cols-1 lg:grid-cols-3'
    : 'grid-cols-1 sm:grid-cols-2'

  const passwordFields = (
    <div className={cn('grid gap-4', passwordGridClass)}>
      {isFullPassword ? (
        <Field label="Current password">
          <PasswordInput
            value={form.currentPassword}
            onChange={setField('currentPassword')}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </Field>
      ) : null}
      <Field label="New password">
        <PasswordInput
          value={form.newPassword}
          onChange={setField('newPassword')}
          placeholder={isFullPassword ? '8+ characters' : '••••••••'}
          autoComplete="new-password"
        />
      </Field>
      <Field label="Confirm new password">
        <PasswordInput
          value={form.confirmPassword}
          onChange={setField('confirmPassword')}
          placeholder={isFullPassword ? '8+ characters' : '••••••••'}
          autoComplete="new-password"
        />
      </Field>
    </div>
  )

  const accountFieldsDashboard = (
    <>
      <SectionTitle>Account information</SectionTitle>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Name">
          <TextInput
            value={form.name}
            onChange={setField('name')}
            placeholder="Your name"
          />
        </Field>
        <Field label="Email">
          <TextInput
            type="email"
            value={form.email}
            onChange={setField('email')}
            placeholder="you@example.com"
          />
        </Field>
        {cfg.showAccountPhone ? (
          <Field label="Phone number" className="sm:col-span-2">
            <TextInput
              value={form.phone}
              onChange={setField('phone')}
              placeholder="+44 7700 900000"
            />
          </Field>
        ) : null}
      </div>
      <div className={cn('mt-5 flex', alignClass(cfg.profileActionsAlign))}>
        <PrimaryButton onClick={handleUpdateProfile} disabled={updatingProfile}>
          {updatingProfile ? 'Saving…' : 'Update profile'}
        </PrimaryButton>
      </div>
    </>
  )

  const warehouseSection = cfg.showWarehouses ? (
    <div className="mt-8">
      <SectionTitle>Ware house location</SectionTitle>
      <div className="mt-4 space-y-4">
        {warehouses.map((item, index) => (
          <Field key={item.id} label={`Warehouse ${index + 1}`}>
            <TextInput
              value={item.address}
              onChange={(address) => updateWarehouse(item.id, address)}
              placeholder="Street address"
            />
          </Field>
        ))}
      </div>
      <button
        type="button"
        onClick={addWarehouse}
        className="mt-3 text-sm font-medium text-btn-primary hover:underline"
      >
        + Add new warehouse
      </button>
      <div className="mt-5 flex justify-end">
        <PrimaryButton onClick={handleSaveWarehouses}>Save</PrimaryButton>
      </div>
    </div>
  ) : null

  const passwordSectionInline = (
    <div className="mt-8">
      <SectionTitle>Change password</SectionTitle>
      <div className="mt-4">{passwordFields}</div>
      <div className={cn('mt-5 flex', alignClass(cfg.passwordActionsAlign))}>
        <PrimaryButton size="lg" onClick={handleChangePassword} disabled={changingPassword}>
          {changingPassword ? 'Updating…' : 'Change password'}
        </PrimaryButton>
      </div>
    </div>
  )

  const accountCardUser = (
    <Card>
      <CardHeader>Account setting</CardHeader>
      <div className="p-5 sm:p-6">
        <div className={cn('flex flex-col gap-6', cfg.showAvatarUpload && 'lg:flex-row lg:items-start lg:gap-8')}>
          {cfg.showAvatarUpload ? (
            <AvatarUpload
              form={form}
              fileRef={fileRef}
              fileInputId={fileInputId}
              onPick={handleAvatarPick}
            />
          ) : null}

          <div className="min-w-0 flex-1">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="First name">
                <TextInput
                  value={form.firstName}
                  onChange={setField('firstName')}
                  placeholder="First name"
                />
              </Field>
              <Field label="Last name">
                <TextInput
                  value={form.lastName}
                  onChange={setField('lastName')}
                  placeholder="Display name"
                />
              </Field>
              <Field label="Email">
                <TextInput
                  type="email"
                  value={form.email}
                  onChange={setField('email')}
                  placeholder="you@example.com"
                />
              </Field>
              <Field label="Phone number">
                <TextInput
                  value={form.phone}
                  onChange={setField('phone')}
                  placeholder="+44 7700 900000"
                />
              </Field>
              <Field label="County / region">
                <SelectInput
                  value={form.region}
                  onChange={setField('region')}
                  options={regionOptions}
                />
              </Field>
              <Field label="City">
                <SelectInput
                  value={form.city}
                  onChange={setField('city')}
                  options={cityOptions}
                />
              </Field>
              <Field label="Postcode">
                <TextInput
                  value={form.zipCode}
                  onChange={setField('zipCode')}
                  placeholder="Postcode"
                />
              </Field>
              <Field label="Address" className="sm:col-span-2">
                <TextInput
                  value={form.address}
                  onChange={setField('address')}
                  placeholder="Road No. 13/x, House no. 1320/C, Flat No. 5D"
                />
              </Field>
            </div>

            <div className={cn('mt-6 flex', alignClass(cfg.profileActionsAlign))}>
              <PrimaryButton size="lg" onClick={handleUpdateProfile} disabled={updatingProfile}>
                {updatingProfile ? 'Saving…' : 'Save changes'}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )

  const passwordCardUser = (
    <Card>
      <CardHeader>Change password</CardHeader>
      <div className="space-y-4 p-5 sm:p-6">
        {passwordFields}
        <div className={cn('flex pt-2', alignClass(cfg.passwordActionsAlign))}>
          <PrimaryButton size="lg" onClick={handleChangePassword} disabled={changingPassword}>
            {changingPassword ? 'Updating…' : 'Change password'}
          </PrimaryButton>
        </div>
      </div>
    </Card>
  )

  return (
    <div className={cn('w-full', className)}>
      {cfg.showPageHeader ? (
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--primary-text)] sm:text-3xl">
            {title}
          </h1>
          <p className="mt-1.5 text-sm lg:text-base text-[var(--secondary-text)]">{subtitle}</p>
        </header>
      ) : null}

      {cfg.layout === 'account' ? (
        <div className="space-y-6">
          {accountCardUser}
          {cfg.passwordInSeparateCard ? passwordCardUser : null}
        </div>
      ) : (
        <Card className="p-5 sm:p-8">
          <AvatarHeader
            form={form}
            showUpload={cfg.showAvatarUpload}
            fileRef={fileRef}
            fileInputId={fileInputId}
            onPick={handleAvatarPick}
          />
          <div className="mt-8">{accountFieldsDashboard}</div>
          {warehouseSection}
          {passwordSectionInline}
        </Card>
      )}
    </div>
  )
}
