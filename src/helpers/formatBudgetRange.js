function formatAmount(value) {
  return `£${Number(value).toLocaleString('en-GB')}`
}

export function formatBudgetRange(min, max) {
  const hasMin = min !== null && min !== undefined && min !== ''
  const hasMax = max !== null && max !== undefined && max !== ''

  if (hasMin && hasMax) {
    return `${formatAmount(min)}–${formatAmount(max)}`
  }

  if (hasMin) return `${formatAmount(min)}+`
  if (hasMax) return `Up to ${formatAmount(max)}`

  return 'Budget on request'
}
