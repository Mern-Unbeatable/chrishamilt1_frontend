export const LEGAL_COMPANY = {
  brand: 'Traders In Loop',
  legalName: 'TradesMarket Ltd',
  email: 'hello@tradesmarket.co.uk',
  privacyEmail: 'privacy@tradesmarket.co.uk',
  address: '123 Trade House, London EC2A 4AB, United Kingdom',
  phone: '0800 123 4567',
  jurisdiction: 'England and Wales',
}

export const LEGAL_RELATED_LINKS = [
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms of Service', to: '/terms-of-service' },
  { label: 'Cookie Policy', to: '/cookie-policy' },
]

export const LEGAL_DOCUMENTS = {
  privacy: {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    heroHighlight: 'Privacy',
    badge: 'Your data, explained clearly',
    summary:
      'How Traders In Loop collects, uses, and protects personal information when customers post jobs and tradesmen purchase lead tokens on our UK marketplace.',
    lastUpdated: '26 August 2025',
    readMinutes: 8,
    sections: [
      {
        id: 'introduction',
        title: '1. Introduction',
        paragraphs: [
          `${LEGAL_COMPANY.brand} ("we", "us", "our") is operated by ${LEGAL_COMPANY.legalName}. We run a digital marketplace that connects UK homeowners and businesses ("Customers") with verified trades professionals ("Tradesmen").`,
          'This Privacy Policy explains what personal data we collect, why we collect it, how we use it, and the rights you have under UK data protection law, including the UK GDPR and the Data Protection Act 2018.',
          'By creating an account, posting a job, purchasing tokens, or otherwise using our platform, you acknowledge that you have read this policy.',
        ],
      },
      {
        id: 'data-we-collect',
        title: '2. Information we collect',
        paragraphs: ['We collect information you provide directly and data generated through your use of the platform.'],
        subsections: [
          {
            title: 'Account & profile information',
            list: [
              'Name, email address, phone number, and password credentials',
              'Business name, trade category, service areas, and profile photo (Tradesmen)',
              'Address, region, and postcode details where relevant to job matching',
              'Verification documents submitted during tradesman onboarding',
            ],
          },
          {
            title: 'Job & marketplace activity',
            list: [
              'Job descriptions, budgets, photos, location, and preferred timelines',
              'Quotes submitted, token usage, lead unlock history, and booking status',
              'Messages exchanged between Customers and Tradesmen through our inbox',
              'Reviews, ratings, and dispute-related communications',
            ],
          },
          {
            title: 'Payment & wallet data',
            list: [
              'Token purchase history, wallet balance, and transaction references',
              'Billing contact details (payment card data is processed by our payment provider — we do not store full card numbers)',
            ],
          },
          {
            title: 'Technical & usage data',
            list: [
              'IP address, browser type, device identifiers, and session logs',
              'Pages visited, search filters used, and interaction events',
              'Cookie and similar technology data (see our Cookie Policy)',
            ],
          },
        ],
      },
      {
        id: 'how-we-use-data',
        title: '3. How we use your information',
        paragraphs: ['We use personal data only where we have a lawful basis to do so. Our main purposes include:'],
        list: [
          'Creating and managing your account across customer, tradesman, or admin roles',
          'Matching job posts with suitable tradesmen based on trade, location, and availability',
          'Enabling quotes, messaging, bookings, reviews, and customer support',
          'Processing token purchases and maintaining wallet balances for Tradesmen',
          'Verifying tradesman identity, qualifications, and platform eligibility',
          'Preventing fraud, abuse, and unauthorised access to the marketplace',
          'Sending service notifications (quote updates, messages, account alerts)',
          'Improving platform performance, safety, and user experience through analytics',
          'Complying with legal, tax, and regulatory obligations',
        ],
      },
      {
        id: 'legal-bases',
        title: '4. Lawful bases for processing',
        paragraphs: ['Depending on the activity, we rely on one or more of the following lawful bases:'],
        list: [
          'Contract — to deliver the services you request, such as posting a job or purchasing tokens',
          'Legitimate interests — to keep the marketplace secure, improve matching quality, and prevent misuse',
          'Legal obligation — where we must retain or disclose data to comply with applicable law',
          'Consent — for optional marketing communications and non-essential cookies where required',
        ],
      },
      {
        id: 'sharing',
        title: '5. When we share information',
        paragraphs: [
          'We do not sell your personal data. We may share information in the following circumstances:',
        ],
        list: [
          'Between Customers and Tradesmen — job details and contact information needed to quote and complete work',
          'With service providers — hosting, email delivery, payment processing, analytics, and customer support tools bound by confidentiality agreements',
          'For legal reasons — if required by court order, regulator request, or to protect rights, safety, and platform integrity',
          'Business transfers — in connection with a merger, acquisition, or asset sale, with appropriate safeguards',
        ],
      },
      {
        id: 'retention',
        title: '6. Data retention',
        paragraphs: [
          'We keep personal data only for as long as necessary for the purposes described in this policy.',
          'Account data is retained while your account remains active and for a reasonable period afterwards to resolve disputes, meet legal obligations, and maintain financial records.',
          'Job posts, quotes, and messages may be retained to support booking history, reviews, and platform safety investigations.',
        ],
      },
      {
        id: 'your-rights',
        title: '7. Your rights',
        paragraphs: ['Under UK data protection law, you may have the right to:'],
        list: [
          'Access a copy of the personal data we hold about you',
          'Correct inaccurate or incomplete information',
          'Request deletion of your data in certain circumstances',
          'Restrict or object to specific processing activities',
          'Request data portability where applicable',
          'Withdraw consent at any time for processing based on consent',
          'Lodge a complaint with the Information Commissioner\'s Office (ICO) at ico.org.uk',
        ],
        note: 'To exercise your rights, contact us at privacy@tradesmarket.co.uk. We respond within one month unless an extension is permitted by law.',
      },
      {
        id: 'security',
        title: '8. Security',
        paragraphs: [
          'We implement appropriate technical and organisational measures to protect personal data, including encrypted connections, access controls, and regular review of our security practices.',
          'No online service can guarantee absolute security. Please use a strong password and notify us immediately if you suspect unauthorised access to your account.',
        ],
      },
      {
        id: 'international',
        title: '9. International transfers',
        paragraphs: [
          'Your data is primarily processed within the United Kingdom. If we use providers outside the UK, we ensure appropriate safeguards are in place, such as UK adequacy regulations or standard contractual clauses.',
        ],
      },
      {
        id: 'children',
        title: '10. Children',
        paragraphs: [
          'Our platform is intended for users aged 18 and over. We do not knowingly collect personal data from children. Contact us if you believe a minor has provided information and we will delete it promptly.',
        ],
      },
      {
        id: 'contact',
        title: '11. Contact us',
        paragraphs: [
          `Data Controller: ${LEGAL_COMPANY.legalName}`,
          `Email: ${LEGAL_COMPANY.privacyEmail}`,
          `Address: ${LEGAL_COMPANY.address}`,
        ],
      },
    ],
  },
  terms: {
    slug: 'terms-of-service',
    title: 'Terms of Service',
    heroHighlight: 'Terms',
    badge: 'Platform rules & responsibilities',
    summary:
      'The terms that govern use of Traders In Loop — for customers posting jobs, tradesmen purchasing lead tokens, and everyone using our marketplace.',
    lastUpdated: '26 August 2025',
    readMinutes: 10,
    sections: [
      {
        id: 'agreement',
        title: '1. Agreement to these terms',
        paragraphs: [
          `These Terms of Service ("Terms") form a binding agreement between you and ${LEGAL_COMPANY.legalName}, trading as ${LEGAL_COMPANY.brand}.`,
          'By accessing or using our website, mobile experience, or related services (collectively, the "Platform"), you agree to these Terms and our Privacy Policy. If you do not agree, do not use the Platform.',
        ],
      },
      {
        id: 'platform-role',
        title: '2. Our role as a marketplace',
        paragraphs: [
          `${LEGAL_COMPANY.brand} is an intermediary marketplace. We facilitate introductions between Customers and Tradesmen but are not a party to any contract for physical trade work.`,
          'Tradesmen are independent professionals, not employees or agents of Traders In Loop. Customers are responsible for evaluating quotes, verifying credentials, and agreeing scope, price, and timelines directly with the Tradesman they hire.',
          'We do not guarantee the quality, timing, safety, or outcome of work performed. Any dispute about workmanship should first be resolved between the Customer and Tradesman, though we may offer support tools where available.',
        ],
        note: 'Always confirm insurance, qualifications, and written quotes before work begins.',
      },
      {
        id: 'accounts',
        title: '3. Accounts & eligibility',
        paragraphs: ['To use certain features you must register for an account and provide accurate information.'],
        list: [
          'You must be at least 18 years old and legally able to enter into contracts',
          'You are responsible for maintaining the confidentiality of your login credentials',
          'You must notify us promptly of any unauthorised account activity',
          'We may suspend or terminate accounts that provide false information or breach these Terms',
          'One person or business may not maintain multiple accounts to circumvent platform rules',
        ],
      },
      {
        id: 'customers',
        title: '4. Customer terms',
        paragraphs: ['Customers may browse trades, post jobs, receive quotes, message Tradesmen, and manage bookings through the Platform.'],
        list: [
          'Posting a job is free unless otherwise stated on the Platform',
          'You agree to provide accurate job descriptions, locations, budgets, and photos',
          'You will not post unlawful, misleading, abusive, or discriminatory job requests',
          'You are responsible for granting safe access to your property and for final hiring decisions',
          'Cancelling a booking should follow the process shown in your account and any agreed terms with the Tradesman',
        ],
      },
      {
        id: 'tradesmen',
        title: '5. Tradesman terms',
        paragraphs: [
          'Tradesmen access lead opportunities through token-based packages. Tokens are used to unlock job details and submit quotes as described on the Platform.',
        ],
        list: [
          'You must complete onboarding and any verification steps before accessing paid lead features',
          'Token purchases grant access to marketplace leads — they do not guarantee work, conversions, or earnings',
          'Quotes must be honest, clearly priced, and within your stated trade capabilities',
          'You are responsible for holding appropriate licences, insurance, and tax compliance for your trade',
          'Misuse of leads, harassment of customers, or quote spam may result in suspension and forfeiture of unused tokens where permitted by law',
        ],
      },
      {
        id: 'tokens-payments',
        title: '6. Tokens, pricing & payments',
        paragraphs: [
          'Token package prices, per-lead costs, and wallet rules are displayed on the Platform and may change with reasonable notice.',
          'All fees are quoted in GBP unless stated otherwise. Taxes may apply where relevant.',
          'Except where required by consumer law, token purchases are generally non-refundable once leads have been unlocked or tokens consumed.',
          'We may offer promotional credits or featured packages from time to time under separate conditions.',
        ],
      },
      {
        id: 'content',
        title: '7. User content & conduct',
        paragraphs: ['You retain ownership of content you submit but grant us a licence to host, display, and process it to operate the Platform.'],
        list: [
          'Do not upload content that infringes intellectual property or privacy rights',
          'Do not attempt to scrape data, bypass token mechanics, or contact users off-platform to avoid fees',
          'Do not use the Platform for harassment, hate speech, fraud, or illegal activity',
          'We may remove content or restrict access that violates these Terms or harms marketplace trust',
        ],
      },
      {
        id: 'reviews',
        title: '8. Reviews & reputation',
        paragraphs: [
          'Reviews should reflect genuine experiences. We may investigate suspicious or retaliatory reviews and remove content that breaches our guidelines.',
          'Tradesmen must not incentivise false reviews or pressure customers to change ratings.',
        ],
      },
      {
        id: 'liability',
        title: '9. Limitation of liability',
        paragraphs: [
          'To the fullest extent permitted by law, Traders In Loop is not liable for indirect, incidental, or consequential losses arising from use of the Platform or work performed by Tradesmen.',
          'Nothing in these Terms excludes liability for death or personal injury caused by negligence, fraud, or any liability that cannot be excluded under UK law.',
          'Our total liability for any claim relating to the Platform is limited to the greater of £100 or the fees you paid to us in the 12 months before the claim arose, except where law requires otherwise.',
        ],
      },
      {
        id: 'termination',
        title: '10. Suspension & termination',
        paragraphs: [
          'You may close your account at any time through account settings or by contacting support.',
          'We may suspend or terminate access immediately if you breach these Terms, create risk for other users, or where required by law.',
          'Provisions that by nature should survive termination — including payment obligations, liability limits, and dispute rules — will continue to apply.',
        ],
      },
      {
        id: 'changes',
        title: '11. Changes to these Terms',
        paragraphs: [
          'We may update these Terms from time to time. Material changes will be communicated via the Platform or email where appropriate.',
          'Continued use after the effective date of updated Terms constitutes acceptance. If you disagree with changes, you should stop using the Platform.',
        ],
      },
      {
        id: 'law',
        title: '12. Governing law & disputes',
        paragraphs: [
          `These Terms are governed by the laws of ${LEGAL_COMPANY.jurisdiction}.`,
          'We encourage you to contact us first to resolve concerns amicably. If a dispute cannot be resolved, the courts of England and Wales shall have exclusive jurisdiction, without prejudice to mandatory consumer rights.',
        ],
      },
      {
        id: 'contact-terms',
        title: '13. Contact',
        paragraphs: [
          `${LEGAL_COMPANY.legalName} — ${LEGAL_COMPANY.brand}`,
          `Email: ${LEGAL_COMPANY.email}`,
          `Address: ${LEGAL_COMPANY.address}`,
        ],
      },
    ],
  },
  cookies: {
    slug: 'cookie-policy',
    title: 'Cookie Policy',
    heroHighlight: 'Cookie',
    badge: 'Transparency about site cookies',
    summary:
      'What cookies and similar technologies Traders In Loop uses, why we use them, and how you can manage your preferences.',
    lastUpdated: '26 August 2025',
    readMinutes: 5,
    sections: [
      {
        id: 'what-are-cookies',
        title: '1. What are cookies?',
        paragraphs: [
          'Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences, keep you signed in, and understand how pages are used.',
          'We also use similar technologies such as local storage (for example, to remember dashboard preferences or demo category settings) and session identifiers required for security.',
        ],
      },
      {
        id: 'how-we-use-cookies',
        title: '2. How we use cookies',
        paragraphs: ['We group cookies into the following categories:'],
        subsections: [
          {
            title: 'Strictly necessary',
            list: [
              'Authentication — keeps you logged in securely across customer, tradesman, and admin areas',
              'Security — helps prevent cross-site request forgery and protects account sessions',
              'Load balancing — ensures reliable delivery of pages during high traffic',
            ],
          },
          {
            title: 'Functional',
            list: [
              'Preferences — remembers choices such as "Remember me" on login',
              'Local storage — saves admin-managed trade categories and onboarding state during demo use',
              'Interface state — preserves filters or tab selections where helpful to your workflow',
            ],
          },
          {
            title: 'Analytics (optional)',
            list: [
              'Usage measurement — aggregated statistics on page views, funnels, and feature adoption',
              'Performance monitoring — error rates and load times to improve reliability',
            ],
          },
          {
            title: 'Marketing (optional)',
            list: [
              'Campaign attribution — understanding which channels bring users to the Platform',
              'We do not use invasive third-party ad trackers on core marketplace pages',
            ],
          },
        ],
      },
      {
        id: 'cookie-table',
        title: '3. Cookies we may set',
        paragraphs: ['Examples of cookies and storage keys used on the Platform include:'],
        table: {
          headers: ['Name / key', 'Purpose', 'Duration', 'Type'],
          rows: [
            ['session / auth token', 'Maintains your signed-in session', 'Session or up to 30 days', 'Strictly necessary'],
            ['tradetrust.tradeCategories', 'Stores trade category configuration locally', 'Persistent', 'Functional'],
            ['tradetrust.tradesmanSubscriptions', 'Remembers tradesman onboarding completion in demo mode', 'Persistent', 'Functional'],
            ['remember_me', 'Stores login preference selection', 'Persistent', 'Functional'],
            ['_analytics_*', 'Anonymous usage analytics if enabled', 'Up to 13 months', 'Analytics'],
          ],
        },
      },
      {
        id: 'third-parties',
        title: '4. Third-party cookies',
        paragraphs: [
          'Some cookies may be set by trusted partners that provide services on our behalf, such as payment processors, embedded maps, or support chat widgets.',
          'These partners are permitted to use data only as needed to deliver their service and in accordance with their own privacy policies.',
        ],
      },
      {
        id: 'managing-cookies',
        title: '5. Managing your preferences',
        paragraphs: [
          'When you first visit the Platform, you may be presented with a cookie banner allowing you to accept all cookies or manage non-essential preferences.',
          'You can also control cookies through your browser settings. Blocking strictly necessary cookies may prevent login and core marketplace features from working correctly.',
          'To clear locally stored demo data, remove site data for this domain in your browser\'s application/storage settings.',
        ],
        list: [
          'Chrome — Settings → Privacy and security → Cookies and site data',
          'Safari — Settings → Privacy → Manage Website Data',
          'Firefox — Settings → Privacy & Security → Cookies and Site Data',
          'Edge — Settings → Cookies and site permissions',
        ],
      },
      {
        id: 'updates-cookies',
        title: '6. Updates to this policy',
        paragraphs: [
          'We may update this Cookie Policy when we add features, change providers, or update legal requirements. The "Last updated" date at the top reflects the latest revision.',
        ],
      },
      {
        id: 'contact-cookies',
        title: '7. Contact',
        paragraphs: [
          'Questions about cookies or privacy?',
          `Email: ${LEGAL_COMPANY.privacyEmail}`,
          `Address: ${LEGAL_COMPANY.address}`,
        ],
      },
    ],
  },
}

export function getLegalDocument(key) {
  return LEGAL_DOCUMENTS[key] ?? null
}
