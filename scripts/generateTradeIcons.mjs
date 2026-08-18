import { writeFileSync } from 'fs'
import { iconNames } from 'lucide-react/dynamic.mjs'

function kebabToPascal(kebab) {
  return kebab.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('')
}

const keywords = [
  'tool', 'build', 'home', 'house', 'wrench', 'hammer', 'paint', 'brush', 'clean', 'spark',
  'leaf', 'garden', 'plant', 'tree', 'flower', 'floor', 'tile', 'grid', 'flame', 'heat',
  'fire', 'plumb', 'pipe', 'water', 'drop', 'droplet', 'bath', 'shower', 'toilet', 'sink',
  'faucet', 'electr', 'bolt', 'zap', 'plug', 'socket', 'wire', 'cable', 'circuit', 'battery',
  'power', 'light', 'lamp', 'bulb', 'sun', 'roof', 'door', 'window', 'wall', 'brick',
  'cement', 'concrete', 'stone', 'wood', 'log', 'saw', 'drill', 'screw', 'nut', 'nail',
  'axe', 'shovel', 'rake', 'ladder', 'scaffold', 'hard', 'hat', 'helmet', 'safety', 'shield',
  'truck', 'van', 'car', 'transport', 'deliver', 'box', 'pack', 'package', 'crate', 'warehouse',
  'store', 'shop', 'kitchen', 'cook', 'oven', 'fridge', 'washer', 'dryer', 'fan', 'wind',
  'air', 'vent', 'hvac', 'thermo', 'gauge', 'meter', 'ruler', 'measure', 'level', 'compass',
  'map', 'pin', 'location', 'fence', 'gate', 'garage', 'pool', 'spa', 'landscape', 'lawn',
  'mower', 'vacuum', 'mop', 'bucket', 'broom', 'trash', 'recycle', 'crane', 'fork', 'palette',
  'roller', 'tape', 'glue', 'seal', 'insul', 'glass', 'mirror', 'curtain', 'carpet', 'rug',
  'stair', 'rail', 'deck', 'patio', 'lock', 'key', 'alarm', 'camera', 'cctv', 'sensor',
  'smart', 'wifi', 'network', 'antenna', 'satellite', 'solar', 'panel', 'energy', 'fuel', 'gas',
  'oil', 'tank', 'valve', 'pump', 'filter', 'drain', 'sewer', 'sprinkler', 'irrigation', 'hose',
  'compressor', 'generator', 'engine', 'motor', 'gear', 'cog', 'chain', 'hook', 'clamp', 'pliers',
  'screwdriver', 'trowel', 'mallet', 'chisel', 'sand', 'grind', 'weld', 'torch', 'solder', 'iron',
  'steam', 'pressure', 'duct', 'chimney', 'fireplace', 'radiator', 'boiler', 'furnace', 'cool', 'freeze',
  'ice', 'cloud', 'rain', 'umbrella', 'tent', 'canopy', 'awning', 'sign', 'flag', 'anchor',
  'bridge', 'road', 'rail', 'tunnel', 'factory', 'industry', 'machine', 'robot', 'lift', 'elevator',
  'wheel', 'tire', 'construction', 'renov', 'repair', 'fix', 'maint', 'service', 'craft', 'work',
  'project', 'anvil', 'pick', 'mining', 'container', 'shipping', 'cargo', 'hoist', 'blueprint', 'layout',
  'design', 'architect', 'hedge', 'trim', 'prune', 'compost', 'soil', 'seed', 'crop', 'farm',
  'barn', 'shed', 'attic', 'basement', 'skylight', 'shutter', 'blind', 'handle', 'knob', 'hinge',
  'latch', 'mortar', 'grout', 'adhesive', 'epoxy', 'resin', 'varnish', 'stain', 'lacquer', 'primer',
  'coating', 'waterproof', 'damp', 'survey', 'inspect', 'test', 'cert', 'compliance', 'lpg', 'underfloor',
  'radiant', 'ventilation', 'extract', 'humid', 'dehumid', 'aircon', 'condition', 'split', 'ducted', 'copper',
  'pvc', 'steel', 'metal', 'alumin', 'bronze', 'cast', 'forge', 'fabricat', 'sheet', 'beam',
  'column', 'truss', 'joist', 'stud', 'frame', 'timber', 'joinery', 'cabinet', 'counter', 'worktop',
  'granite', 'marble', 'quartz', 'slab', 'ceramic', 'porcelain', 'mosaic', 'vinyl', 'laminate', 'parquet',
  'hardwood', 'softwood', 'mdf', 'plywood', 'plaster', 'drywall', 'gypsum', 'render', 'stucco', 'cladding',
  'siding', 'soffit', 'fascia', 'gutter', 'downpipe', 'flashing', 'membrane', 'felt', 'shingle', 'slate',
  'epdm', 'rubber', 'loft', 'insulation', 'cavity', 'glaz', 'sash', 'casement', 'bifold', 'slider',
  'french', 'port', 'automation', 'intercom', 'access', 'security', 'smoke', 'carbon', 'detector', 'extinguish',
  'emergency', 'led', 'halogen', 'spot', 'track', 'pendant', 'chandelier', 'dimmer', 'switch', 'fuse',
  'consumer', 'board', 'rcd', 'mcb', 'earth', 'bond', 'pat', 'eicr', 'part', 'rewire',
  'outdoor', 'decking', 'paving', 'block', 'setts', 'gravel', 'turf', 'artificial', 'pond', 'feature',
  'fountain', 'drainage', 'soakaway', 'manhole', 'inspection', 'chamber', 'septic', 'treatment', 'sump', 'flood',
  'barrier', 'sandbag', 'restor', 'damage', 'leak', 'burst', 'blockage', 'unblock', 'jet', 'rod',
  'reline', 'patch', 'line', 'excavat', 'dig', 'trench', 'foundation', 'piling', 'ground', 'underpin',
  'temporary', 'support', 'demol', 'strip', 'clearance', 'rubbish', 'waste', 'skip', 'hire', 'asbestos',
  'removal', 'soft', 'fit', 'commercial', 'domestic', 'industrial', 'retail', 'office', 'school', 'hospital',
  'hotel', 'restaurant', 'pub', 'unit', 'mezzanine', 'partition', 'suspended', 'ceiling', 'raised', 'data',
  'cabinet', 'server', 'rack', 'tray', 'containment', 'trunking', 'conduit', 'trunk', 'busbar', 'transform',
  'ups', 'backup', 'standby', 'pv', 'storage', 'ev', 'charger', 'biomass', 'pellet', 'burner',
  'stove', 'towel', 'mat', 'zone', 'control', 'thermostat', 'programmer', 'timer', 'motorised', 'cylinder',
  'immersion', 'unvented', 'vented', 'combi', 'system', 'regular', 'flush', 'magnetic', 'scale', 'inhibitor',
  'limescale', 'softener', 'reverse', 'osmosis', 'uv', 'borehole', 'well', 'rainwater', 'harvest', 'grey',
]

const scored = iconNames
  .map((kebab) => {
    const pascal = kebabToPascal(kebab)
    const lower = kebab.toLowerCase()
    let score = 0

    for (const keyword of keywords) {
      if (lower.includes(keyword)) score += keyword.length
    }

    return { pascal, score }
  })
  .filter((item) => item.score > 0)
  .sort((a, b) => b.score - a.score || a.pascal.localeCompare(b.pascal))

const seen = new Set()
const picked = []

for (const item of scored) {
  if (seen.has(item.pascal)) continue
  seen.add(item.pascal)
  picked.push(item.pascal)
  if (picked.length >= 500) break
}

if (picked.length < 500) {
  for (const kebab of iconNames) {
    const pascal = kebabToPascal(kebab)
    if (seen.has(pascal)) continue
    seen.add(pascal)
    picked.push(pascal)
    if (picked.length >= 500) break
  }
}

const content = `// Auto-generated trade-related Lucide icon names (${picked.length})\nexport const TRADE_ICON_NAMES = ${JSON.stringify(picked, null, 2)}\n`

writeFileSync('src/data/tradeIconNames.js', content)
console.log(`Generated ${picked.length} trade icon names`)
