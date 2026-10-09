// English — the source dictionary. Every other language file is typed as
// `Dictionary` (the shape of this object), so TypeScript refuses to build
// if a translation is missing a key or has one this file doesn't.
//
// Conventions:
// - {name} placeholders are filled by fmt()/rich() from lib/i18n/format.
// - { one, other } pairs go through plural(), which applies each
//   language's own plural rules.
// - "Gulf Spectrum Journal", "Gulf of Guinea Maritime Institute" and
//   "GoGMI" are proper names and stay untranslated in every language.

const en = {
  meta: {
    siteTitle: 'Gulf Spectrum Journal — A Publication of the Gulf of Guinea Maritime Institute',
    siteDescription:
      'Gulf Spectrum Journal is the research journal of the Gulf of Guinea Maritime Institute (GoGMI), publishing locally produced, editorially reviewed research on maritime security and governance in the Gulf of Guinea.',
  },

  journal: {
    subtitle: 'A Publication of the Gulf of Guinea Maritime Institute',
    frequency: 'Published annually, in themed volumes',
    issnPending: 'ISSN pending',
    aboutText: `Gulf Spectrum Journal is the research journal of the Gulf of Guinea Maritime Institute (GoGMI), publishing locally produced, insider perspectives on maritime governance, safety, and security in the Gulf of Guinea. Its mission is to give stakeholders across the region and beyond a credible, consolidated platform for research produced by the officers, researchers, and practitioners who work on these issues directly — as an alternative to research about the region produced elsewhere.

Each volume is reviewed by a dedicated editorial board of subject-matter experts, who set that volume's citation style and word-count guidance and oversee the quality and rigor of its content before publication. The journal supports GoGMI's wider advocacy and capacity-building work across its four core areas: Research, Advocacy, Capacity Building, and Consultancy — including flagship initiatives such as the International Maritime Security Working Group (IMSWG) and the WYTEC Blue programme for women and youth in the blue economy.`,
    scopeAreas: [
      'Maritime security',
      'Blue economy development',
      'Regional cooperation and governance in the Gulf of Guinea',
      "Capacity building, including youth and women's participation in the blue economy",
      'Consultancy insights and case studies, where suitable for public release',
      'Broader Gulf of Guinea and West African maritime affairs',
    ],
  },

  common: {
    loading: 'Loading…',
    signIn: 'Sign in',
    signInButton: 'Sign In',
    signUpButton: 'Sign Up',
    signOut: 'Sign Out',
    email: 'Email',
    password: 'Password',
    fullName: 'Full name',
    or: 'or',
    sending: 'Sending…',
    submitting: 'Submitting…',
    saving: 'Saving…',
    somethingWrong: 'Something went wrong. Please try again.',
    copied: 'Copied',
    copyCitation: 'Copy citation',
    researchArticle: 'Research Article',
    issueNumber: 'Issue {number}',
    volumeShort: 'Vol. {volume} · {date}',
    articleCount: { one: '{count} article', other: '{count} articles' },
    and: ' and ',
    accountEyebrow: 'Account',
  },

  nav: {
    home: 'Home',
    articlesAndIssues: 'Articles and Issues',
    topics: 'Topics',
    about: 'About the Journal',
    authors: 'Authors',
    submissions: 'Submission Guidelines',
    contact: 'Contact',
    citations: 'Citations',
    analytics: 'Analytics',
    upload: 'Upload',
    tools: 'Tools',
    latestIssue: 'Latest Issue',
    editorialBoard: 'Editorial Board',
    bookmarks: 'Bookmarks',
    messages: 'Messages',
    notifications: 'Notifications',
    myProfile: 'My Profile',
    accountSettings: 'Account Settings',
    dashboard: 'Dashboard',
    editorialAdmin: 'Editorial Admin',
    authorProfiles: 'Author Profiles',
  },

  header: {
    publicationOf: 'A publication of the Gulf of Guinea Maritime Institute',
    toggleMenu: 'Toggle navigation menu',
    language: 'Language',
  },

  footer: {
    blurb:
      '{subtitle}, published by the Gulf of Guinea Maritime Institute (GoGMI). Locally produced, editorially reviewed research on maritime governance, safety, and security in the Gulf of Guinea.',
    journalHeading: 'Journal',
    moreHeading: 'More',
    contactOffice: 'Contact the editorial office',
    correctionPolicy: 'Correction policy',
    rights: '© {year} Gulf of Guinea Maritime Institute. All rights reserved.',
  },

  accountMenu: {
    ariaLabel: 'Account menu',
    guest: 'Guest Researcher',
    notSignedIn: 'Not signed in',
    signedIn: 'Signed in',
    sectionAccount: 'Account',
    sectionEditorial: 'Editorial',
    sectionMyResearch: 'My Research',
    sectionMore: 'More',
  },

  subNav: {
    searchPlaceholder: 'Search this journal',
    search: 'Search',
    submitArticle: 'Submit your article →',
  },

  home: {
    metaDescription:
      'Gulf Spectrum Journal is the research journal of the Gulf of Guinea Maritime Institute (GoGMI), publishing locally produced, editorially reviewed research across maritime security, blue economy, governance, and capacity building.',
    intro:
      'Locally produced, editorially reviewed research on maritime governance, safety, and security in the Gulf of Guinea — written by the naval officers, researchers, and practitioners who work on these issues directly.',
    readLatest: 'Read the Latest Issue',
    aboutJournal: 'About the Journal',
    issueHeading: 'Issue {number}: {theme}',
    viewIssue: 'View issue →',
    aboutBody:
      'Gulf Spectrum Journal gives stakeholders across the Gulf of Guinea and beyond access to locally produced, insider perspectives on maritime governance, safety, and security in the region.',
    learnMore: 'Learn more →',
    submitHeading: 'Submit Your Research',
    submitBody:
      'Gulf Spectrum Journal welcomes submissions from researchers, officers, and practitioners working on Gulf of Guinea maritime affairs.',
    viewGuidelines: 'View submission guidelines →',
    boardHeading: 'Editorial Board',
    boardBody: "Meet the editors who review and publish Gulf Spectrum Journal's research — or apply to join them.",
    applyBoard: 'Apply for the editorial board →',
    browseByTopic: 'Browse by Topic',
    allTopics: 'All topics →',
    browseArticlesIssues: 'Browse Articles and Issues',
    viewAll: 'View all →',
    emptyHeading: 'First issue coming soon',
    emptyBody:
      'Gulf Spectrum Journal is preparing its first issue. In the meantime, read about the journal or submit your research for consideration.',
  },

  about: {
    metaTitle: 'About the Journal',
    metaDescription:
      "Gulf Spectrum Journal's ongoing mission: locally produced research on maritime security and governance in the Gulf of Guinea, reviewed by a dedicated editorial board.",
    eyebrow: 'About',
    title: 'About the Journal',
    heroAlt: "Naval officers, researchers, and policymakers at GoGMI's Maritime Security Conference 2025 in Accra",
    heroCaption: "GoGMI's Maritime Security Conference 2025, Accra — the network of contributors this journal draws on.",
    scope: 'Scope',
    standards: 'Content Standards & Trust Signals',
    trustSignals: [
      {
        title: 'Editorial Review',
        body: "Every volume is reviewed by a dedicated editorial board before publication. Reviewers set that volume's citation style and word-count guidance.",
      },
      {
        title: 'Named Authorship',
        body: 'Every article displays each author’s name, photograph, and institutional affiliation, alongside a full formatted reference list.',
      },
      {
        title: 'Correction Policy',
        body: 'Corrections to published articles are marked and dated on the article itself. See our correction policy for details.',
      },
      {
        title: 'Disclosure',
        body: 'Articles include a funding or conflict-of-interest disclosure line where applicable.',
      },
    ],
    details: 'Journal Details',
    publisher: 'Publisher',
    frequency: 'Frequency',
    issn: 'ISSN',
    founded: 'Founded',
    board: 'Editorial Board',
    noBoard: 'No editorial board members are listed yet.',
    viewFullBoard: 'View the full editorial board →',
    readCorrectionPolicy: 'Read the correction policy →',
  },

  issues: {
    metaTitle: 'Articles and Issues',
    metaDescription: 'Browse all articles and issues of Gulf Spectrum Journal by volume, theme, and topic.',
    eyebrow: 'Archive',
    title: 'Articles and Issues',
    description:
      'Browse Gulf Spectrum Journal by volume. Each issue is a themed, editorially reviewed collection of research articles. Prefer to browse by subject? {link}',
    seeTopics: 'See Topics →',
    empty: 'No issues have been published yet — the first one is on its way.',
  },

  issue: {
    notFound: 'Issue not found',
    metaTitle: 'Issue {number}: {theme}',
    volume: 'Volume {volume} · {date}',
    inThisIssue: 'In This Issue',
    issueBoard: 'Issue Editorial Board',
    allIssues: '← All issues',
    downloadPdf: 'Download full issue (PDF)',
    coverAlt: 'Cover: Issue {number}, {theme}',
  },

  article: {
    notFound: 'Article not found',
    breadcrumb: 'Article',
    abstract: 'Abstract',
    keywords: 'Keywords —',
    conclusion: 'Conclusion',
    references: 'References',
    aboutAuthors: 'About the Authors',
    citeHeading: 'Cite This Article',
    views: 'Views',
    downloads: 'PDF downloads',
    volumeIssue: 'Volume {volume}, Issue {number}',
    publishedOnline: 'Published online: {date}',
    citeLink: 'Cite this article',
    doiPending: 'DOI: pending',
    fullArticle: 'Full Article',
    authorsTab: 'Authors',
    inThisArticle: 'In this article',
    relatedHeading: 'More from this issue',
    viewIssue: 'View the full issue →',
    citeStyle: 'Citation style',
    citeExport: 'Export for reference managers:',
    downloadPdf: 'Download PDF',
    correction: 'Correction',
    correctionPolicyLink: 'Read our correction policy →',
    disclosure: 'Funding and conflicts of interest',
    share: 'Share',
    shareOnX: 'Share on X',
    shareOnFacebook: 'Share on Facebook',
    shareOnLinkedIn: 'Share on LinkedIn',
    shareOnWhatsApp: 'Share on WhatsApp',
    copyLink: 'Copy link',
    linkCopied: 'Link copied',
  },

  bookmarkButton: {
    signInAria: 'Sign in to bookmark this article',
    signInLabel: 'Sign in to bookmark',
    remove: 'Remove bookmark',
    add: 'Bookmark this article',
    bookmarked: 'Bookmarked',
    bookmark: 'Bookmark',
  },

  support: {
    heading: 'Support This Research',
    body: 'Found this article valuable? Send a direct contribution to {authors}. {authorPercent}% goes to the author(s); Gulf Spectrum Journal (GoGMI) retains {platformPercent}% to sustain the platform.',
    fallbackAuthors: 'the author(s)',
    invalidEmail: 'Enter a valid email — Paystack sends your receipt there.',
    startFailed: 'Something went wrong starting the payment.',
    otherAmount: 'Other (GHS)',
    namePlaceholder: 'Your name (optional)',
    emailPlaceholder: 'Your email',
    redirecting: 'Redirecting to Paystack…',
    donate: 'Donate GHS {amount}',
    secure: "You'll complete payment on Paystack's secure page — we never see or store your card details.",
    thanks:
      "Thank you for your donation — we're confirming the payment now. It's usually instant; your receipt will come from Paystack directly.",
  },

  topics: {
    metaTitle: 'Topics',
    metaDescription:
      'Browse Gulf Spectrum Journal by topic — maritime security, blue economy, governance, capacity building, and more.',
    eyebrow: 'Browse by Subject',
    title: 'Topics',
    description:
      "Gulf Spectrum Journal covers the full scope of GoGMI's work, not maritime security alone. Browse articles by topic below.",
  },

  topic: {
    notFound: 'Topic not found',
    kicker: 'Topic',
    empty: 'No articles published under this topic yet. Browse {topicsLink} or {issuesLink}.',
    allTopicsLink: 'all topics',
    allIssuesLink: 'all issues',
    back: '← All topics',
  },

  authors: {
    empty: 'Contributor profiles will appear here once the first articles are published.',
    metaTitle: 'Authors',
    metaDescription:
      'Meet the naval officers, researchers, and legal practitioners contributing to Gulf Spectrum Journal.',
    eyebrow: 'Contributors',
    title: 'Authors',
    description:
      "Gulf Spectrum Journal's contributors are naval and coast guard officers, university researchers, legal practitioners, and other subject-matter experts from Ghana and partner countries.",
  },

  author: {
    notFound: 'Author not found',
    articles: 'Articles',
    biography: 'Biography',
    back: '← All authors',
    isThisYou: 'Is this you? {link}.',
    signInToClaim: 'Sign in to claim this profile',
    claimProfile: 'Claim this profile',
  },

  claim: {
    metaTitle: 'Claim {name}',
    metaFallback: 'Claim Author Profile',
    eyebrow: 'Authors',
    title: 'Claim {name}',
    description: 'Link this author profile to your account.',
    signInPrompt: '{link} to claim this profile.',
    alreadyClaimed: 'This profile is already linked to an account.',
    alreadyLinked:
      "Your account is already linked to a different author profile. Contact the editorial office if that's a mistake.",
    pending:
      "Your claim on {name} is in with the editorial team for review. You'll see the profile linked to your account once it's approved.",
    intro:
      'Claiming {name} links this author profile to your account, so you can keep the bio, photo, and credentials up to date yourself.',
    messageLabel: 'Anything that helps confirm this is you (optional)',
    messagePlaceholder:
      'e.g. your institutional email, a link to your work, or how the editorial office can verify this.',
    submit: 'Submit Claim',
  },

  citations: {
    metaTitle: 'Citations',
    metaDescription: 'Ready-to-copy citations for every article published in Gulf Spectrum Journal.',
    featureCards: [
      {
        title: 'Citations',
        subtitle: 'Verified, APA-formatted',
        body: 'Author, issue, and journal data pulled directly from the article — no manual formatting.',
      },
      {
        title: 'References',
        subtitle: 'Every source cited',
        body: 'See what each article draws on — the full reference list is on every article page.',
      },
      {
        title: 'Topics',
        subtitle: 'Browse by subject',
        body: 'Filter citations by maritime security, governance, capacity building, and more.',
      },
    ],
    bottomFeatures: ['Every article indexed', 'APA formatted, automatically', 'Copy in one click'],
    heroPills: { topics: 'Topics', issues: 'Issues', authors: 'Authors' },
    kicker: 'Citation Index',
    heading: '{count} sources cited across {journal}',
    intro:
      'Every published article, fully referenced and ready to cite — generated from real author, issue, and journal data, not estimated.',
    browseIndex: 'Browse the Citation Index →',
    insideHeading: 'Inside the Citation Index',
    trackHeading: 'Track the corpus',
    trackBody: 'See total citations available, and how the corpus is growing issue by issue.',
    totalCitations: 'Total citations',
    articlesIndexed: 'Articles indexed',
    topicsCovered: 'Topics covered',
    colTopic: 'Topic',
    colArticles: 'Articles',
    whereHeading: 'See where citations land',
    whereBody:
      "Citations broken down by topic, so you can find what's been written on a given subject at a glance — and where the corpus is still thin.",
    trustLine:
      "Every citation on this page is generated from Gulf Spectrum Journal's own published data — no external scraping, no estimates.",
    exploreHeading: 'Explore Citations',
    ctaHeading: 'Support the research behind these citations',
    ctaBody:
      "Donate directly to an article's authors from its page — most of every contribution goes straight to the researchers who wrote it.",
    browseArticles: 'Browse Articles →',
    issueLabel: 'Issue {number} · {year}',
    viewArticle: 'View article →',
    empty: 'Citations will appear here once the first articles are published.',
  },

  contact: {
    metaTitle: 'Contact',
    metaDescription:
      'Contact the editorial office of Gulf Spectrum Journal, a publication of the Gulf of Guinea Maritime Institute.',
    eyebrow: 'Get in Touch',
    title: 'Contact',
    description: 'Questions about submissions, past issues, or partnership with Gulf Spectrum Journal.',
    office: 'Editorial Office',
    address: 'Address',
    addressValue: 'Gulf of Guinea Maritime Institute, Accra, Ghana',
    gogmiBody:
      'Gulf Spectrum Journal is published by the Gulf of Guinea Maritime Institute, a non-profit maritime think tank operating across the region.',
    visit: 'Visit gogmi.org.gh →',
    name: 'Name',
    subject: 'Subject',
    message: 'Message',
    send: 'Send Message',
    thanks: 'Thank you — your message has been sent to the editorial office.',
  },

  submissions: {
    metaTitle: 'Submission Guidelines',
    metaDescription: 'Guidance for prospective authors and co-authors submitting research to Gulf Spectrum Journal.',
    eyebrow: 'For Authors',
    title: 'Submission Guidelines',
    description:
      'Gulf Spectrum Journal welcomes original research from naval and coast guard officers, academics, legal practitioners, and other subject-matter experts working on Gulf of Guinea maritime affairs.',
    prepareHeading: 'What to Prepare',
    prepareIntro:
      "Each article requires the following structured fields. Citation style and word-count guidance are set by that issue's editorial board and will be confirmed with you at submission.",
    fields: [
      'Title',
      'Author(s) / co-author(s), each with a photo and institutional affiliation',
      'Abstract',
      'Keywords',
      'Body content with headed sections',
      'Conclusion',
      'A formatted list of references',
    ],
    workflowHeading: 'Editorial Workflow',
    workflow: [
      { title: 'Submit', body: 'Send your manuscript and author details through the submission form below.' },
      { title: 'Editorial Review', body: "That issue's editorial board reviews the submission for quality and rigor." },
      { title: 'Revisions', body: 'Authors address reviewer feedback as needed before the article is finalized.' },
      { title: 'Published', body: 'The article is published as part of its themed issue, with full author credit.' },
    ],
    coauthorHeading: 'Co-Authorship',
    coauthorBody:
      'Articles with multiple contributors are welcome and common in this journal. Please provide a name, photograph, and institutional affiliation for every co-author at submission.',
    referencingHeading: 'Referencing',
    referencingBody:
      "Reference style is set per issue by that issue's editorial board. Submit your reference list in the format used by your discipline; the editorial board will confirm the final house style during review.",
    formHeading: 'Start Your Submission',
    titleLabel: 'Proposed article title',
    abstractLabel: 'Abstract (draft)',
    manuscriptLabel: 'Manuscript (optional)',
    manuscriptHint: 'Word, PDF, OpenDocument or RTF, up to {max} MB.',
    manuscriptWrongType: 'Attach a Word, PDF, OpenDocument or RTF file.',
    manuscriptTooLarge: 'That file is too large — the limit is {max} MB.',
    manuscriptUploading: 'Uploading manuscript…',
    manuscriptUploadFailed: 'The manuscript could not be uploaded. Please try again.',
    submit: 'Submit for Review',
    thanks: 'Thank you — your proposal has been sent to the editorial office for review.',
  },

  board: {
    metaTitle: 'Editorial Board',
    metaDescription: "Meet Gulf Spectrum Journal's current editorial board.",
    title: 'Editorial Board',
    description: "The editors who review and publish Gulf Spectrum Journal's research.",
    empty: 'No editorial board members are listed yet.',
    joinHeading: 'Interested in joining?',
    joinBody:
      'Gulf Spectrum Journal periodically brings on new editorial board members from among its registered readers and contributors.',
    apply: 'Apply for the editorial board →',
  },

  boardApply: {
    metaTitle: 'Apply for the Editorial Board',
    metaDescription: 'Apply to join the Gulf Spectrum Journal editorial board.',
    eyebrow: 'Editorial Board',
    title: 'Apply for the Editorial Board',
    description: "Applications are reviewed by Gulf Spectrum Journal's admin team.",
    signInPrompt: '{link} to apply — editorial board members must hold an account on the platform.',
    alreadyMember: "You're already on the editorial board, as {title}.",
    pending: "Your application is in with the admin team{submitted}. You'll see your board title appear on your account once it's reviewed.",
    submittedOn: ', submitted {date}',
    declined: "Your previous application wasn't accepted. You're welcome to apply again below.",
    statementLabel: 'Why would you like to join the editorial board?',
    statementPlaceholder:
      "Your background, relevant experience, and what you'd bring to reviewing and publishing Gulf Spectrum Journal's research.",
    submit: 'Submit Application',
  },

  search: {
    metaTitle: 'Search',
    metaTitleQuery: 'Search: {query}',
    metaDescription: 'Search results for "{query}" across Gulf Spectrum Journal.',
    eyebrow: 'Search',
    title: 'Search',
    resultsFor: 'Results for “{query}”',
    found: {
      one: '{count} article found across titles, abstracts, keywords, and authors.',
      other: '{count} articles found across titles, abstracts, keywords, and authors.',
    },
    prompt: 'Enter a search term to find articles by title, abstract, keyword, or author.',
    noResults: 'No articles matched “{query}.” Try a different term, or browse {link}.',
    allIssues: 'all issues',
  },

  tools: {
    metaTitle: 'Tools',
    metaDescription: 'Search, citations, bookmarks, and other tools for working with Gulf Spectrum Journal.',
    title: 'Tools',
    description: 'Everything for working with Gulf Spectrum Journal in one place.',
    searchTitle: 'Search',
    searchBody: 'Find articles by title, abstract, keyword, or author.',
    citationsTitle: 'Citations',
    citationsBody: 'Copy a ready-made citation for any published article.',
    bookmarksTitle: 'Bookmarks',
    bookmarksBody: { one: '{count} saved article in your account.', other: '{count} saved articles in your account.' },
    uploadTitle: 'Upload / Submit',
    uploadBody: 'Start a submission for a future issue.',
    analyticsTitle: 'Analytics',
    analyticsBody: 'Readership and engagement across the journal.',
  },

  analytics: {
    metaTitle: 'Analytics',
    metaDescription: 'Readership analytics for Gulf Spectrum Journal.',
    title: 'Analytics',
    tabOverview: 'Overview',
    tabPapers: 'Papers',
    tabTopics: 'Topics',
    tabAuthors: 'Authors',
    days30: '30 Days',
    days60: '60 Days',
    exportCsv: 'Export as CSV',
    engagement: 'Article Engagement',
    chartLabel: 'Article views and downloads over time',
    periodViews: '{days}-day Views',
    periodDownloads: '{days}-day Downloads',
    allTimeViews: 'All-time Views',
    allTimeDownloads: 'All-time Downloads',
    colTopic: 'Topic',
    colArticles: 'Articles',
    colAuthor: 'Author',
    colTitle: 'Title',
    footnote:
      "Views and PDF downloads are counted from real visits to each article page, starting from when each kind of tracking was added — figures will be low or zero for anything before that.",
  },

  dashboard: {
    metaTitle: 'Dashboard',
    metaDescription: 'Your Gulf Spectrum Journal dashboard.',
    shareCta: 'Share your research with other Gulf of Guinea maritime professionals →',
    recent: 'Recent Articles',
    submitNew: 'Submit New Article',
    empty: 'No articles have been published yet.',
  },

  bookmarks: {
    metaTitle: 'Bookmarks',
    metaDescription: 'Articles you have bookmarked on Gulf Spectrum Journal.',
    eyebrow: 'Your Reading List',
    title: 'Bookmarks',
    description: 'Saved to your account — sign in to see them on any device.',
    signInPrompt: "{link} to see your bookmarks — they're saved to your account now, not just this browser.",
    loading: 'Loading your bookmarks…',
    empty: 'No bookmarks yet. Open any article and tap the bookmark icon to save it here. Browse {link} to get started.',
    emptyLink: 'articles and issues',
  },

  signIn: {
    metaTitle: 'Sign In',
    metaDescription: 'Sign in to your Gulf Spectrum Journal account.',
    title: 'Sign In',
    description: 'Sign in to bookmark articles, message other members, and access your dashboard.',
    passwordTab: 'Password',
    codeTab: 'Email code',
    forgot: 'Forgot password?',
    submitting: 'Signing in…',
    newHere: 'New here? {link}',
    createAccount: 'Create an account',
    google: 'Continue with Google',
    oauthFailed: 'Signing in with Google didn’t complete. Please try again, or sign in with your email below.',
  },

  signUp: {
    metaTitle: 'Create Account',
    metaDescription: 'Create a free Gulf Spectrum Journal account to bookmark articles and access your dashboard.',
    title: 'Create Account',
    description: 'Free — lets you bookmark articles, message other members, and access your dashboard.',
    minLength: 'At least 8 characters.',
    submitting: 'Creating account…',
    submit: 'Create Account',
    haveAccount: 'Already have an account? {link}',
    noPassword: 'Prefer not to set a password? {link}',
    emailedCode: 'Get an emailed code instead',
  },

  otp: {
    sentTo: "We sent a 6-digit code to {email}. It's valid for a few minutes.",
    code: 'Code',
    verifying: 'Verifying…',
    verify: 'Verify & Sign In',
    different: 'Use a different email or resend',
    hint: "No password needed — we'll email you a code. New here? This creates your account too.",
    request: 'Email Me a Code',
  },

  resetPassword: {
    metaTitle: 'Reset Password',
    metaDescription: 'Reset your Gulf Spectrum Journal account password.',
    title: 'Reset Password',
    description: "We'll email you a link to get back in.",
    sent: 'If an account exists for {email}, a password reset link is on its way. Check your inbox — the link signs you in and takes you straight to where you can set a new password.',
    submit: 'Send Reset Link',
    back: '← Back to sign in',
  },

  profile: {
    metaTitle: 'My Profile',
    metaDescription: 'Manage your Gulf Spectrum Journal account.',
    title: 'My Profile',
    description: 'Your name and account details.',
    loading: 'Loading your profile…',
    signInPrompt: '{link} to view your profile.',
    saved: 'Saved.',
    emailNote: "Changing your email isn't available yet.",
    save: 'Save changes',
    accountType: 'Account type',
    memberSince: 'Member since',
    viewAuthor: 'View your author profile and published articles →',
    roles: { reader: 'Reader', author: 'Author', editor: 'Editor', admin: 'Admin' },
  },

  messages: {
    metaTitle: 'Messages',
    metaDescription: 'Private messages with other Gulf Spectrum Journal members.',
    eyebrow: 'Direct Messages',
    title: 'Messages',
    description: 'Private conversations between members — only you and the other person can ever see them.',
    unnamed: 'Unnamed reader',
    signInPrompt: '{link} to send and receive messages.',
    searchPlaceholder: 'Search members by name…',
    closeSearch: 'Close search',
    searching: 'Searching…',
    noMembers: 'No members found.',
    newMessage: 'New Message',
    empty: 'No conversations yet. Use “New Message” to find another member.',
    selectPrompt: 'Select a conversation, or start a new one.',
    back: '← Back',
    typePlaceholder: 'Type a message…',
    send: 'Send message',
  },

  notifications: {
    metaTitle: 'Notifications',
    metaDescription: 'Updates on new issues and articles from Gulf Spectrum Journal.',
    eyebrow: 'Updates',
    title: 'Notifications',
    description:
      "New issues, and new articles in topics you've bookmarked from. Generated automatically when the journal actually publishes something — not a general inbox.",
    loading: 'Loading your notifications…',
    signInPrompt: '{link} to see your notifications.',
    empty:
      "No notifications yet. You'll see one here when a new issue is published, or when a new article appears in a topic you've bookmarked from.",
    markAll: 'Mark all as read',
    newIssue: 'New issue published: {theme}',
    newArticle: 'New article in a topic you follow: {title}',
    update: 'Update',
    unread: 'Unread',
  },

  accountSettings: {
    metaTitle: 'Account Settings',
    metaDescription: 'Manage your password, sessions, and account.',
    title: 'Account Settings',
    description: 'Password, sessions, and account deletion.',
    signInPrompt: '{link} to manage your account settings.',
    tooShort: 'Password must be at least 8 characters.',
    mismatch: 'Passwords do not match.',
    changePassword: 'Change Password',
    changePasswordBody: 'If you signed up with Google, this sets a password you can also use to sign in directly.',
    passwordUpdated: 'Password updated.',
    newPassword: 'New password',
    confirmPassword: 'Confirm new password',
    updatePassword: 'Update Password',
    codeIntro: 'For your security, we emailed a 6-digit code to {email}. Enter it to confirm the password change.',
    confirmChange: 'Confirm & Update Password',
    resendCode: 'Resend code',
    cancelChange: 'Cancel',
    sessions: 'Sessions',
    sessionsBody: 'Sign out everywhere if you think another device or browser still has you signed in.',
    signingOut: 'Signing out…',
    signOutEverywhere: 'Sign Out Everywhere',
    emailHeading: 'Email Notifications',
    emailBody: 'Occasional emails from the journal. Notifications on the site itself are not affected.',
    emailNewIssue: 'Email me when a new issue is published',
    emailFailed: 'Could not save your email preference.',
    deleteHeading: 'Delete Account',
    deleteBody:
      'Permanently deletes your account, profile, bookmarks, messages, and notifications. This cannot be undone.',
    confirmLabel: 'Type {email} to confirm',
    confirmMismatch: 'Type your account email exactly to confirm.',
    deleteFailed: 'Failed to delete account.',
    deleting: 'Deleting…',
    deleteButton: 'Permanently Delete My Account',
  },

  correctionPolicy: {
    metaTitle: 'Correction Policy',
    metaDescription: 'How Gulf Spectrum Journal corrects errors in published articles, and how to report one.',
    eyebrow: 'Editorial Standards',
    title: 'Correction Policy',
    description: 'How we handle errors in published articles, and how to report one.',
    // {email} is the editorial office's address (lib/staticContent.ts).
    sections: [
      {
        heading: 'Our commitment',
        body: 'Gulf Spectrum Journal corrects errors in published articles promptly and openly. The published record should be accurate, and readers should always be able to see when an article has been changed and why.',
      },
      {
        heading: 'Minor corrections',
        body: 'Spelling, punctuation and formatting errors that do not affect the meaning of an article are corrected without a notice.',
      },
      {
        heading: 'Corrections that affect meaning',
        body: 'When an error affects an article’s meaning, data, attribution or conclusions, the article is corrected and a dated correction notice describing the change is displayed at the top of the article and in its PDF.',
      },
      {
        heading: 'Retractions',
        body: 'If an article’s findings are found to be fundamentally unreliable, or there is evidence of plagiarism, fabricated data or other serious misconduct, the editorial board may retract it. A retracted article remains on the site with a notice explaining the retraction, so the record stays complete.',
      },
      {
        heading: 'Reporting an error',
        body: 'Readers and authors can report a suspected error to the editorial office at {email}, or through the Contact page. Please include the article’s title and a description of the error. The editorial board reviews every report and, wherever possible, consults the authors before deciding what action to take.',
      },
    ],
  },

  notFound: {
    title: 'Page Not Found',
    body: "The page you're looking for has drifted off course. Let's get you back on course.",
    home: 'Return Home',
  },
}

export type Dictionary = typeof en
export default en
