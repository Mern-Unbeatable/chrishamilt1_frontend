import { useCallback, useEffect, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import DataTable, { StatusBadge } from '@/components/data-display/DataTable/DataTable'
import TokenPricingCard from '@/components/data-display/TokenPricingCard/TokenPricingCard'
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader'
import {
  createPackageId,
  createRuleId,
  DEMO_ADMIN_TOKEN_PURCHASES,
  DEMO_ADMIN_TOKEN_RULES,
} from '@/data/adminTokenData'
import AddTokenPackageModal from '@/pages/admin/tokens/sections/AddTokenPackageModal'
import AddTokenRuleModal from '@/pages/admin/tokens/sections/AddTokenRuleModal'
import AdminTokenRulesPanel from '@/pages/admin/tokens/sections/AdminTokenRulesPanel'
import {
  fetchAdminPackages,
  fetchAdminPurchases,
  getDemoAdminPackages,
  isAdminPackagesApiEnabled,
} from '@/services/adminPackagesApi'
import {
  submitAdminPackageDelete,
  submitAdminPackageSave,
} from '@/helpers/submitAdminPackage'

const PURCHASE_PAGE_SIZE = 10

const TABS = [
  { id: 'packages', label: 'Token Packages' },
  { id: 'rules', label: 'Token Rules' },
]

const PURCHASE_COLUMNS = [
  {
    key: 'tradesmanName',
    header: 'Tradesman',
    render: (_, row) => (
      <div>
        <p className="font-semibold text-[#111827]">{row.tradesmanName}</p>
        <p className="mt-0.5 text-sm text-[#64748B]">{row.company}</p>
      </div>
    ),
  },
  { key: 'packageName', header: 'Package' },
  {
    key: 'tokens',
    header: 'Tokens',
    render: (value) => (
      <span className="font-semibold text-btn-primary">{value.toLocaleString()}</span>
    ),
  },
  {
    key: 'amount',
    header: 'Amount',
    render: (value) => <span className="font-semibold text-[#111827]">{value}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    render: (value) => <StatusBadge status={value} />,
  },
  { key: 'date', header: 'Date' },
]

export default function AdminTokenManagementPage() {
  const useApi = isAdminPackagesApiEnabled()
  const [activeTab, setActiveTab] = useState('packages')
  const [packages, setPackages] = useState(() => getDemoAdminPackages())
  const [packagesLoading, setPackagesLoading] = useState(useApi)
  const [packagesError, setPackagesError] = useState('')
  const [rules, setRules] = useState(DEMO_ADMIN_TOKEN_RULES)
  const [page, setPage] = useState(1)
  const [purchases, setPurchases] = useState([])
  const [purchasesLoading, setPurchasesLoading] = useState(useApi)
  const [purchasesError, setPurchasesError] = useState('')
  const [purchaseTotal, setPurchaseTotal] = useState(0)
  const [purchaseTotalPages, setPurchaseTotalPages] = useState(1)

  const [packageModalOpen, setPackageModalOpen] = useState(false)
  const [ruleModalOpen, setRuleModalOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState(null)
  const [editingRule, setEditingRule] = useState(null)

  useEffect(() => {
    if (!useApi) {
      const start = (page - 1) * PURCHASE_PAGE_SIZE
      setPurchases(DEMO_ADMIN_TOKEN_PURCHASES.slice(start, start + PURCHASE_PAGE_SIZE))
      setPurchaseTotal(DEMO_ADMIN_TOKEN_PURCHASES.length)
      setPurchaseTotalPages(
        Math.max(1, Math.ceil(DEMO_ADMIN_TOKEN_PURCHASES.length / PURCHASE_PAGE_SIZE)),
      )
      setPurchasesLoading(false)
      setPurchasesError('')
      return undefined
    }

    let cancelled = false

    async function loadPurchases() {
      setPurchasesLoading(true)
      setPurchasesError('')

      try {
        const result = await fetchAdminPurchases({
          page,
          limit: PURCHASE_PAGE_SIZE,
        })

        if (!cancelled) {
          setPurchases(result.purchases)
          setPurchaseTotal(result.total)
          setPurchaseTotalPages(result.totalPages)
        }
      } catch (err) {
        if (!cancelled) {
          setPurchases([])
          setPurchaseTotal(0)
          setPurchaseTotalPages(1)
          setPurchasesError(err?.message || 'Unable to load purchase history.')
        }
      } finally {
        if (!cancelled) setPurchasesLoading(false)
      }
    }

    loadPurchases()

    return () => {
      cancelled = true
    }
  }, [useApi, page])

  useEffect(() => {
    if (page > purchaseTotalPages) setPage(purchaseTotalPages)
  }, [page, purchaseTotalPages])

  useEffect(() => {
    if (!useApi) {
      setPackages(getDemoAdminPackages())
      setPackagesLoading(false)
      setPackagesError('')
      return undefined
    }

    let cancelled = false

    async function loadPackages() {
      setPackagesLoading(true)
      setPackagesError('')

      try {
        const result = await fetchAdminPackages()
        if (!cancelled) setPackages(result.packages)
      } catch (err) {
        if (!cancelled) {
          setPackages([])
          setPackagesError(err?.message || 'Unable to load token packages.')
        }
      } finally {
        if (!cancelled) setPackagesLoading(false)
      }
    }

    loadPackages()

    return () => {
      cancelled = true
    }
  }, [useApi])

  const openCreatePackageModal = useCallback(() => {
    setEditingPackage(null)
    setPackageModalOpen(true)
  }, [])

  const openEditPackageModal = useCallback((pkg) => {
    setEditingPackage(pkg)
    setPackageModalOpen(true)
  }, [])

  const openCreateRuleModal = useCallback(() => {
    setEditingRule(null)
    setRuleModalOpen(true)
  }, [])

  const openEditRuleModal = useCallback((rule) => {
    setEditingRule(rule)
    setRuleModalOpen(true)
  }, [])

  const handleDeletePackage = useCallback(
    async (pkg) => {
      if (!useApi) {
        setPackages((current) => current.filter((item) => item.id !== pkg.id))
        return
      }

      const result = await submitAdminPackageDelete(pkg.id, pkg.planName)
      if (result.ok && result.packages) {
        setPackages(result.packages)
      }
    },
    [useApi],
  )

  const handleDeleteRule = useCallback((rule) => {
    setRules((current) => current.filter((item) => item.id !== rule.id))
  }, [])

  const handleSavePackage = useCallback(
    async (values) => {
      if (useApi) {
        const result = await submitAdminPackageSave(values, {
          packageId: editingPackage?.id,
        })

        if (result.ok && result.packages) {
          setPackages(result.packages)
        }

        return result
      }

      const normalizePackages = (current, savedId) =>
        current.map((item) => {
          if (item.id === savedId) {
            return {
              ...item,
              ...values,
              featured: Boolean(values.featured),
              badgeLabel: values.featured ? values.badgeLabel || 'Most popular' : undefined,
            }
          }

          if (values.featured) {
            return { ...item, featured: false, badgeLabel: undefined }
          }

          return item
        })

      if (editingPackage) {
        setPackages((current) => normalizePackages(current, editingPackage.id))
        return { ok: true }
      }

      const duplicate = packages.some(
        (item) => item.planName.toLowerCase() === values.planName.toLowerCase(),
      )

      if (duplicate) {
        return { ok: false, error: 'A package with this name already exists.' }
      }

      const nextPackage = {
        id: createPackageId(
          values.planName,
          packages.map((item) => item.id),
        ),
        ...values,
        featured: Boolean(values.featured),
        badgeLabel: values.featured ? values.badgeLabel || 'Most popular' : undefined,
      }

      setPackages((current) => {
        const withNew = [...current, nextPackage]
        return values.featured
          ? withNew.map((item) =>
              item.id === nextPackage.id
                ? item
                : { ...item, featured: false, badgeLabel: undefined },
            )
          : withNew
      })
      return { ok: true }
    },
    [editingPackage, packages, useApi],
  )

  const handleSaveRule = useCallback(
    (values) => {
      if (editingRule) {
        setRules((current) =>
          current.map((item) =>
            item.id === editingRule.id ? { ...item, ...values } : item,
          ),
        )
        return { ok: true }
      }

      const duplicate = rules.some(
        (item) => item.label.toLowerCase() === values.label.toLowerCase(),
      )

      if (duplicate) {
        return { ok: false, error: 'A rule with this label already exists.' }
      }

      const nextRule = {
        id: createRuleId(
          values.label,
          rules.map((item) => item.id),
        ),
        ...values,
      }

      setRules((current) => [...current, nextRule])
      return { ok: true }
    },
    [editingRule, rules],
  )

  const from =
    purchaseTotal === 0 ? 0 : (page - 1) * PURCHASE_PAGE_SIZE + 1
  const to = Math.min(page * PURCHASE_PAGE_SIZE, purchaseTotal)

  return (
    <>
      <div className="space-y-4">
        <DashboardPageHeader
          title="Token Management"
          description="Configure token packages, set deduction rules per job budget, and analyze purchase history."
          actions={
            activeTab === 'packages' ? (
              <button
                type="button"
                onClick={openCreatePackageModal}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-btn-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC]"
              >
                <Plus className="size-4" strokeWidth={2.25} />
                Add Packages
              </button>
            ) : activeTab === 'rules' ? (
              <button
                type="button"
                onClick={openCreateRuleModal}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-btn-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC]"
              >
                <Plus className="size-4" strokeWidth={2.25} />
                Add Rule
              </button>
            ) : null
          }
        />

        <div className="inline-flex w-fit max-w-full items-center rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-1">
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white text-[#111827] shadow-sm'
                    : 'text-[#64748B] hover:text-[#111827]'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {activeTab === 'packages' ? (
          <>
            {packagesError ? (
              <p className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
                {packagesError}
              </p>
            ) : null}

            {packagesLoading ? (
              <div className="rounded-2xl border border-[#E5E7EB] bg-white px-6 py-16 text-center">
                <p className="text-sm text-[#64748B]">Loading token packages…</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2 xl:grid-cols-3">
                {packages.map((plan) => (
                  <TokenPricingCard
                    key={plan.id}
                    {...plan}
                    onEdit={() => openEditPackageModal(plan)}
                    onDelete={() => handleDeletePackage(plan)}
                  />
                ))}
              </div>
            )}

            <div className="space-y-4 pt-2">
              <h2 className="text-lg font-semibold text-[#111827]">Purchase History</h2>

              {purchasesError ? (
                <p className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
                  {purchasesError}
                </p>
              ) : null}

              <DataTable
                columns={PURCHASE_COLUMNS}
                data={purchases}
                loading={purchasesLoading}
                showPagination
                pagination={{
                  page,
                  pageSize: PURCHASE_PAGE_SIZE,
                  total: purchaseTotal,
                  from,
                  to,
                  hasPrevious: page > 1,
                  hasNext: page < purchaseTotalPages,
                  onPageChange: setPage,
                }}
                emptyMessage="No purchases found."
                tableMinWidth="960px"
              />
            </div>
          </>
        ) : (
          <AdminTokenRulesPanel
            rules={rules}
            onEdit={openEditRuleModal}
            onDelete={handleDeleteRule}
          />
        )}
      </div>

      <AddTokenPackageModal
        open={packageModalOpen}
        onClose={() => {
          setPackageModalOpen(false)
          setEditingPackage(null)
        }}
        onSave={handleSavePackage}
        initialPackage={editingPackage}
      />

      <AddTokenRuleModal
        open={ruleModalOpen}
        onClose={() => {
          setRuleModalOpen(false)
          setEditingRule(null)
        }}
        onSave={handleSaveRule}
        initialRule={editingRule}
      />
    </>
  )
}
