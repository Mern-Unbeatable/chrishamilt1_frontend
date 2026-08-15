/**
 * Single source for all DEMO_* mock payloads.
 * Import: import { DEMO_JOB_DETAILS } from '@/data/demoData'
 */

export const DEMO_JOB_DETAILS = {
  id: '1',
  status: 'Completed',
  statusVariant: 'completed',
  title: 'Complete Bathroom Renovation — Full Replumb & Tile',
  location: 'Kensington, London',
  price: '£8,000',
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
      'We are looking for an experienced bathroom fitter to completely renovate our master ensuite. The project involves stripping out the existing suite, replumbing for a new walk-in shower and double vanity, retiling all wall and floor surfaces, and installing new sanitaryware.',
    full: 'We are looking for an experienced bathroom fitter to completely renovate our master ensuite. The project involves stripping out the existing suite, replumbing for a new walk-in shower and double vanity, retiling all wall and floor surfaces, and installing new sanitaryware.\n\nThe bathroom is approximately 3.2m x 2.4m. All waste pipes will need rerouting for the new layout. We have already purchased the tiles, shower screen, and vanity unit — the tradesman will need to supply all plumbing fittings, adhesive, grout, and labour.\n\nWe require someone who can manage the project from start to finish, including coordination with an electrician for the heated towel rail and downlights. Previous bathroom portfolio photos are essential.',
  },
  requirements: [
    'City & Guilds Level 2/3 Plumbing or equivalent NVQ qualification',
    'Gas Safe registered engineer (if any gas work required)',
    'Public liability insurance minimum £2 million',
    'Minimum 3 years bathroom fitting experience with verifiable references',
    'Ability to project manage and coordinate with other trades if needed',
  ],
  preferredStart: '15 August 2026',
  completionBy: '30 September 2026',
  specialNotes:
    'Property is a third-floor flat with no lift — please factor in manual handling of materials. Parking permit available for one van on street. We have two cats so please keep the bathroom door closed during works. Dust sheets required in hallway.',
  photos: [
    {
      src: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=80',
      alt: 'Renovated bathroom with walk-in shower',
    },
    {
      src: 'https://images.unsplash.com/photo-1620626011761-996317b59421?auto=format&fit=crop&w=400&q=80',
      alt: 'Bathroom vanity and mirror',
    },
    {
      src: 'https://images.unsplash.com/photo-1507652313519-3dd907912343?auto=format&fit=crop&w=400&q=80',
      alt: 'Modern bathroom tiles',
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

export const DEMO_RECENT_JOBS = [
  {
    id: '1',
    title: 'Kitchen Extension Renovation',
    location: 'Salford, Manchester',
    priceRange: '£8,000–£12,000',
    postedAt: '2h ago',
    category: 'Kitchen Fitting',
    viewLeadTo: '/jobs/1',
  },
  {
    id: '2',
    title: 'Kitchen Extension Renovation',
    location: 'Salford, Manchester',
    priceRange: '£8,000–£12,000',
    postedAt: '4h ago',
    category: 'Kitchen Fitting',
    viewLeadTo: '/jobs/1',
  },
  {
    id: '3',
    title: 'Kitchen Extension Renovation',
    location: 'Salford, Manchester',
    priceRange: '£8,000–£12,000',
    postedAt: '6h ago',
    category: 'Kitchen Fitting',
    viewLeadTo: '/jobs/1',
  },
]

export const DEMO_MESSENGER_CHATS = [
  {
    id: 'techprint',
    name: 'TechPrint Hub',
    lastMessage: 'Thanks for the update on the bathroom job.',
    time: '4:27pm',
    online: true,
    initials: 'TH',
    avatar: null,
  },
  {
    id: 'maker-store',
    name: '3D Maker Store',
    lastMessage: 'Can you send the revised quote by tomorrow?',
    time: '3:12pm',
    online: false,
    initials: '3M',
    avatar: null,
  },
  {
    id: 'printmaster',
    name: 'PrintMaster',
    lastMessage: 'The tiles arrived this morning.',
    time: '1:45pm',
    online: true,
    initials: 'PM',
    avatar: null,
  },
  {
    id: 'ope',
    name: 'Ope',
    lastMessage: 'Kwasia 😂',
    time: '12:08pm',
    online: true,
    initials: 'O',
    avatar: null,
  },
]

export const DEMO_MESSENGER_MESSAGES = {
  ope: [
    { id: 'date-1', type: 'date', label: 'Thursday, Jan 4 • 6:21 PM' },
    { id: 'msg-1', sender: 'them', text: 'Hello, are you available for a quote this week?' },
    { id: 'msg-2', sender: 'me', text: 'Yes, I can visit on Friday morning.' },
    { id: 'msg-3', sender: 'them', text: 'Perfect. Can you also look at the ensuite while you are there?' },
    { id: 'msg-4', sender: 'me', text: 'Kwasia 😂' },
  ],
  techprint: [
    { id: 'date-1', type: 'date', label: 'Wednesday, Jan 3 • 4:27 PM' },
    { id: 'msg-1', sender: 'them', text: 'Thanks for the update on the bathroom job.' },
    { id: 'msg-2', sender: 'me', text: 'No problem. I will send photos once the tiling is done.' },
  ],
  'maker-store': [
    { id: 'date-1', type: 'date', label: 'Tuesday, Jan 2 • 3:12 PM' },
    { id: 'msg-1', sender: 'them', text: 'Can you send the revised quote by tomorrow?' },
  ],
  printmaster: [
    { id: 'date-1', type: 'date', label: 'Monday, Jan 1 • 1:45 PM' },
    { id: 'msg-1', sender: 'them', text: 'The tiles arrived this morning.' },
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
    label: 'Tokens used',
    value: '52',
    subtext: '',
    icon: 'used',
    iconTone: 'orange',
  },
  {
    id: 'purchased',
    label: 'Tokens purchased',
    value: '200',
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
      address: '1320/C Road No. 13/x, House no. 1320/C, Flat No. 5D',
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
    description: 'Best value for active tradesmen submitting regular quotes.',
    featured: true,
    badgeLabel: 'Most popular',
  },
  {
    id: 'business',
    planName: 'Business',
    price: '£200',
    tokens: 1000,
    rateLabel: '£0.20 per token',
    description: 'For established businesses with high lead volume.',
    featured: false,
  },
]
