// Placeholder content — structure follows the Gulf Spectrum Journal Website
// Development Brief (Issue No. 1 description). Author names, affiliations and
// article text below are illustrative placeholders, not the real Issue No. 1
// content. Swap in the real PDF content before launch.

// Real GoGMI membership tiers, sourced from GoGMI-Membership-2026.pdf.
export const membershipTiers = [
  {
    slug: 'student',
    name: 'Student Membership',
    price: 'USD 20/year',
    audience: 'Designed for undergraduate and postgraduate students with an interest in maritime, ocean, environmental, and security studies.',
    benefits: [
      'Official Certificate of Membership',
      'Access to GoGMI research reports and publications',
      'Invitations to student-focused webinars and seminars',
      'Discounted fees for GoGMI trainings and workshops',
      'Structured mentorship opportunities with professionals and researchers',
      'Career development support (research skills, writing clinics, CV guidance)',
      'Access to student networking platforms and discussion groups',
      'Opportunities to volunteer or intern on GoGMI projects',
    ],
  },
  {
    slug: 'associate',
    name: 'Associate Membership',
    subtitle: 'Early Career',
    price: 'USD 100/year',
    audience: 'For early-career professionals (1–5 years of experience) seeking skills development, visibility, and networking.',
    benefits: [
      'Official Certificate of Membership',
      'Invitations to GoGMI conferences, seminars, and policy dialogues',
      'Discounted access to professional training and workshops',
      'Access to research reports, briefs, and policy publications',
      'Career development programmes and capacity-building sessions',
      'Opportunities to contribute to GoGMI blogs, research outputs, and junior committees',
      'Networking with regional and international maritime professionals',
      'Early access to GoGMI fellowships and project calls',
      'Exclusive Member Newsletter',
      'Institutional representation at select engagements',
    ],
    featured: true,
  },
  {
    slug: 'professional',
    name: 'Professional Membership',
    subtitle: "5–10 Years' Experience",
    price: 'USD 200/year',
    audience: 'For mid-level professionals seeking influence, policy engagement, and regional visibility.',
    benefits: [
      'Official Certificate of Membership',
      'Priority invitations to policy dialogues and expert roundtables',
      'Access to GoGMI research outputs and policy briefs',
      'Discounted access to advanced trainings and conferences',
      'Opportunity to moderate sessions or speak at GoGMI events',
      'Opportunity to mentor young graduates interested in maritime affairs',
      'Professional profile listing on the GoGMI website',
      'Executive networking with regional experts and institutions',
      'Exclusive Member Newsletter',
    ],
  },
  {
    slug: 'fellow',
    name: 'Fellow Membership',
    subtitle: 'Senior Experts',
    price: 'By Invitation Only',
    audience: 'For senior professionals and experts contributing to maritime research, policy, and governance.',
    benefits: [
      'Official Certificate of Fellowship',
      'Priority invitations to policy dialogues and expert roundtables',
      'Participation and leadership in policy working groups',
      'Opportunity to moderate sessions or speak at GoGMI events',
      'Opportunity to mentor young graduates interested in maritime affairs',
      'Recognition as a GoGMI Fellow (website and publications)',
      'Engagement in strategic advisory and maritime security discussions',
      'Exclusive Member Newsletter',
      'Institutional representation at select engagements',
    ],
  },
  {
    slug: 'institution',
    name: 'Institution Membership',
    price: 'USD 2,000/year',
    audience: 'For universities, research centres, and think tanks.',
    benefits: [
      'Official Institutional Membership Certificate',
      'Access to GoGMI membership benefits for nominated staff and students',
      'Joint research, training, and capacity-building programmes',
      'Co-branded research outputs and policy publications',
      'Opportunities for joint grant proposals and funded projects',
      'Priority consideration for institutional partnerships and programmes',
      'Institutional visibility on GoGMI platforms',
    ],
  },
  {
    slug: 'corporate',
    name: 'Corporate Membership',
    price: 'USD 4,000/year',
    audience: 'For private sector organisations operating in maritime, logistics, energy, security, and related sectors.',
    benefits: [
      'Official Corporate Membership Certificate',
      'Corporate branding and visibility at GoGMI website, social media, events, and publications',
      'Invitations to high-level advisory events and stakeholder dialogues',
      'Access to customised briefings on maritime and ocean governance issues',
      'Networking with local, regional, and international partners',
      'Opportunities to align CSR initiatives with GoGMI programmes',
    ],
  },
  {
    slug: 'strategic-partner',
    name: 'Strategic Partner',
    price: 'By Invitation Only',
    audience: 'For organisations with long-term strategic alignment with the GoGMI mission.',
    benefits: [
      'Recognition as a GoGMI Strategic Partner',
      'Co-creation and implementation of flagship initiatives',
      'Engagement in strategic planning and policy influence',
      'Priority collaboration on regional and international programmes',
      'Corporate branding and visibility at GoGMI website, social media, events, and publications',
    ],
  },
]

