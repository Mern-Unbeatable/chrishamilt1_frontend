const DATE_INPUT_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

export function parseDateInputValue(value) {
  if (!value || typeof value !== 'string') return null

  const match = value.trim().match(DATE_INPUT_PATTERN)
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }

  return date
}

export function formatDateInputValue(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return ''

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function getTodayInputValue() {
  return formatDateInputValue(startOfDay(new Date()))
}

function startOfDay(date) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

export function getCompletionMinDate(preferredStart) {
  const today = getTodayInputValue()
  const start = parseDateInputValue(preferredStart)

  if (!start) return today

  const startValue = formatDateInputValue(start)
  return startValue >= today ? startValue : today
}

export function validateJobDates({ preferredStart, completionBy } = {}) {
  const startDate = parseDateInputValue(preferredStart)
  const completionDate = parseDateInputValue(completionBy)
  const today = startOfDay(new Date())

  if (!preferredStart?.trim()) {
    return {
      valid: false,
      field: 'preferredStart',
      message: 'Please choose when you want the work to start.',
    }
  }

  if (!startDate) {
    return {
      valid: false,
      field: 'preferredStart',
      message: 'Preferred start date is not valid.',
    }
  }

  if (!completionBy?.trim()) {
    return {
      valid: false,
      field: 'completionBy',
      message: 'Please choose when you need the work completed by.',
    }
  }

  if (!completionDate) {
    return {
      valid: false,
      field: 'completionBy',
      message: 'Completion date is not valid.',
    }
  }

  if (startDate < today) {
    return {
      valid: false,
      field: 'preferredStart',
      message: 'Preferred start must be today or a future date — past dates are not allowed.',
    }
  }

  if (completionDate < today) {
    return {
      valid: false,
      field: 'completionBy',
      message: 'Completion date must be today or a future date — past dates are not allowed.',
    }
  }

  if (completionDate < startDate) {
    return {
      valid: false,
      field: 'completionBy',
      message: 'Completion date must be on or after the preferred start date.',
    }
  }

  return {
    valid: true,
    preferredStart: formatDateInputValue(startDate),
    completionBy: formatDateInputValue(completionDate),
  }
}
