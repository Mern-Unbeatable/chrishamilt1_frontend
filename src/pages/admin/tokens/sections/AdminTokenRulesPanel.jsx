import { useEffect, useMemo, useState } from 'react'
import DataTable, { StatusBadge } from '@/components/data-display/DataTable/DataTable'
import { formatBudgetAmount } from '@/data/adminTokenData'

const RULES_PAGE_SIZE = 5

function buildRuleColumns({ onEdit, onDelete }) {
  return [
    { key: 'label', header: 'Budget range' },
    {
      key: 'minBudget',
      header: 'Min budget',
      render: (value) => formatBudgetAmount(value),
    },
    {
      key: 'maxBudget',
      header: 'Max budget',
      render: (value) => formatBudgetAmount(value),
    },
    {
      key: 'tokenCost',
      header: 'Token cost',
      render: (value) => (
        <span className="font-semibold text-btn-primary">
          {value} {value === 1 ? 'token' : 'tokens'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => onEdit(row)}
            className="text-sm font-medium text-[#64748B] transition-colors hover:text-btn-primary"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(row)}
            className="text-sm font-medium text-[#EF4444] transition-colors hover:text-[#DC2626]"
          >
            Delete
          </button>
        </div>
      ),
    },
  ]
}

export default function AdminTokenRulesPanel({
  rules,
  onEdit,
  onDelete,
}) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(rules.length / RULES_PAGE_SIZE))

  const paginatedRules = useMemo(() => {
    const start = (page - 1) * RULES_PAGE_SIZE
    return rules.slice(start, start + RULES_PAGE_SIZE)
  }, [rules, page])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const columns = useMemo(
    () => buildRuleColumns({ onEdit, onDelete }),
    [onEdit, onDelete],
  )

  const from = rules.length === 0 ? 0 : (page - 1) * RULES_PAGE_SIZE + 1
  const to = Math.min(page * RULES_PAGE_SIZE, rules.length)

  return (
    <DataTable
      columns={columns}
      data={paginatedRules}
      showPagination
      pagination={{
        page,
        pageSize: RULES_PAGE_SIZE,
        total: rules.length,
        from,
        to,
        hasPrevious: page > 1,
        hasNext: page < totalPages,
        onPageChange: setPage,
      }}
      emptyMessage="No token rules configured."
      tableMinWidth="960px"
    />
  )
}