export const journal = {
  name: 'Gulf Spectrum Journal',
  subtitle: 'A Publication of the Gulf of Guinea Maritime Institute',
  publisher: 'Gulf of Guinea Maritime Institute (GoGMI)',
  domain: 'www.gulfspectrumjournal.com',
  founded: 2025,
  issn: 'ISSN pending',
  frequency: 'Published annually, in themed volumes',
  aboutText: `Gulf Spectrum Journal is the research journal of the Gulf of Guinea Maritime
Institute (GoGMI), publishing locally produced, insider perspectives on maritime
governance, safety, and security in the Gulf of Guinea. Its mission is to give
stakeholders across the region and beyond a credible, consolidated platform for
research produced by the officers, researchers, and practitioners who work on
these issues directly — as an alternative to research about the region produced
elsewhere.

Each volume is reviewed by a dedicated editorial board of subject-matter experts,
who set that volume's citation style and word-count guidance and oversee the
quality and rigor of its content before publication. The journal supports GoGMI's
wider advocacy and capacity-building work across its four core areas: Research,
Advocacy, Capacity Building, and Consultancy — including flagship initiatives
such as the International Maritime Security Working Group (IMSWG) and the WYTEC
Blue programme for women and youth in the blue economy.`,
  scopeAreas: [
    'Maritime security',
    'Blue economy development',
    'Regional cooperation and governance in the Gulf of Guinea',
    "Capacity building, including youth and women's participation in the blue economy",
    'Consultancy insights and case studies, where suitable for public release',
    'Broader Gulf of Guinea and West African maritime affairs',
  ],
  editorialBoard: [
    { name: 'Rear Admiral (Rtd) E. K. Ansah', role: 'Editor-in-Chief', affiliation: 'Gulf of Guinea Maritime Institute' },
    { name: 'Prof. Adjoa Mensimah Kufuor', role: 'Deputy Editor', affiliation: 'University of Ghana, Faculty of Law' },
    { name: 'Dr. Comfort Adjei-Mensah', role: 'Editorial Board Member', affiliation: 'Institute for Security Studies' },
    { name: 'Capt. Ibrahim Diallo', role: 'Editorial Board Member', affiliation: 'Regional Maritime University' },
  ],
}

