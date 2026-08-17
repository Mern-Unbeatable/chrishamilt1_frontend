const BOOKING_STATUS_VARIANTS = {
  completed: 'completed',
  accepted: 'open',
  'in progress': 'inProgress',
  'in-progress': 'inProgress',
}

const BOOKING_DETAIL_BASE = {
  title: 'Complete Bathroom Renovation — Full Replumb & Tile',
  location: 'Kensington, London',
  price: '£8,000',
  tradesman: {
    name: 'James Hartley',
    initials: 'JH',
    avatar:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
    rating: 4.4,
    reviewCount: 87,
    jobsCompleted: 203,
    yearsExperience: 5,
    location: 'Manchester, UK',
  },
  description: {
    summary:
      'We are looking for an experienced plumber and tiler to completely renovate our master bathroom in a Victorian townhouse. The project involves a full strip-out of the existing suite, complete replumbing for a new walk-in shower and double vanity unit, and full retiling of all wall and floor surfaces.',
    full: 'We are looking for an experienced plumber and tiler to completely renovate our master bathroom in a Victorian townhouse. The project involves a full strip-out of the existing suite, complete replumbing for a new walk-in shower and double vanity unit, and full retiling of all wall and floor surfaces.\n\nThe bathroom is approximately 3.2m x 2.4m. All waste pipes will need rerouting for the new layout. We have already purchased the tiles, shower screen, and vanity unit — the tradesman will need to supply all plumbing fittings, adhesive, grout, and labour.\n\nWe require someone who can manage the project from start to finish, including coordination with an electrician for the heated towel rail and downlights. Previous bathroom portfolio photos are essential.',
  },
  requirements: [
    'City & Guilds or NVQ Level 3 in Plumbing',
    'Gas Safe registered (for boiler disconnection)',
    'Public liability insurance minimum £2m',
    'Minimum 5 years experience in bathroom renovations',
    'References available and verifiable upon request',
  ],
  preferredStart: '15 August 2026',
  completionBy: '30 September 2026',
  specialNotes:
    'Access available Mon–Fri 8am–6pm. Parking permit can be arranged. House is occupied during works — please consider dust management.',
  photos: [
    {
      src: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=80',
      alt: 'Renovated bathroom with walk-in shower',
    },
    {
      src: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
      alt: 'Bathroom sink detail',
    },
    {
      src: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=400&q=80',
      alt: 'Shower enclosure',
    },
    {
      src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
      alt: 'Bathroom lighting',
    },
  ],
}

export const DEMO_MY_BOOKINGS = [
  {
    id: 'b-1',
    title: 'Kitchen Extension Renovation',
    date: '2025-08-15',
    time: '10:00 AM',
    location: 'Salford, Manchester',
    price: '£8,000',
    status: 'Completed',
    image:
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'b-2',
    title: 'Kitchen Extension Renovation',
    date: '2025-08-15',
    time: '10:00 AM',
    location: 'Salford, Manchester',
    price: '£8,000',
    status: 'Accepted',
    image:
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'b-3',
    title: 'Kitchen Extension Renovation',
    date: '2025-08-15',
    time: '10:00 AM',
    location: 'Salford, Manchester',
    price: '£8,000',
    status: 'In progress',
    image:
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'b-4',
    title: 'Kitchen Extension Renovation',
    date: '2025-08-15',
    time: '10:00 AM',
    location: 'Salford, Manchester',
    price: '£8,000',
    status: 'Completed',
    image:
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'b-5',
    title: 'Kitchen Extension Renovation',
    date: '2025-08-15',
    time: '10:00 AM',
    location: 'Salford, Manchester',
    price: '£8,000',
    status: 'In progress',
    image:
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=400&q=80',
  },
]

function getStatusVariant(status) {
  const key = String(status).trim().toLowerCase()
  return BOOKING_STATUS_VARIANTS[key] ?? 'open'
}

export function getBookingDetails(bookingId) {
  const booking = DEMO_MY_BOOKINGS.find((item) => item.id === bookingId)
  if (!booking) return null

  return {
    id: booking.id,
    ...BOOKING_DETAIL_BASE,
    status: booking.status,
    statusVariant: getStatusVariant(booking.status),
  }
}

export function canCancelBooking(status) {
  const key = String(status).trim().toLowerCase()
  return key === 'accepted' || key === 'in progress' || key === 'in-progress'
}
