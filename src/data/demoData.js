/**
 * Single source for all DEMO_* mock payloads.
 * Import: import { DEMO_JOB_DETAILS } from '@/data/demoData'
 */

const DEMO_JOB_CARD_IMAGE =
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=400&q=80'

export const DEMO_JOB_DETAILS = {
  id: '1',
  status: 'Open',
  statusVariant: 'open',
  category: 'Plumbing',
  urgency: 'High Urgency',
  urgencyVariant: 'high',
  postedAt: '2 hours ago',
  distance: '3.2 miles away',
  title: 'Complete Bathroom Renovation — Full Replumb & Tile',
  location: 'Kensington, London',
  price: '£2,400 – £3,200',
  customer: {
    name: 'Sarah M.',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&q=80',
    phone: '+44 7911 234 567',
    email: 'sarah.morrison@email.co.uk',
  },
  tradesman: {
    name: 'James Hartley',
    initials: 'JH',
    avatar: null,
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

export const DEMO_SIMILAR_JOBS = [
  {
    id: '2',
    title: 'Bathroom Suite Installation',
    location: 'Chelsea',
    distance: '1.8 mi',
    priceRange: '£1,800–£2,400',
    postedAt: '1h ago',
    urgency: 'Medium Urgency',
    urgencyVariant: 'medium',
    leadCost: '£14',
    image:
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '3',
    title: 'Full Kitchen Replumb & Fitting',
    location: 'Fulham',
    distance: '2.4 mi',
    priceRange: '£3,200–£4,500',
    postedAt: '3h ago',
    urgency: 'High Urgency',
    urgencyVariant: 'high',
    leadCost: '£18',
    image:
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '4',
    title: 'En-Suite Shower Room Refit',
    location: 'Notting Hill',
    distance: '1.2 mi',
    priceRange: '£2,100–£2,800',
    postedAt: '30m ago',
    urgency: 'Low Urgency',
    urgencyVariant: 'low',
    leadCost: '£12',
    image:
      'https://images.unsplash.com/photo-1620626011761-996317b59421?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '5',
    title: 'Boiler Replacement & Pipework',
    location: 'Hammersmith',
    distance: '3.1 mi',
    priceRange: '£2,500–£3,200',
    postedAt: '5h ago',
    urgency: 'High Urgency',
    urgencyVariant: 'high',
    leadCost: '£16',
    image:
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '6',
    title: 'Wet Room Conversion',
    location: 'Paddington',
    distance: '2.8 mi',
    priceRange: '£4,000–£5,500',
    postedAt: '6h ago',
    urgency: 'Medium Urgency',
    urgencyVariant: 'medium',
    leadCost: '£20',
    image:
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=600&q=80',
  },
]

export const DEMO_RECENT_JOBS = [
  {
    id: '1',
    title: 'Kitchen Extension Renovation',
    location: 'Salford, Manchester',
    priceRange: '£8,000–£12,000',
    postedAt: '2h ago',
    category: 'Kitchen Fitting',
    viewLeadTo: '/jobs/1',
    image: DEMO_JOB_CARD_IMAGE,
  },
  {
    id: '2',
    title: 'Kitchen Extension Renovation',
    location: 'Salford, Manchester',
    priceRange: '£8,000–£12,000',
    postedAt: '4h ago',
    category: 'Kitchen Fitting',
    viewLeadTo: '/jobs/1',
    image: DEMO_JOB_CARD_IMAGE,
  },
  {
    id: '3',
    title: 'Kitchen Extension Renovation',
    location: 'Salford, Manchester',
    priceRange: '£8,000–£12,000',
    postedAt: '6h ago',
    category: 'Kitchen Fitting',
    viewLeadTo: '/jobs/1',
    image: DEMO_JOB_CARD_IMAGE,
  },
  {
    id: '4',
    title: 'Boiler Replacement & Gas Safety Check',
    location: 'Leeds, West Yorkshire',
    priceRange: '£2,200–£3,500',
    postedAt: '8h ago',
    category: 'Heating & Gas',
    viewLeadTo: '/jobs/1',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '5',
    title: 'Full House Rewire (3 Bed Semi)',
    location: 'Bristol, Avon',
    priceRange: '£4,500–£6,000',
    postedAt: '12h ago',
    category: 'Electrical',
    viewLeadTo: '/jobs/1',
    image:
      'https://images.unsplash.com/photo-1620626011761-996317b59421?auto=format&fit=crop&w=400&q=80',
  },
]

export const DEMO_BROWSE_JOB_CATEGORIES = [
  'All Trade Categories',
  'Heating & Gas',
  'Plumbing',
  'Electrical',
  'Building & Construction',
  'Kitchen & Bathroom',
  'Roofing',
  'Kitchen Fitting',
]

export const DEMO_BROWSE_BUDGETS = [
  'Any Budget',
  'Under £1,000',
  '£1,000–£5,000',
  '£5,000–£10,000',
  '£10,000+',
]

export const DEMO_BROWSE_JOBS = [
  {
    id: '1',
    title: 'Kitchen Extension Renovation',
    location: 'Salford, Manchester',
    priceRange: '£8,000–£12,000',
    postedAt: '2h ago',
    category: 'Kitchen Fitting',
  },
  {
    id: '2',
    title: 'Kitchen Extension Renovation',
    location: 'Salford, Manchester',
    priceRange: '£8,000–£12,000',
    postedAt: '4h ago',
    category: 'Kitchen Fitting',
  },
  {
    id: '3',
    title: 'Kitchen Extension Renovation',
    location: 'Salford, Manchester',
    priceRange: '£8,000–£12,000',
    postedAt: '6h ago',
    category: 'Kitchen Fitting',
  },
  {
    id: '4',
    title: 'Boiler Replacement & Gas Safety Check',
    location: 'Leeds, West Yorkshire',
    priceRange: '£2,200–£3,500',
    postedAt: '8h ago',
    category: 'Heating & Gas',
  },
  {
    id: '5',
    title: 'Full House Rewire (3 Bed Semi)',
    location: 'Bristol, Avon',
    priceRange: '£4,500–£6,000',
    postedAt: '12h ago',
    category: 'Electrical',
  },
  {
    id: '6',
    title: 'Emergency Burst Pipe Repair',
    location: 'Camden, London',
    priceRange: '£150–£400',
    postedAt: '1d ago',
    category: 'Plumbing',
  },
  {
    id: '7',
    title: 'Loft Conversion & Insulation',
    location: 'Edinburgh, Scotland',
    priceRange: '£15,000–£22,000',
    postedAt: '1d ago',
    category: 'Building & Construction',
  },
  {
    id: '8',
    title: 'Flat Roof Replacement',
    location: 'Cardiff, Wales',
    priceRange: '£3,800–£5,200',
    postedAt: '2d ago',
    category: 'Roofing',
  },
  {
    id: '9',
    title: 'Bathroom Suite Installation',
    location: 'Nottingham, East Midlands',
    priceRange: '£2,500–£4,000',
    postedAt: '2d ago',
    category: 'Kitchen & Bathroom',
  },
  {
    id: '10',
    title: 'Garden Decking & Fencing',
    location: 'Brighton, East Sussex',
    priceRange: '£900–£1,800',
    postedAt: '3d ago',
    category: 'Building & Construction',
  },
  {
    id: '11',
    title: 'Consumer Unit Upgrade',
    location: 'Sheffield, South Yorkshire',
    priceRange: '£650–£950',
    postedAt: '3d ago',
    category: 'Electrical',
  },
]

export const DEMO_MESSENGER_CHATS = [
  {
    id: 'marcus-bell',
    name: 'Marcus Bell',
    subject: 'Garden office electrics',
    lastMessage: 'Thanks, that works for me. Can you confirm the visit slot?',
    time: '09:42',
    unreadCount: 2,
    online: true,
    initials: 'MB',
    avatar: null,
  },
  {
    id: 'sarah-hughes',
    name: 'Sarah Hughes',
    subject: 'Bathroom replumb quote',
    lastMessage: 'Could you share availability for next week?',
    time: 'YESTERDAY',
    unreadCount: 0,
    online: true,
    initials: 'SH',
    avatar: null,
  },
  {
    id: 'james-wood',
    name: 'James Wood',
    subject: 'Kitchen extension wiring',
    lastMessage: 'Photos uploaded — please review when you can.',
    time: 'MON',
    unreadCount: 1,
    online: false,
    initials: 'JW',
    avatar: null,
  },
  {
    id: 'priya-sharma',
    name: 'Priya Sharma',
    subject: 'Consumer unit upgrade',
    lastMessage: 'Happy to proceed once you confirm the start date.',
    time: 'SUN',
    unreadCount: 0,
    online: false,
    initials: 'PS',
    avatar: null,
  },
]

export const DEMO_MESSENGER_MESSAGES = {
  'marcus-bell': [
    { id: 'date-1', type: 'date', label: 'Today' },
    {
      id: 'msg-1',
      sender: 'them',
      text: 'Hi, I posted a job for garden office electrics. Are you available for a site visit this week?',
      time: '09:12',
    },
    {
      id: 'msg-2',
      sender: 'me',
      text: 'Morning Marcus — yes, I can visit Thursday or Friday morning. Which works best for you?',
      time: '09:18',
      read: true,
    },
    {
      id: 'msg-3',
      sender: 'them',
      text: 'Friday morning would be ideal. The office is at the bottom of the garden with its own consumer unit.',
      time: '09:24',
    },
    {
      id: 'msg-4',
      sender: 'me',
      text: 'Perfect. I will bring the NICEIC paperwork and check the existing feed from the house.',
      time: '09:31',
      read: true,
    },
    {
      id: 'msg-5',
      sender: 'them',
      text: 'Thanks, that works for me. Can you confirm the visit slot?',
      time: '09:42',
    },
  ],
  'sarah-hughes': [
    { id: 'date-1', type: 'date', label: 'Yesterday' },
    {
      id: 'msg-1',
      sender: 'them',
      text: 'Could you share availability for next week?',
      time: '16:20',
    },
  ],
  'james-wood': [
    { id: 'date-1', type: 'date', label: 'Monday' },
    {
      id: 'msg-1',
      sender: 'them',
      text: 'Photos uploaded — please review when you can.',
      time: '11:05',
    },
  ],
  'priya-sharma': [
    { id: 'date-1', type: 'date', label: 'Sunday' },
    {
      id: 'msg-1',
      sender: 'them',
      text: 'Happy to proceed once you confirm the start date.',
      time: '14:48',
    },
  ],
}

export const DEMO_QUOTES = [
  {
    id: '1',
    quoteId: 'Q-90124',
    status: 'Pending',
    statusVariant: 'pending',
    postedAt: '2 hours ago',
    amount: '£5,480',
    title: 'Full rewire of 3-bed Victorian terrace',
    customerName: 'Sophie Harper',
    duration: '15 working days',
    tokensUsed: 6,
    description:
      "Thanks for the detail in your listing. I've completed 14 full rewires on Victorian terraces in Islington over the past two years, including full make-good plastering.",
  },
  {
    id: '2',
    quoteId: 'Q-90125',
    status: 'Pending',
    statusVariant: 'pending',
    postedAt: '5 hours ago',
    amount: '£5,480',
    title: 'Full rewire of 3-bed Victorian terrace',
    customerName: 'Sophie Harper',
    duration: '15 working days',
    tokensUsed: 6,
    description:
      "Thanks for the detail in your listing. I've completed 14 full rewires on Victorian terraces in Islington over the past two years, including full make-good plastering.",
  },
]

export const DEMO_CUSTOMER_QUOTES = [
  {
    id: '1',
    tradesman: {
      name: 'Daniel Hughes',
      initials: 'DH',
      avatar: null,
      rating: 4.4,
      reviewCount: 87,
      jobsCompleted: 203,
      yearsExperience: 5,
    },
    amount: '£2,100',
    duration: '3 days',
    startDate: '9 Aug 2026',
    distance: '7.6 miles',
    responseTime: '4 hours',
    submittedAt: 'Submitted 1 day ago',
    statusVariant: 'submitted',
    proposalPreview:
      'Competitive quote including all labour. Happy to discuss materials separately and work around your schedule for minimal disruption to the household.',
  },
  {
    id: '2',
    tradesman: {
      name: 'James Hartley',
      initials: 'JH',
      avatar: null,
      rating: 4.8,
      reviewCount: 112,
      jobsCompleted: 248,
      yearsExperience: 8,
    },
    amount: '£1,850',
    duration: '2 days',
    startDate: '12 Aug 2026',
    distance: '4.2 miles',
    responseTime: '2 hours',
    submittedAt: 'Submitted 3 hours ago',
    statusVariant: 'submitted',
    proposalPreview:
      'I can start next week and include all prep work. Materials can be sourced at trade prices if you prefer.',
  },
]

export const DEMO_TRADESMAN_JOBS = [
  {
    id: 'job-002',
    jobId: 'Job-002',
    customerName: 'Aliza',
    phoneNumber: '+421 435 43556',
    price: '$123',
    status: 'Completed',
  },
  {
    id: 'job-003',
    jobId: 'Job-003',
    customerName: 'Sophie Harper',
    phoneNumber: '+44 7700 900123',
    price: '£2,450',
    status: 'Accepted',
  },
  {
    id: 'job-004',
    jobId: 'Job-004',
    customerName: 'James Wright',
    phoneNumber: '+44 161 555 0198',
    price: '£890',
    status: 'In progress',
  },
  {
    id: 'job-005',
    jobId: 'Job-005',
    customerName: 'Emma Collins',
    phoneNumber: '+44 20 7946 0958',
    price: '£1,200',
    status: 'Completed',
  },
  {
    id: 'job-006',
    jobId: 'Job-006',
    customerName: 'Michael Brown',
    phoneNumber: '+44 7700 900456',
    price: '£675',
    status: 'Accepted',
  },
]

export const DEMO_ADMIN_CUSTOMERS = [
  {
    id: '1',
    userName: 'Annette Black',
    email: 'nathan.roberts@example.com',
    phoneNumber: '(629) 555-0129',
    location: '3891 Ranchview Dr.\nRichardson, California 62639',
    jobsPosted: 100,
    status: 'Active',
    joinedDate: 'Dec 31, 2025',
  },
  {
    id: '2',
    userName: 'Devon Lane',
    email: 'tim.jennings@example.com',
    phoneNumber: '(603) 555-0123',
    location: '8502 Preston Rd.\nInglewood, Maine 98380',
    jobsPosted: 20,
    status: 'Suspend',
    joinedDate: 'Jan 2, 2026',
  },
  {
    id: '3',
    userName: 'Kathryn Murphy',
    email: 'debra.holt@example.com',
    phoneNumber: '(704) 555-0127',
    location: '6391 Elgin St.\nCelina, Delaware 10299',
    jobsPosted: 10,
    status: 'Active',
    joinedDate: 'Jan 5, 2026',
  },
  {
    id: '4',
    userName: 'Ronald Richards',
    email: 'ronald.richards@example.com',
    phoneNumber: '(201) 555-0124',
    location: '4140 Parker Rd.\nAllentown, New Mexico 31134',
    jobsPosted: 45,
    status: 'Active',
    joinedDate: 'Jan 8, 2026',
  },
  {
    id: '5',
    userName: 'Esther Howard',
    email: 'esther.howard@example.com',
    phoneNumber: '(907) 555-0101',
    location: '2715 Ash Dr.\nSan Jose, South Dakota 83475',
    jobsPosted: 8,
    status: 'Suspend',
    joinedDate: 'Jan 10, 2026',
  },
  {
    id: '6',
    userName: 'Robert Fox',
    email: 'robert.fox@example.com',
    phoneNumber: '(808) 555-0111',
    location: '4517 Washington Ave.\nManchester, Kentucky 39495',
    jobsPosted: 32,
    status: 'Active',
    joinedDate: 'Jan 12, 2026',
  },
  {
    id: '7',
    userName: 'Jenny Wilson',
    email: 'jenny.wilson@example.com',
    phoneNumber: '(316) 555-0116',
    location: '2464 Royal Ln.\nMesa, New Jersey 45463',
    jobsPosted: 15,
    status: 'Active',
    joinedDate: 'Jan 14, 2026',
  },
]

export const DEMO_ADMIN_TRADESMEN = [
  {
    id: '1',
    tradesmanName: 'Annette Black',
    email: 'nathan.roberts@example.com',
    phoneNumber: '(629) 555-0129',
    location: '6391 Elgin St.\nCelina, Delaware 10299',
    status: 'Active',
  },
  {
    id: '2',
    tradesmanName: 'Leslie Alexander',
    email: 'tim.jennings@example.com',
    phoneNumber: '(603) 555-0123',
    location: '8502 Preston Rd.\nInglewood, Maine 98380',
    status: 'Active',
  },
  {
    id: '3',
    tradesmanName: 'Devon Lane',
    email: 'debra.holt@example.com',
    phoneNumber: '(704) 555-0127',
    location: '3891 Ranchview Dr.\nRichardson, California 62639',
    status: 'Active',
  },
  {
    id: '4',
    tradesmanName: 'Eleanor Pena',
    email: 'ronald.richards@example.com',
    phoneNumber: '(201) 555-0124',
    location: '4140 Parker Rd.\nAllentown, New Mexico 31134',
    status: 'Suspend',
  },
  {
    id: '5',
    tradesmanName: 'Ronald Richards',
    email: 'esther.howard@example.com',
    phoneNumber: '(907) 555-0101',
    location: '2715 Ash Dr.\nSan Jose, South Dakota 83475',
    status: 'Active',
  },
  {
    id: '6',
    tradesmanName: 'Esther Howard',
    email: 'robert.fox@example.com',
    phoneNumber: '(808) 555-0111',
    location: '4517 Washington Ave.\nManchester, Kentucky 39495',
    status: 'Active',
  },
  {
    id: '7',
    tradesmanName: 'Robert Fox',
    email: 'jenny.wilson@example.com',
    phoneNumber: '(316) 555-0116',
    location: '2464 Royal Ln.\nMesa, New Jersey 45463',
    status: 'Active',
  },
]

export const DEMO_TABLE_MENU_ACTIONS = [
  { id: 'view', label: 'View', onClick: () => {} },
  { id: 'edit', label: 'Edit', onClick: () => {} },
  { id: 'delete', label: 'Delete', variant: 'danger', onClick: () => {} },
]

export const DEMO_WALLET_STATS = [
  {
    id: 'available',
    label: 'Available tokens',
    value: '148',
    subtext: '≈ 29 quotes',
    icon: 'tokens',
    iconTone: 'teal',
  },
  {
    id: 'used',
    label: 'Tokens used (Jul)',
    value: '42',
    subtext: '',
    icon: 'used',
    iconTone: 'orange',
  },
  {
    id: 'purchased',
    label: 'Tokens purchased (Jul)',
    value: '150',
    subtext: '',
    icon: 'purchased',
    iconTone: 'green',
  },
]

export const DEMO_PROFILE_REGION_OPTIONS = [
  { value: '', label: 'Select region' },
  { value: 'alabama', label: 'Alabama' },
  { value: 'london', label: 'London' },
  { value: 'manchester', label: 'Manchester' },
]

export const DEMO_PROFILE_CITY_OPTIONS = [
  { value: '', label: 'Select city' },
  { value: 'montgomery', label: 'Montgomery' },
  { value: 'kensington', label: 'Kensington' },
  { value: 'salford', label: 'Salford' },
]

export const DEMO_USER_PROFILE = {
  firstName: 'Kevin',
  lastName: '',
  email: 'customer@gmail.com',
  phone: '+1-202-555-0118',
  region: 'alabama',
  city: 'montgomery',
  zipCode: '1000',
  address: '',
  avatarUrl: null,
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

export const DEMO_TRADESMAN_PROFILE = {
  displayName: 'Chowdhury Group Of Industries',
  displayEmail: 'chowdhury@gmail.com',
  name: 'John Industries',
  email: 'admin@johnindustries.com',
  phone: '+1 (555) 000-1122',
  warehouses: [
    {
      id: 'wh-1',
      address: '4140 Parker Rd. Allentown, New Mexico 31134',
    },
  ],
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  avatarUrl: null,
}

export const DEMO_ADMIN_PROFILE = {
  displayName: 'Chowdhury Group Of Industries',
  displayEmail: 'chowdhury@gmail.com',
  name: 'John Industries',
  email: 'admin@johnindustries.com',
  phone: '',
  warehouses: [],
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  avatarUrl: null,
}

export const DEMO_TOKEN_PRICING = [
  {
    id: 'starter',
    planName: 'Starter',
    price: '£30',
    tokens: 100,
    rateLabel: '£0.30 per token',
    description: 'Perfect for tradesmen getting started.',
    featured: false,
  },
  {
    id: 'professional',
    planName: 'Professional',
    price: '£120',
    tokens: 500,
    rateLabel: '£0.24 per token',
    description: 'Best choice for growing businesses purchasing leads regularly.',
    featured: true,
    badgeLabel: 'Most popular',
  },
  {
    id: 'business',
    planName: 'Business',
    price: '£200',
    tokens: 1000,
    rateLabel: '£0.20 per token',
    description: 'Maximum value for active tradesmen purchasing multiple leads every week.',
    featured: false,
  },
]

export const DEMO_ABOUT_TRADES = [
  { id: 'plumbing', label: 'Plumbers & Heating' },
  { id: 'electrical', label: 'Electricians' },
  { id: 'roofing', label: 'Roofers & Joiners' },
  { id: 'building', label: 'Builders & Painters' },
]

export const DEMO_ABOUT_STORY = {
  intro:
    'Finding reliable tradesmen shouldn\'t be difficult, and skilled professionals deserve access to genuine job opportunities without unnecessary barriers.',
  body:
    'Our platform was created to simplify the process by bringing customers and verified tradesmen together in one secure, transparent, and easy-to-use marketplace. Whether you\'re looking for a plumber, electrician, roofer, or builder, we make it easier to connect with trusted professionals across the UK.',
  highlights: [
    {
      title: 'Customer First Approach',
      description:
        'Post any job for free and receive verified quotes with transparent ratings.',
    },
    {
      title: 'Fair Tradesmen Growth',
      description:
        'Pay only for the leads you choose to accept. No expensive locking subscriptions.',
    },
  ],
}

export const DEMO_ABOUT_PURPOSE = [
  {
    id: 'mission',
    eyebrow: 'Core Purpose',
    title: 'Our Mission',
    description:
      'Our mission is to make hiring trusted tradesmen simple, transparent, and stress-free while providing professionals with high-quality job opportunities that help grow their businesses.',
    points: [
      'Stress-Free Homeowner Experience',
      'Sustainable Business Growth for Tradesmen',
    ],
  },
  {
    id: 'vision',
    eyebrow: 'Future Goal',
    title: 'Our Vision',
    description:
      "To become the UK's most trusted online marketplace for home improvement and trade services by delivering a secure, reliable, and user-friendly experience for both customers and tradesmen.",
    points: [
      "UK's Premier Trade Marketplace Standard",
      'Advanced Technology & Uncompromised Safety',
    ],
  },
]

export const DEMO_ABOUT_PLATFORM_FEATURES = [
  {
    id: 'verified',
    title: 'Verified Tradesmen',
    description:
      'Every tradesman is reviewed through our verification process before joining the marketplace.',
    to: '/how-it-works',
  },
  {
    id: 'leads',
    title: 'Quality Job Leads',
    description: 'Tradesmen receive access to genuine customer job requests.',
    to: '/jobs',
  },
  {
    id: 'messaging',
    title: 'Secure Communication',
    description:
      'Customers and tradesmen can communicate directly through our built-in messaging system.',
    to: '/how-it-works',
  },
  {
    id: 'tokens',
    title: 'Token-Based Marketplace',
    description:
      'Purchase only the job leads you need without paying a monthly subscription.',
    to: '/pricing',
  },
  {
    id: 'payments',
    title: 'Secure Payments',
    description: 'Safe online payments for purchasing tokens and accessing services.',
    to: '/pricing',
  },
  {
    id: 'reviews',
    title: 'Transparent Reviews',
    description:
      'Read honest customer reviews and ratings before hiring a tradesman.',
    to: '/how-it-works',
  },
]

export const DEMO_ABOUT_MARKETPLACE_ADVANTAGE = [
  {
    id: 'verified',
    tag: 'Verified Trust',
    title: 'Verified Professionals',
    description: 'Work only with verified and trusted tradesmen.',
  },
  {
    id: 'speed',
    tag: 'Speed & Ease',
    title: 'Fast & Easy',
    description: 'Post a job in minutes and receive responses quickly.',
  },
  {
    id: 'clarity',
    tag: 'Full Clarity',
    title: 'Transparent Process',
    description: 'Clear pricing, genuine reviews, and secure communication.',
  },
  {
    id: 'uk',
    tag: '100% UK Native',
    title: 'UK Focused',
    description:
      'Built specifically for customers and tradesmen across the United Kingdom.',
  },
]