export const authors = [
  {
    slug: 'kwabena-owusu',
    name: 'Lt. Cdr. Kwabena Owusu',
    credentials: 'Ghana Navy',
    affiliation: 'Ghana Navy, Fleet Operations',
    bio: 'Lt. Cdr. Owusu serves in fleet operations with the Ghana Navy, with a focus on maritime domain awareness and interagency coordination in the Gulf of Guinea.',
    photo: null,
  },
  {
    slug: 'ama-serwaa-boateng',
    name: 'Dr. Ama Serwaa Boateng',
    credentials: 'PhD, International Relations',
    affiliation: 'University of Ghana, Legon',
    bio: 'Dr. Boateng researches regional security cooperation in West Africa, with recent work on Gulf of Guinea governance frameworks.',
    photo: null,
  },
  {
    slug: 'yaw-antwi-danso',
    name: 'Cdr. Yaw Antwi-Danso',
    credentials: 'Ghana Navy',
    affiliation: 'Ghana Navy, Coast Guard Command',
    bio: 'Cdr. Antwi-Danso leads coast guard coordination initiatives and has represented Ghana in regional maritime security exercises.',
    photo: null,
  },
  {
    slug: 'efua-mensah',
    name: 'Sub-Lt. Efua Mensah',
    credentials: 'Ghana Navy',
    affiliation: 'Ghana Navy, Coast Guard Command',
    bio: 'Sub-Lt. Mensah works on interagency coordination between naval and civilian maritime authorities.',
    photo: null,
  },
  {
    slug: 'nana-akosua-frimpong',
    name: 'Nana Akosua Frimpong',
    credentials: 'Barrister-at-Law',
    affiliation: 'Maritime & Admiralty Law Chambers, Accra',
    bio: 'Nana Akosua Frimpong practices maritime and admiralty law, with a focus on the prosecution of piracy and armed robbery at sea under domestic and regional frameworks.',
    photo: null,
  },
  {
    slug: 'kojo-adjei',
    name: 'Dr. Kojo Adjei',
    credentials: 'PhD, Law',
    affiliation: 'University of Cape Coast',
    bio: 'Dr. Adjei teaches and researches maritime law, focusing on jurisdictional questions in Gulf of Guinea piracy prosecutions.',
    photo: null,
  },
  {
    slug: 'comfort-adjei-mensah',
    name: 'Dr. Comfort Adjei-Mensah',
    credentials: 'PhD, Security Studies',
    affiliation: 'Institute for Security Studies',
    bio: 'Dr. Adjei-Mensah studies the balance between external naval partnerships and regional ownership of maritime security in West Africa.',
    photo: null,
  },
  {
    slug: 'effiong-bassey',
    name: 'Lt. Cdr. Effiong Bassey',
    credentials: 'Nigerian Navy',
    affiliation: 'Nigerian Navy, Maritime Security Operations',
    bio: 'Lt. Cdr. Bassey has served in multiple regional maritime security operations across the Gulf of Guinea.',
    photo: null,
  },
  {
    slug: 'patricia-nyarko',
    name: 'Cdr. Patricia Nyarko',
    credentials: 'Ghana Navy',
    affiliation: 'Ghana Navy, Information Fusion Centre',
    bio: 'Cdr. Nyarko works on maritime information-sharing systems, including the Yaoundé Architecture for regional coordination.',
    photo: null,
  },
  {
    slug: 'ibrahim-diallo',
    name: 'Capt. Ibrahim Diallo',
    credentials: 'PhD, Maritime Studies',
    affiliation: 'Regional Maritime University',
    bio: 'Capt. Diallo is a member of the journal’s editorial board and researches regional information-sharing architectures for maritime security.',
    photo: null,
  },
]

const authorBySlug = Object.fromEntries(authors.map((a) => [a.slug, a]))

// Topic catalogue — these mirror the journal's stated scope areas (see
// journal.scopeAreas above) so the site visibly isn't limited to maritime
// security alone, even though Issue No. 1's own theme is security-focused.
// Later issues covering other scope areas will fill out the thinner topics.
export const topics = [
  {
    slug: 'maritime-security',
    label: 'Maritime Security',
    description: 'Piracy, armed robbery at sea, naval and coast guard operations, and interventions across the Gulf of Guinea.',
  },
  {
    slug: 'blue-economy',
    label: 'Blue Economy',
    description: 'Fisheries, shipping, offshore resources, and sustainable development of the maritime economy.',
  },
  {
    slug: 'regional-governance',
    label: 'Regional Governance & Law',
    description: 'Regional cooperation frameworks, legal and regulatory questions, and maritime governance in the Gulf of Guinea.',
  },
  {
    slug: 'capacity-building',
    label: 'Capacity Building',
    description: "Institutional and interagency capacity, including youth and women's participation in the blue economy, linked to the WYTEC Blue programme.",
  },
  {
    slug: 'consultancy-case-studies',
    label: 'Consultancy & Case Studies',
    description: 'Applied case studies and consultancy insights suitable for public release.',
  },
  {
    slug: 'west-african-affairs',
    label: 'West African Affairs',
    description: 'Broader Gulf of Guinea and West African maritime affairs beyond a single theme or issue.',
  },
]

const topicBySlug = Object.fromEntries(topics.map((t) => [t.slug, t]))

