export function pascalToKebab(name = '') {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

export function formatIconLabel(name = '') {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    .trim()
}

export function filterTradeIcons(iconNames, query = '') {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return iconNames

  return iconNames.filter((name) => {
    const label = formatIconLabel(name).toLowerCase()
    const kebab = pascalToKebab(name)
    return label.includes(normalized) || kebab.includes(normalized.replace(/\s+/g, '-'))
  })
}
