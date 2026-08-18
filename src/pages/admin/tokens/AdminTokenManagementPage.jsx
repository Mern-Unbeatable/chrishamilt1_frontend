import { useCallback, useEffect, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import DataTable, { StatusBadge } from '@/components/data-display/DataTable/DataTable'
import TokenPricingCard from '@/components/data-display/TokenPricingCard/TokenPricingCard'
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader'
import {
  createPackageId,
  createRuleId,
  DEMO_ADMIN_TOKEN_PACKAGES,
  DEMO_ADMIN_TOKEN_PURCHASES,
  DEMO_ADMIN_TOKEN_RULES,
} from '@/data/adminTokenData'
import AddTokenPackageModal from '@/pages/admin/tokens/sections/AddTokenPackageModal'
import AddTokenRuleModal from '@/pages/admin/tokens/sections/AddTokenRuleModal'
import AdminTokenRulesPanel from '@/pages/admin/tokens/sections/AdminTokenRulesPanel'

const PAGE_SIZE = 5

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
  const [activeTab, setActiveTab] = useState('packages')
  const [packages, setPackages] = useState(DEMO_ADMIN_TOKEN_PACKAGES)
  const [rules, setRules] = useState(DEMO_ADMIN_TOKEN_RULES)
  const [page, setPage] = useState(1)
  const [packageModalOpen, setPackageModalOpen] = useState(false)
  const [ruleModalOpen, setRuleModalOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState(null)
  const [editingRule, setEditingRule] = useState(null)

  const totalPages = Math.max(1, Math.ceil(DEMO_ADMIN_TOKEN_PURCHASES.length / PAGE_SIZE))

  const paginatedPurchases = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return DEMO_ADMIN_TOKEN_PURCHASES.slice(start, start + PAGE_SIZE)
  }, [page])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

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

  const handleDeletePackage = useCallback((pkg) => {
    setPackages((current) => current.filter((item) => item.id !== pkg.id))
  }, [])

  const handleDeleteRule = useCallback((rule) => {
    setRules((current) => current.filter((item) => item.id !== rule.id))
  }, [])

  const handleSavePackage = useCallback(
    (values) => {
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
    [editingPackage, packages],
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
    DEMO_ADMIN_TOKEN_PURCHASES.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const to = Math.min(page * PAGE_SIZE, DEMO_ADMIN_TOKEN_PURCHASES.length)

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

            <div className="space-y-4 pt-2">
              <h2 className="text-lg font-semibold text-[#111827]">Purchase History</h2>

              <DataTable
                columns={PURCHASE_COLUMNS}
                data={paginatedPurchases}
                showPagination
                pagination={{
                  page,
                  pageSize: PAGE_SIZE,
                  total: DEMO_ADMIN_TOKEN_PURCHASES.length,
                  from,
                  to,
                  hasPrevious: page > 1,
                  hasNext: page < totalPages,
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