export const issues = [
  {
    slug: 'issue-1',
    number: 1,
    volume: 1,
    year: 2025,
    coverImage: '/issue-1-cover.jpg',
    status: 'published',
    theme: 'Maritime Security Interventions in the Gulf of Guinea',
    publishedDate: 'November 2025',
    aboutThisVolume: `Issue No. 1 examines maritime security interventions in the Gulf of Guinea,
with particular attention to the role of external actors alongside regional and
national forces. The five articles in this volume were contributed by naval and
coast guard officers, university researchers, and legal practitioners from Ghana
and partner countries, and were reviewed by this volume's editorial board prior
to publication.`,
    editorialBoard: [
      { name: 'Rear Admiral (Rtd) E. K. Ansah', role: 'Chair, Issue Editorial Board' },
      { name: 'Prof. Adjoa Mensimah Kufuor', role: 'Member' },
      { name: 'Dr. Comfort Adjei-Mensah', role: 'Member' },
      { name: 'Capt. Ibrahim Diallo', role: 'Member' },
    ],
    articleSlugs: [
      'mapping-external-actors-gog',
      'coast-guard-interagency-coordination',
      'legal-frameworks-prosecuting-piracy',
      'external-naval-presence-regional-ownership',
      'information-sharing-yaounde-code',
    ],
  },
]

