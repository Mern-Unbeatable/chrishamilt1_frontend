/**
 * Component documentation catalog for /developer.
 * Demo payloads: import { DEMO_* } from '@/data/demoData'
 */

export const DOC_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'data-display', label: 'Data Display' },
  { id: 'forms', label: 'Forms' },
  { id: 'common', label: 'Common' },
]

export const COMPONENT_DOCS = [
  {
    id: 'job-details',
    name: 'JobDetails',
    category: 'data-display',
    summary:
      'Full job detail page — header, tradesman info, description, requirements, dates, gallery.',
    path: 'src/components/data-display/JobDetails/',
    importExample:
      "import JobDetails from '@/components/data-display/JobDetails'\nimport { DEMO_JOB_DETAILS } from '@/data/demoData'",
    props: [
      {
        name: 'job',
        type: 'object',
        required: true,
        description: 'Job payload (status, title, location, price, tradesman, description, photos, …).',
      },
      {
        name: 'showTradesman',
        type: 'boolean',
        required: false,
        defaultValue: 'true',
        description: 'Show tradesman information card.',
      },
      {
        name: 'showGallery',
        type: 'boolean',
        required: false,
        defaultValue: 'true',
        description: 'Show photo gallery when job.photos has items.',
      },
      {
        name: 'onMessage',
        type: '() => void',
        required: false,
        description:
          'Runs when Message is clicked. Pass from parent e.g. () => navigate("/auth/login"). Component never navigates itself.',
      },
      {
        name: 'messageLabel',
        type: 'string',
        required: false,
        defaultValue: "'Message'",
        description: 'Label for the message button.',
      },
      {
        name: 'className',
        type: 'string',
        required: false,
        defaultValue: "''",
        description: 'Extra classes on the wrapper.',
      },
    ],
    requiredExample: `<JobDetails job={DEMO_JOB_DETAILS} />`,
    optionalExample: `<JobDetails
  job={DEMO_JOB_DETAILS}
  onMessage={() => navigate('/auth/login')}
  className="px-3 sm:px-0"
/>`,
    previewId: 'job-details',
  },
  {
    id: 'job-card',
    name: 'JobCard',
    category: 'data-display',
    summary: 'Job list row with location, price, category, and view-lead action.',
    path: 'src/components/data-display/JobCard/JobCard.jsx',
    importExample:
      "import JobCard from '@/components/data-display/JobCard/JobCard'\nimport { DEMO_RECENT_JOBS } from '@/data/demoData'",
    props: [
      {
        name: 'title',
        type: 'string',
        required: true,
        description: 'Job title.',
      },
      {
        name: 'location',
        type: 'string',
        required: true,
        description: 'Job location.',
      },
      {
        name: 'priceRange',
        type: 'string',
        required: true,
        description: 'Budget or price range text.',
      },
      {
        name: 'postedAt',
        type: 'string',
        required: true,
        description: 'Relative posted time.',
      },
      {
        name: 'category',
        type: 'string',
        required: true,
        description: 'Trade category label.',
      },
      {
        name: 'onViewLead',
        type: '() => void',
        required: false,
        description:
          'Runs when View Lead is clicked. Pass from parent — component never navigates itself.',
      },
      {
        name: 'viewLeadLabel',
        type: 'string',
        required: false,
        defaultValue: "'View Lead'",
        description: 'Button label.',
      },
      {
        name: 'className',
        type: 'string',
        required: false,
        defaultValue: "''",
        description: 'Extra classes on the card.',
      },
    ],
    requiredExample: `<JobCard
  title={job.title}
  location={job.location}
  priceRange={job.priceRange}
  postedAt={job.postedAt}
  category={job.category}
/>`,
    optionalExample: `<JobCard
  {...job}
  onViewLead={() => navigate(\`/jobs/\${job.id}\`)}
/>`,
    previewId: 'job-card',
  },
  {
    id: 'quote-card',
    name: 'QuoteCard',
    category: 'data-display',
    summary:
      'Quote card for tradesman (status + actions) and customer (tradesman profile, metrics, proposal preview) dashboards.',
    path: 'src/components/data-display/QuoteCard/QuoteCard.jsx',
    importExample:
      "import QuoteCard from '@/components/data-display/QuoteCard/QuoteCard'\nimport { DEMO_CUSTOMER_QUOTES, DEMO_QUOTES } from '@/data/demoData'",
    props: [
      {
        name: 'variant',
        type: "'tradesman' | 'customer'",
        required: false,
        defaultValue: "'tradesman'",
        description: 'Tradesman shows job quote actions; customer shows tradesman profile and metrics.',
      },
      {
        name: 'tradesman',
        type: 'object',
        required: false,
        description: 'Customer variant — name, initials, avatar, rating, reviewCount, jobsCompleted, yearsExperience.',
      },
      {
        name: 'amount',
        type: 'string',
        required: true,
        description: 'Quoted amount.',
      },
      {
        name: 'duration',
        type: 'string',
        required: false,
        description: 'Estimated duration.',
      },
      {
        name: 'startDate',
        type: 'string',
        required: false,
        description: 'Customer variant — proposed start date.',
      },
      {
        name: 'distance',
        type: 'string',
        required: false,
        description: 'Customer variant — distance from job.',
      },
      {
        name: 'responseTime',
        type: 'string',
        required: false,
        description: 'Customer variant — how quickly the tradesman responded.',
      },
      {
        name: 'submittedAt',
        type: 'string',
        required: false,
        description: 'Customer variant — badge text e.g. Submitted 1 day ago.',
      },
      {
        name: 'proposalPreview',
        type: 'string',
        required: false,
        description: 'Customer variant — short proposal text.',
      },
      {
        name: 'quoteId',
        type: 'string',
        required: false,
        description: 'Tradesman variant — quote reference e.g. Q-90124.',
      },
      {
        name: 'status',
        type: 'string',
        required: false,
        description: 'Tradesman variant — status label e.g. Pending.',
      },
      {
        name: 'statusVariant',
        type: "'pending' | 'accepted' | 'rejected' | 'withdrawn' | 'submitted'",
        required: false,
        defaultValue: "'pending'",
        description: 'Controls badge colour.',
      },
      {
        name: 'postedAt',
        type: 'string',
        required: false,
        description: 'Tradesman variant — relative time posted.',
      },
      {
        name: 'title',
        type: 'string',
        required: false,
        description: 'Tradesman variant — job title.',
      },
      {
        name: 'customerName',
        type: 'string',
        required: false,
        description: 'Tradesman variant — customer name.',
      },
      {
        name: 'tokensUsed',
        type: 'number',
        required: false,
        description: 'Tradesman variant — lead tokens used.',
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        description: 'Tradesman variant — quote message preview.',
      },
      {
        name: 'onViewDetails',
        type: '() => void',
        required: false,
        description: 'View details button handler.',
      },
      {
        name: 'onEditQuote',
        type: '() => void',
        required: false,
        description: 'Tradesman variant — edit quote button handler.',
      },
      {
        name: 'onWithdraw',
        type: '() => void',
        required: false,
        description: 'Tradesman variant — withdraw button handler.',
      },
      {
        name: 'onMessageCustomer',
        type: '() => void',
        required: false,
        description: 'Tradesman variant — primary message button handler.',
      },
      {
        name: 'className',
        type: 'string',
        required: false,
        defaultValue: "''",
        description: 'Extra classes on the card.',
      },
    ],
    requiredExample: `<QuoteCard
  variant="customer"
  tradesman={quote.tradesman}
  amount={quote.amount}
  duration={quote.duration}
  startDate={quote.startDate}
  distance={quote.distance}
  responseTime={quote.responseTime}
  submittedAt={quote.submittedAt}
  proposalPreview={quote.proposalPreview}
/>`,
    optionalExample: `<QuoteCard
  variant="customer"
  {...quote}
  onViewDetails={() => openQuote(quote.id)}
/>

<QuoteCard
  {...quote}
  onViewDetails={() => openQuote(quote.id)}
  onEditQuote={() => editQuote(quote.id)}
  onWithdraw={() => withdrawQuote(quote.id)}
  onMessageCustomer={() => navigate('/tradesman/messages')}
/>`,
    previewId: 'quote-card',
  },
  {
    id: 'wallet-stat-card',
    name: 'WalletStatCard',
    category: 'data-display',
    summary: 'Dashboard stat tile for wallet metrics (tokens available, used, purchased).',
    path: 'src/components/data-display/WalletStatCard/WalletStatCard.jsx',
    importExample:
      "import WalletStatCard from '@/components/data-display/WalletStatCard/WalletStatCard'\nimport { DEMO_WALLET_STATS } from '@/data/demoData'",
    props: [
      { name: 'label', type: 'string', required: true, description: 'Stat label.' },
      { name: 'value', type: 'string | number', required: true, description: 'Main metric value.' },
      { name: 'subtext', type: 'string', required: false, description: 'Optional helper text below value.' },
      {
        name: 'icon',
        type: "'tokens' | 'used' | 'purchased'",
        required: false,
        defaultValue: "'tokens'",
        description: 'Built-in icon key.',
      },
      {
        name: 'iconTone',
        type: "'teal' | 'orange' | 'green'",
        required: false,
        defaultValue: "'teal'",
        description: 'Icon background colour variant.',
      },
      { name: 'className', type: 'string', required: false, defaultValue: "''", description: 'Extra classes.' },
    ],
    requiredExample: `<WalletStatCard
  label="Available tokens"
  value="148"
  subtext="≈ 29 quotes"
  icon="tokens"
  iconTone="teal"
/>`,
    optionalExample: `{DEMO_WALLET_STATS.map((stat) => (
  <WalletStatCard key={stat.id} {...stat} />
))}`,
    previewId: 'wallet-stat-card',
  },
  {
    id: 'token-pricing-card',
    name: 'TokenPricingCard',
    category: 'data-display',
    summary: 'Token package pricing card with optional featured / most popular state.',
    path: 'src/components/data-display/TokenPricingCard/TokenPricingCard.jsx',
    importExample:
      "import TokenPricingCard from '@/components/data-display/TokenPricingCard/TokenPricingCard'\nimport { DEMO_TOKEN_PRICING } from '@/data/demoData'",
    props: [
      { name: 'planName', type: 'string', required: true, description: 'Plan tier name e.g. Starter.' },
      { name: 'price', type: 'string', required: true, description: 'Display price e.g. £30.' },
      { name: 'tokens', type: 'number', required: true, description: 'Token count included.' },
      { name: 'rateLabel', type: 'string', required: true, description: 'Per-token rate text.' },
      { name: 'description', type: 'string', required: true, description: 'Plan description.' },
      {
        name: 'featured',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Highlighted plan with border and badge.',
      },
      {
        name: 'badgeLabel',
        type: 'string',
        required: false,
        defaultValue: "'Most popular'",
        description: 'Badge text when featured.',
      },
      {
        name: 'onBuyTokens',
        type: '() => void',
        required: false,
        description: 'Buy button handler — pass from parent page.',
      },
      {
        name: 'buyLabel',
        type: 'string',
        required: false,
        defaultValue: "'Buy Tokens'",
        description: 'Buy button label.',
      },
      { name: 'className', type: 'string', required: false, defaultValue: "''", description: 'Extra classes.' },
    ],
    requiredExample: `<TokenPricingCard
  planName="Starter"
  price="£30"
  tokens={100}
  rateLabel="£0.30 per token"
  description="Perfect for tradesmen getting started."
/>`,
    optionalExample: `<TokenPricingCard
  {...plan}
  onBuyTokens={() => purchasePlan(plan.id)}
/>`,
    previewId: 'token-pricing-card',
  },
  {
    id: 'profile-settings',
    name: 'ProfileSettings',
    category: 'forms',
    summary:
      'Shared My Profile / account settings for user, tradesman, and admin dashboards. role drives layout and visible sections.',
    path: 'src/components/forms/ProfileSettings/ProfileSettings.jsx',
    importExample:
      "import ProfileSettings from '@/components/forms/ProfileSettings/ProfileSettings'\nimport { DEMO_TRADESMAN_PROFILE } from '@/data/demoData'",
    props: [
      {
        name: 'role',
        type: "'user' | 'tradesman' | 'admin'",
        required: false,
        defaultValue: "'tradesman'",
        description:
          'Dashboard role — user shows account + address cards; tradesman adds warehouses; admin is name + email only.',
      },
      {
        name: 'value',
        type: 'object',
        required: false,
        description: 'Controlled form state. Omit to use defaultValue + internal state.',
      },
      {
        name: 'defaultValue',
        type: 'object',
        required: false,
        description: 'Initial profile payload (see DEMO_USER_PROFILE, DEMO_TRADESMAN_PROFILE, DEMO_ADMIN_PROFILE).',
      },
      {
        name: 'onChange',
        type: '(next: object) => void',
        required: false,
        description: 'Fires on any field change with the full next form object.',
      },
      {
        name: 'onUpdateProfile',
        type: '(payload: object) => void',
        required: false,
        description: 'Save account fields. User role sends firstName/lastName/address; others send name/email/phone.',
      },
      {
        name: 'onSaveWarehouses',
        type: '(warehouses: array) => void',
        required: false,
        description: 'Tradesman only — save warehouse addresses.',
      },
      {
        name: 'onChangePassword',
        type: '({ currentPassword, newPassword, confirmPassword }) => void',
        required: false,
        description: 'Change password handler. Clears password fields after call.',
      },
      {
        name: 'onUploadAvatar',
        type: '(file: File) => void',
        required: false,
        description: 'User role only — avatar file picked from camera button.',
      },
      {
        name: 'title',
        type: 'string',
        required: false,
        defaultValue: "'My Profile'",
        description: 'Page heading for dashboard roles.',
      },
      {
        name: 'subtitle',
        type: 'string',
        required: false,
        defaultValue: "'Manage your account and store preferences.'",
        description: 'Subheading under the page title.',
      },
      {
        name: 'className',
        type: 'string',
        required: false,
        defaultValue: "''",
        description: 'Extra classes on the wrapper.',
      },
    ],
    requiredExample: `<ProfileSettings
  role="tradesman"
  defaultValue={DEMO_TRADESMAN_PROFILE}
  onUpdateProfile={(data) => saveProfile(data)}
  onSaveWarehouses={(list) => saveWarehouses(list)}
  onChangePassword={(data) => changePassword(data)}
/>`,
    optionalExample: `<ProfileSettings
  role="user"
  defaultValue={DEMO_USER_PROFILE}
  onUpdateProfile={saveAccount}
  onChangePassword={changePassword}
  onUploadAvatar={uploadAvatar}
/>`,
    previewId: 'profile-settings',
  },
  {
    id: 'data-table',
    name: 'DataTable',
    category: 'data-display',
    summary:
      'Prop-driven table toolkit: tabs, search, filters, row actions, loading skeletons, and prev/next pagination footer.',
    path: 'src/components/data-display/DataTable/DataTable.jsx',
    importExample:
      "import DataTable, { StatusBadge } from '@/components/data-display/DataTable/DataTable'\nimport { DEMO_ADMIN_CUSTOMERS, DEMO_TRADESMAN_JOBS } from '@/data/demoData'",
    props: [
      {
        name: 'columns',
        type: 'Array<{ key, header, render?, className?, headerClassName?, wrap? }>',
        required: true,
        description: 'Column definitions. Use render for StatusBadge and custom cells.',
      },
      {
        name: 'data',
        type: 'array',
        required: true,
        description: 'Row data — parent slices for pagination.',
      },
      {
        name: 'showFilters',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Show filter dropdowns above the table.',
      },
      {
        name: 'showSearch',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Show search input.',
      },
      {
        name: 'showTabs',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Show tabs bar.',
      },
      {
        name: 'showActions',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Row action menu or buttons column.',
      },
      {
        name: 'showPagination',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Prev/next footer with result summary.',
      },
      {
        name: 'pagination',
        type: '{ page, pageSize, total, onPageChange?, summaryLabel? }',
        required: false,
        description: 'Pagination config when showPagination is true.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Show skeleton rows.',
      },
      {
        name: 'showCard',
        type: 'boolean',
        required: false,
        defaultValue: 'true',
        description: 'Card shell with border and padding. Set false inside dashboard sections.',
      },
      {
        name: 'getRowKey',
        type: '(row, index) => string | number',
        required: false,
        description: 'Stable row key for React list.',
      },
      {
        name: 'className',
        type: 'string',
        required: false,
        defaultValue: "''",
        description: 'Extra classes on the wrapper.',
      },
    ],
    requiredExample: `<DataTable
  columns={[
    { key: 'jobId', header: 'Job ID' },
    { key: 'customerName', header: 'Customer name' },
    {
      key: 'status',
      header: 'Status',
      render: (value) => <StatusBadge status={value} />,
    },
  ]}
  data={DEMO_TRADESMAN_JOBS}
  showActions
  actions={[{ id: 'view', label: 'View', onClick: () => {} }]}
/>`,
    optionalExample: `<DataTable
  columns={columns}
  data={pagedRows}
  showFilters
  filters={[{ id: 'status', value, onChange, options }]}
  showPagination
  pagination={{ page, pageSize, total, onPageChange: setPage }}
  showCard={false}
/>`,
    previewId: 'data-table',
  },
  {
    id: 'pagination',
    name: 'Pagination',
    category: 'common',
    summary:
      'Numbered pagination for card grids and standalone lists. Returns null when totalPages <= 1.',
    path: 'src/components/common/Pagination/Pagination.jsx',
    importExample: "import Pagination from '@/components/common/Pagination/Pagination'",
    props: [
      {
        name: 'page',
        type: 'number',
        required: false,
        defaultValue: '1',
        description: 'Current page (1-based).',
      },
      {
        name: 'totalPages',
        type: 'number',
        required: false,
        defaultValue: '1',
        description: 'Total page count.',
      },
      {
        name: 'onPageChange',
        type: '(page: number) => void',
        required: false,
        description: 'Called when user picks a page.',
      },
      {
        name: 'className',
        type: 'string',
        required: false,
        defaultValue: "''",
        description: 'Extra classes on the nav wrapper.',
      },
    ],
    requiredExample: `<Pagination page={page} totalPages={8} onPageChange={setPage} />`,
    optionalExample: `<Pagination
  page={page}
  totalPages={Math.ceil(items.length / pageSize)}
  onPageChange={setPage}
  className="mt-6"
/>`,
    previewId: 'pagination',
  },
  {
    id: 'messenger',
    name: 'Messenger',
    category: 'common',
    summary: 'Inbox sidebar + chat area. Pass state from useMessages() on the page.',
    path: 'src/components/common/messenger/',
    importExample:
      "import Messenger from '@/components/common/messenger/Messenger'\nimport useMessages from '@/components/common/messenger/useMessages'",
    props: [
      {
        name: 'chats',
        type: 'array',
        required: true,
        description: 'Conversation list from useMessages() or API.',
      },
      {
        name: 'messages',
        type: 'array',
        required: true,
        description: 'Messages for the active conversation.',
      },
      {
        name: 'activePartnerId',
        type: 'string | null',
        required: false,
        description: 'Currently selected chat id.',
      },
      {
        name: 'activeChat',
        type: 'object | null',
        required: false,
        description: 'Active chat object for the header.',
      },
      {
        name: 'onSelectChat',
        type: '(id: string | null) => void',
        required: false,
        description: 'Called when user picks a conversation or goes back on mobile.',
      },
      {
        name: 'onSend',
        type: '(text: string) => void',
        required: false,
        description: 'Called when user sends a message.',
      },
      {
        name: 'isSending',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Disables send while message is sending.',
      },
      {
        name: 'sidebarTitle',
        type: 'string',
        required: false,
        defaultValue: "'Messages'",
        description: 'Sidebar heading.',
      },
      {
        name: 'className',
        type: 'string',
        required: false,
        defaultValue: "''",
        description: 'Extra classes on the shell.',
      },
    ],
    requiredExample: `const state = useMessages()

<Messenger {...state} />`,
    optionalExample: `<Messenger
  {...state}
  sidebarTitle="Messages"
  placeholder="Write a message..."
  className="h-[600px]"
/>`,
    previewId: 'messenger',
  },
]

export function getComponentDoc(id) {
  return COMPONENT_DOCS.find((doc) => doc.id === id) || null
}

export function filterComponentDocs({ category = 'all', query = '' } = {}) {
  const q = query.trim().toLowerCase()

  return COMPONENT_DOCS.filter((doc) => {
    const catOk = category === 'all' || doc.category === category
    if (!catOk) return false
    if (!q) return true

    const hay = [
      doc.name,
      doc.summary,
      doc.path,
      doc.category,
      ...doc.props.map((prop) => `${prop.name} ${prop.description}`),
    ]
      .join(' ')
      .toLowerCase()

    return hay.includes(q)
  })
}
