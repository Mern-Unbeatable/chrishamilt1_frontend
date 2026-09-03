import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import TradeIcon from '@/components/common/TradeIcon'
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader'
import { useTradeCategories } from '@/context/TradeCategoriesProvider'
import { showApiErrorFromError, showConfirmAlert, showSuccessAlert } from '@/helpers/showAppAlert'
import AddCategoryModal from '@/pages/admin/categories/sections/AddCategoryModal'
import {
  createAdminCategory,
  deleteAdminCategory,
  fetchAdminCategories,
  isAdminCategoriesApiEnabled,
} from '@/services/adminCategoriesApi'

export default function AdminCategoriesPage() {
  const useApi = isAdminCategoriesApiEnabled()
  const { categories: demoCategories, addCategory, removeCategory } = useTradeCategories()

  const [categories, setCategories] = useState(useApi ? [] : demoCategories)
  const [loading, setLoading] = useState(useApi)
  const [deletingId, setDeletingId] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    if (!useApi) {
      setCategories(demoCategories)
      return undefined
    }

    let cancelled = false

    async function loadCategories() {
      setLoading(true)

      try {
        const nextCategories = await fetchAdminCategories()
        if (!cancelled) setCategories(nextCategories)
      } catch (err) {
        if (!cancelled) {
          setCategories([])
          await showApiErrorFromError(err, 'Unable to load categories')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadCategories()

    return () => {
      cancelled = true
    }
  }, [useApi, demoCategories])

  const handleSaveCategory = async ({ name, icon }) => {
    if (!useApi) {
      return addCategory({ name, icon })
    }

    try {
      await createAdminCategory({ name, icon })
      const nextCategories = await fetchAdminCategories()
      setCategories(nextCategories)

      await showSuccessAlert({
        title: 'Category added',
        text: `"${name.trim()}" has been created.`,
      })

      return { ok: true }
    } catch (err) {
      await showApiErrorFromError(err, 'Unable to add category')
      return {
        ok: false,
        error: err?.message || 'Unable to add category.',
      }
    }
  }

  const handleDeleteCategory = async (category) => {
    const confirmation = await showConfirmAlert({
      title: 'Delete category?',
      text: `"${category.name}" will be permanently removed.`,
      confirmButtonText: 'Delete category',
      cancelButtonText: 'Keep category',
    })

    if (!confirmation.isConfirmed) return

    if (!useApi) {
      removeCategory(category.id)
      setCategories((current) => current.filter((item) => item.id !== category.id))
      return
    }

    setDeletingId(category.id)

    try {
      await deleteAdminCategory(category.id)
      const nextCategories = await fetchAdminCategories()
      setCategories(nextCategories)

      await showSuccessAlert({
        title: 'Category deleted',
        text: `"${category.name}" has been removed.`,
      })
    } catch (err) {
      await showApiErrorFromError(err, 'Unable to delete category')
    } finally {
      setDeletingId('')
    }
  }

  return (
    <>
      <div className="space-y-4">
        <DashboardPageHeader
          title="Categories"
          description="Organise the service categories tradesmen offer. Create new ones, pick an icon, and manage visibility on the landing page."
        />

        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-[#111827]">Category</h2>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-btn-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC]"
            >
              <Plus className="size-4" strokeWidth={2.25} />
              Add Category
            </button>
          </div>

          <div className="my-4 border-t border-[#E5E7EB]" aria-hidden />

          {loading ? (
            <div className="rounded-xl border border-dashed border-[#E5E7EB] bg-[#F8FAFC] px-6 py-10 text-center">
              <p className="text-sm text-[#64748B]">Loading categories…</p>
            </div>
          ) : categories.length > 0 ? (
            <ul className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <li key={category.id}>
                  <span className="inline-flex items-center gap-2 rounded-lg bg-[#EAF2FE] px-3 py-2 text-sm font-medium text-btn-primary">
                    <TradeIcon name={category.icon} className="size-4" strokeWidth={2} />
                    {category.name}
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(category)}
                      disabled={deletingId === category.id}
                      aria-label={`Delete ${category.name}`}
                      className="inline-flex size-6 items-center justify-center rounded-md text-[#EF4444] transition-colors hover:bg-[#FEE2E2] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 className="size-3.5" strokeWidth={2} />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl border border-dashed border-[#E5E7EB] bg-[#F8FAFC] px-6 py-10 text-center">
              <p className="text-sm font-semibold text-[#111827]">No categories yet</p>
              <p className="mt-2 text-sm text-[#64748B]">
                Add your first category with a name and icon for the landing page.
              </p>
            </div>
          )}
        </section>
      </div>

      <AddCategoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveCategory}
      />
    </>
  )
}