export const articles = [
  {
    slug: 'mapping-external-actors-gog',
    issueSlug: 'issue-1',
    topicSlug: 'maritime-security',
    title: 'Maritime Security Interventions in the Gulf of Guinea: Mapping the Role of External Actors',
    authorSlugs: ['kwabena-owusu', 'ama-serwaa-boateng'],
    abstract: `This article maps the range of external naval and institutional interventions
in Gulf of Guinea maritime security since 2015, from bilateral ship visits to
multinational exercises and capacity-building programmes. It argues that
interventions are most effective, and most durable, when they are built around
existing regional architectures such as the Yaoundé Code of Conduct rather than
run in parallel to them.`,
    keywords: ['Gulf of Guinea', 'maritime security', 'external actors', 'naval cooperation', 'Yaoundé Code of Conduct'],
    sections: [
      {
        heading: 'Introduction',
        body: `Piracy and armed robbery at sea in the Gulf of Guinea drew sustained
international naval attention through the late 2010s and early 2020s. This
attention has taken varied forms: bilateral port calls and training visits,
multinational task forces, and long-running capacity-building partnerships.
This article surveys that landscape and asks what distinguishes interventions
that strengthen regional capacity from those that risk substituting for it.`,
      },
      {
        heading: 'A Typology of External Engagement',
        body: `We distinguish three broad categories of external engagement in the region:
episodic naval presence (ship visits, joint patrols), structured capacity
building (training programmes, equipment transfers), and institutional support
(funding and technical assistance to regional bodies such as the Interregional
Coordination Centre). Each carries different implications for regional
ownership.`,
      },
      {
        heading: 'Alignment with Regional Architecture',
        body: `Interventions anchored to the Yaoundé Code of Conduct's reporting and
coordination structures showed greater continuity after the initiating
partner's political priorities shifted, compared to bilateral programmes run
outside that architecture.`,
      },
    ],
    conclusion: `External support remains important to Gulf of Guinea maritime security, but
its long-term value depends on how well it is threaded through existing
regional structures rather than run alongside them. Future interventions
should be evaluated in part by their contribution to regional institutional
capacity, not only by their immediate security effect.`,
    references: [
      'Bueger, C. (2021). Piracy Studies: Scholarly Responses to the Return of an Ancient Threat. Maritime Studies Review.',
      'Interregional Coordination Centre. (2023). Annual Report on Maritime Security in the Gulf of Guinea.',
      'Ukeje, C., & Ela, W. (2022). African Approaches to Maritime Security: The Gulf of Guinea. Institute for Security Studies.',
    ],
  },
  {
    slug: 'coast-guard-interagency-coordination',
    issueSlug: 'issue-1',
    topicSlug: 'capacity-building',
    title: 'Coast Guard Capacity and Interagency Coordination in Gulf of Guinea Maritime Security',
    authorSlugs: ['yaw-antwi-danso', 'efua-mensah'],
    abstract: `Drawing on operational experience within Ghana's coast guard command
structures, this article examines the practical obstacles to interagency
coordination between navies, fisheries authorities, customs, and port
authorities, and proposes a set of coordination practices adaptable to
partner countries in the region.`,
    keywords: ['coast guard', 'interagency coordination', 'maritime domain awareness', 'Ghana'],
    sections: [
      {
        heading: 'Introduction',
        body: `Maritime security incidents in the Gulf of Guinea rarely fall neatly under
a single agency's mandate. Effective response depends on coordination among
navies, coast guards, fisheries enforcement, customs, and port authorities —
agencies that often operate on different reporting lines, equipment
standards, and information systems.`,
      },
      {
        heading: 'Coordination Gaps in Practice',
        body: `Drawing on case reviews of incident response in Ghanaian waters, this
section identifies recurring points of friction: inconsistent vessel-tracking
data formats, unclear first-responder protocols, and gaps in real-time
communication between agencies during live incidents.`,
      },
      {
        heading: 'Toward a Shared Coordination Framework',
        body: `We propose a lightweight, shared incident-coordination protocol built on
existing regional information-sharing centres, requiring no new hardware
investment and adaptable to coast guard structures across partner states.`,
      },
    ],
    conclusion: `Interagency coordination, not additional platforms alone, is the binding
constraint on effective coast guard response in much of the Gulf of Guinea.
Low-cost coordination protocols, adopted consistently, can meaningfully
close this gap.`,
    references: [
      'Ghana Maritime Authority. (2022). National Maritime Security Strategy.',
      'International Maritime Organization. (2021). Guidelines on Interagency Cooperation in Maritime Security.',
    ],
  },
  {
    slug: 'legal-frameworks-prosecuting-piracy',
    issueSlug: 'issue-1',
    topicSlug: 'regional-governance',
    title: 'Legal Frameworks for Prosecuting Piracy and Armed Robbery at Sea in the Gulf of Guinea',
    authorSlugs: ['nana-akosua-frimpong', 'kojo-adjei'],
    abstract: `This article reviews the domestic legal frameworks available to Gulf of
Guinea states for prosecuting piracy and armed robbery at sea, identifies
jurisdictional gaps that have historically allowed suspects to be released
without charge, and recommends legislative and procedural reforms.`,
    keywords: ['maritime law', 'piracy prosecution', 'jurisdiction', 'armed robbery at sea'],
    sections: [
      {
        heading: 'Introduction',
        body: `Successful naval interdiction of piracy suspects has, in a number of
documented cases, not led to prosecution — largely because of unresolved
jurisdictional and evidentiary questions. This article examines the legal
frameworks in Ghana and selected partner states against that pattern.`,
      },
      {
        heading: 'Jurisdictional Gaps',
        body: `Several states in the region have not fully domesticated UNCLOS provisions
on piracy, creating ambiguity over which court has jurisdiction when an
incident occurs outside territorial waters but the suspects are landed
domestically.`,
      },
      {
        heading: 'Recommendations',
        body: `We recommend model legislation clarifying jurisdiction for offences
committed in the exclusive economic zone, alongside standardized
evidence-handling protocols for naval forces conducting interdictions.`,
      },
    ],
    conclusion: `Without clearer domestic legal frameworks, naval interdiction efforts in
the Gulf of Guinea will continue to outpace the region's capacity to
prosecute. Legal reform is as central to deterrence as naval capacity.`,
    references: [
      'United Nations Convention on the Law of the Sea (UNCLOS), 1982.',
      'Yaoundé Code of Conduct Concerning the Repression of Piracy, Armed Robbery against Ships, and Illicit Maritime Activity, 2013.',
      'Frimpong, N. A. (2020). Prosecuting Maritime Crime in West Africa: A Practitioner’s View. Ghana Law Journal.',
    ],
  },
  {
    slug: 'external-naval-presence-regional-ownership',
    issueSlug: 'issue-1',
    topicSlug: 'regional-governance',
    title: 'External Naval Presence and Regional Ownership: Balancing Partnership and Sovereignty in Gulf of Guinea Security',
    authorSlugs: ['comfort-adjei-mensah', 'effiong-bassey'],
    abstract: `This article examines the tension between welcoming external naval
partnership and preserving regional ownership of maritime security outcomes
in the Gulf of Guinea, drawing on interviews with regional naval officers
and policy documents from partner-country deployments.`,
    keywords: ['naval partnership', 'sovereignty', 'regional ownership', 'security cooperation'],
    sections: [
      {
        heading: 'Introduction',
        body: `External naval deployments to the Gulf of Guinea are generally welcomed by
regional states, but officers interviewed for this study consistently raised
concerns about long-term dependency and the risk that regional navies are
positioned as junior partners in operations conducted in their own waters.`,
      },
      {
        heading: 'Perspectives from Regional Officers',
        body: `Interviews with serving officers highlight a preference for partnership
models that transfer operational leadership to regional forces over time,
rather than open-ended external presence.`,
      },
      {
        heading: 'Principles for Balanced Partnership',
        body: `We propose a set of principles for structuring external naval partnerships
so that they build, rather than substitute for, regional operational
leadership.`,
      },
    ],
    conclusion: `Sustainable maritime security in the Gulf of Guinea requires external
partners to explicitly design for their own reduced role over time. Regional
ownership should be a stated objective of partnership programmes, not an
assumed byproduct.`,
    references: [
      'Ukeje, C. (2019). Whose Security? External Actors in Gulf of Guinea Maritime Governance.',
      'African Union. (2050). Africa’s Integrated Maritime Strategy (2050 AIM Strategy).',
    ],
  },
  {
    slug: 'information-sharing-yaounde-code',
    issueSlug: 'issue-1',
    topicSlug: 'maritime-security',
    title: 'Information Sharing Architectures and the Yaoundé Code of Conduct: Progress and Gaps',
    authorSlugs: ['patricia-nyarko', 'ibrahim-diallo'],
    abstract: `This article assesses progress in maritime information-sharing across
Gulf of Guinea states under the Yaoundé Architecture, identifying which
regional centres are receiving consistent reporting and where gaps remain,
and offers recommendations for closing them.`,
    keywords: ['information sharing', 'Yaoundé Architecture', 'maritime domain awareness', 'regional cooperation'],
    sections: [
      {
        heading: 'Introduction',
        body: `The Yaoundé Architecture established a network of regional and zonal
maritime information-sharing centres. A decade on, reporting consistency
varies significantly across member states and zones.`,
      },
      {
        heading: 'Reporting Consistency Across Zones',
        body: `Drawing on centre-level reporting data, this section identifies zones with
strong reporting discipline and those where reporting has lapsed, along with
plausible institutional and resourcing explanations for the gap.`,
      },
      {
        heading: 'Closing the Gaps',
        body: `We recommend standardized minimum reporting requirements tied to continued
regional and international funding eligibility, alongside shared technical
infrastructure to lower the reporting burden on smaller navies.`,
      },
    ],
    conclusion: `The Yaoundé Architecture's information-sharing promise is only partly
realized. Consistent reporting, not additional centres, is the priority for
the next phase of regional maritime domain awareness.`,
    references: [
      'Interregional Coordination Centre. (2023). Annual Report on Maritime Security in the Gulf of Guinea.',
      'Nyarko, P. (2021). Information Fusion in West African Maritime Security. Gulf Review.',
    ],
  },
]

export function getIssueBySlug(slug) {
  return issues.find((i) => i.slug === slug)
}

export function getArticleBySlug(slug) {
  return articles.find((a) => a.slug === slug)
}

export function getAuthorBySlug(slug) {
  return authorBySlug[slug]
}

export function getArticlesForIssue(issueSlug) {
  return articles.filter((a) => a.issueSlug === issueSlug)
}

export function getAuthorsForArticle(article) {
  return article.authorSlugs.map((s) => authorBySlug[s]).filter(Boolean)
}

export function getArticlesForAuthor(authorSlug) {
  return articles.filter((a) => a.authorSlugs.includes(authorSlug))
}

export function searchArticles(query) {
  const q = query.trim().toLowerCase()
  if (!q) return []

  return articles.filter((a) => {
    const authorNames = getAuthorsForArticle(a).map((au) => au.name).join(' ')
    const haystack = [a.title, a.abstract, ...a.keywords, authorNames].join(' ').toLowerCase()
    return haystack.includes(q)
  })
}

export function getIssueForArticle(article) {
  return issues.find((i) => i.slug === article.issueSlug)
}

export function getTopicBySlug(slug) {
  return topicBySlug[slug]
}

export function getTopicForArticle(article) {
  return topicBySlug[article.topicSlug]
}

export function getArticlesForTopic(topicSlug) {
  return articles.filter((a) => a.topicSlug === topicSlug)
}

// Placeholder split — GoGMI has not set an official rate. Shown to donors
// as an example; confirm the real figure before this goes live.
export const donationSplit = {
  authorPercent: 90,
  platformPercent: 10,
}
