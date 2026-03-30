import { calculateWorkspacePricing } from "@cbideal/config/pricing"

export const workspace = {
  tenantId: "cbi-deal-demo",
  workspaceName: "CBI Deal Platform",
  appHost: "app.cbideal.nl",
  internalSeats: 14,
  externalAccounts: 46,
  allowsCustomBranding: true,
  allowsClientSpecificWorkflows: true,
}

export const pricingSnapshot = calculateWorkspacePricing(
  workspace.internalSeats,
  workspace.externalAccounts,
)

export const dashboardMetrics = [
  {
    label: "Open enquiries",
    value: "84",
    note: "Investor and professional matters currently under active review.",
    trend: "+12 this week",
  },
  {
    label: "Active clients",
    value: "46",
    note: "Private clients, family offices, and professional relationships in motion.",
    trend: "8 onboarding",
  },
  {
    label: "Live cases",
    value: "27",
    note: "Applications and structured advisory matters currently being coordinated.",
    trend: "6 awaiting authority updates",
  },
  {
    label: "Document requests",
    value: "118",
    note: "Outstanding uploads, renewals, and due diligence follow-ups.",
    trend: "31 due this week",
  },
] as const

export const pipelineStages = [
  {
    label: "Initial review",
    count: 24,
    items: [
      { name: "R. Al Mansoori", focus: "Portugal residence planning", owner: "Maha A." },
      { name: "A. Elshazly", focus: "Second citizenship shortlist", owner: "Sami K." },
      { name: "Apex Trustees", focus: "Professional relationship review", owner: "Nour H." },
    ],
  },
  {
    label: "Private consultation",
    count: 18,
    items: [
      { name: "K. Al Farsi", focus: "Family relocation strategy", owner: "Maha A." },
      { name: "Westbridge Capital", focus: "Residency route comparison", owner: "Sami K." },
      { name: "M. Al Sabah", focus: "Grenada / Antigua comparison", owner: "Nour H." },
    ],
  },
  {
    label: "Awaiting documents",
    count: 11,
    items: [
      { name: "Noor Family Office", focus: "Source-of-funds pack", owner: "Nour H." },
      { name: "D. Hamed", focus: "Proof of address refresh", owner: "Maha A." },
      { name: "A. Rahman", focus: "Family civil records", owner: "Sami K." },
    ],
  },
  {
    label: "Paused",
    count: 7,
    items: [
      { name: "Al Zahra Partners", focus: "Timing under review", owner: "Maha A." },
      { name: "H. El Din", focus: "Jurisdiction reassessment", owner: "Sami K." },
    ],
  },
] as const

export const leads = [
  {
    id: "lead-uae-fo",
    name: "UAE family office",
    focus: "Portugal residence planning",
    region: "United Arab Emirates",
    status: "Initial review",
    owner: "Maha A.",
    budget: "EUR 500k+",
    timeline: "6 to 12 months",
  },
  {
    id: "lead-kw-investor",
    name: "Kuwait investor",
    focus: "Caribbean citizenship shortlist",
    region: "Kuwait",
    status: "Awaiting documents",
    owner: "Sami K.",
    budget: "USD 250k to 400k",
    timeline: "3 to 6 months",
  },
  {
    id: "lead-sa-founder",
    name: "Saudi founder",
    focus: "Strategic relocation",
    region: "Saudi Arabia",
    status: "Private consultation",
    owner: "Nour H.",
    budget: "EUR 1m+",
    timeline: "No immediate deadline",
  },
  {
    id: "lead-qa-family",
    name: "Qatar family",
    focus: "European residency comparison",
    region: "Qatar",
    status: "Research stage",
    owner: "Maha A.",
    budget: "EUR 350k to 600k",
    timeline: "6 to 12 months",
  },
] as const

export const clients = [
  {
    id: "al-noor-holdings",
    name: "Al Noor Holdings",
    type: "Family office",
    context: "Primary relationship",
    status: "Active",
    owner: "Maha A.",
    jurisdictionFocus: "Portugal, Malta",
    portalStatus: "Portal live",
    summary: "Long-horizon mobility and contingency planning for principals and dependants.",
  },
  {
    id: "a-rahman",
    name: "A. Rahman",
    type: "Private client",
    context: "Citizenship planning",
    status: "Active",
    owner: "Sami K.",
    jurisdictionFocus: "Dominica, Grenada",
    portalStatus: "Awaiting upload",
    summary: "Second citizenship planning with family inclusion and timing sensitivity.",
  },
  {
    id: "westbridge-capital",
    name: "Westbridge Capital",
    type: "Corporate client",
    context: "Residency advisory",
    status: "Onboarding",
    owner: "Nour H.",
    jurisdictionFocus: "Portugal, Greece",
    portalStatus: "Invitation sent",
    summary: "European residence options for senior principals and future client access.",
  },
  {
    id: "m-el-sayed",
    name: "M. El Sayed",
    type: "Private client",
    context: "Relocation strategy",
    status: "Review",
    owner: "Maha A.",
    jurisdictionFocus: "Antigua, Portugal",
    portalStatus: "Portal live",
    summary: "Cross-border family relocation with mixed citizenship and residence considerations.",
  },
] as const

export const clientDetails = {
  "al-noor-holdings": {
    id: "al-noor-holdings",
    name: "Al Noor Holdings",
    contact: "Private office contact",
    owner: "Maha A.",
    profileType: "Family office",
    region: "Dubai, UAE",
    status: "Active",
    applicationStatus: "Strategy review complete",
    summary:
      "Long-horizon residence planning and contingency structuring for principals, spouse, and two dependants.",
    documents: [
      { name: "Principal passport copies", status: "Received" },
      { name: "Source-of-funds overview", status: "In review" },
      { name: "Portuguese tax memo", status: "Requested" },
    ],
    timeline: [
      { step: "Initial review", status: "Complete" },
      { step: "Jurisdiction comparison", status: "Complete" },
      { step: "Licensed provider coordination", status: "Current" },
      { step: "Submission readiness", status: "Upcoming" },
    ],
    notes: [
      "Family office requested a narrower shortlist focused on residence quality and long-term European optionality.",
      "Source-of-funds memo due this week before provider hand-off.",
      "Client portal is active for secure document sharing.",
    ],
  },
  "a-rahman": {
    id: "a-rahman",
    name: "A. Rahman",
    contact: "Primary applicant",
    owner: "Sami K.",
    profileType: "Private client",
    region: "Kuwait City, Kuwait",
    status: "Active",
    applicationStatus: "Document collection",
    summary:
      "Direct citizenship comparison with spouse inclusion and a preference for cleaner timing and practical family administration.",
    documents: [
      { name: "Civil records", status: "Requested" },
      { name: "Bank reference", status: "Received" },
      { name: "Medical declarations", status: "Pending" },
    ],
    timeline: [
      { step: "Initial review", status: "Complete" },
      { step: "Programme shortlist", status: "Complete" },
      { step: "Document collection", status: "Current" },
      { step: "Submission readiness", status: "Upcoming" },
    ],
    notes: [
      "Client prefers a route that balances family inclusion with manageable economics.",
      "Awaiting final family documents before provider coordination.",
    ],
  },
  "westbridge-capital": {
    id: "westbridge-capital",
    name: "Westbridge Capital",
    contact: "Regional counsel",
    owner: "Nour H.",
    profileType: "Corporate client",
    region: "Doha, Qatar",
    status: "Onboarding",
    applicationStatus: "Portal invitation sent",
    summary:
      "Residence-led planning for senior principals and a later external account structure for shared file access.",
    documents: [
      { name: "Entity structure overview", status: "Received" },
      { name: "Principal profiles", status: "Requested" },
      { name: "Residence objectives memo", status: "In review" },
    ],
    timeline: [
      { step: "Initial review", status: "Complete" },
      { step: "Client onboarding", status: "Current" },
      { step: "Residence route comparison", status: "Upcoming" },
      { step: "Provider coordination", status: "Upcoming" },
    ],
    notes: [
      "Portal invitation sent to regional counsel and finance lead.",
      "Need to confirm which principals require external access.",
    ],
  },
  "m-el-sayed": {
    id: "m-el-sayed",
    name: "M. El Sayed",
    contact: "Principal applicant",
    owner: "Maha A.",
    profileType: "Private client",
    region: "Riyadh, Saudi Arabia",
    status: "Review",
    applicationStatus: "Jurisdiction reassessment",
    summary:
      "Mixed citizenship and residency planning with a preference for discretion and a slower decision cadence.",
    documents: [
      { name: "Passport copies", status: "Received" },
      { name: "Children's civil records", status: "Requested" },
      { name: "Residence planning note", status: "Pending" },
    ],
    timeline: [
      { step: "Initial review", status: "Complete" },
      { step: "Route comparison", status: "Current" },
      { step: "Provider coordination", status: "Upcoming" },
      { step: "Submission readiness", status: "Upcoming" },
    ],
    notes: [
      "Client requested a slower pace while family timing is reassessed.",
      "Potential switch from direct citizenship focus to residence-led structure.",
    ],
  },
} as const

export const cases = [
  {
    id: "case-2041",
    route: "Portugal residence route",
    client: "Al Noor Holdings",
    stage: "Due diligence preparation",
    owner: "Maha A.",
    nextMilestone: "12 Apr 2026",
    progress: 72,
  },
  {
    id: "case-2034",
    route: "Dominica citizenship route",
    client: "A. Rahman",
    stage: "Government review",
    owner: "Sami K.",
    nextMilestone: "07 Apr 2026",
    progress: 84,
  },
  {
    id: "case-2028",
    route: "Family residence structure",
    client: "Westbridge Capital",
    stage: "Document collection",
    owner: "Nour H.",
    nextMilestone: "02 Apr 2026",
    progress: 48,
  },
  {
    id: "case-2017",
    route: "Strategic relocation",
    client: "M. El Sayed",
    stage: "Jurisdiction comparison",
    owner: "Maha A.",
    nextMilestone: "31 Mar 2026",
    progress: 38,
  },
] as const

export const documents = [
  {
    name: "Passport copy",
    caseId: "case-2041",
    status: "Awaiting upload",
    origin: "Client",
    updatedAt: "Today",
  },
  {
    name: "Proof of funds",
    caseId: "case-2034",
    status: "In review",
    origin: "Advisory",
    updatedAt: "Yesterday",
  },
  {
    name: "Birth certificates",
    caseId: "case-2028",
    status: "Requested",
    origin: "Client",
    updatedAt: "2 days ago",
  },
  {
    name: "Company records",
    caseId: "case-2017",
    status: "Received",
    origin: "Client",
    updatedAt: "Today",
  },
] as const

export const tasks = [
  {
    name: "Review Portugal file summary",
    priority: "High",
    due: "Today",
    owner: "Maha A.",
    status: "In progress",
  },
  {
    name: "Confirm due diligence documents",
    priority: "Medium",
    due: "Tomorrow",
    owner: "Nour H.",
    status: "Waiting on client",
  },
  {
    name: "Prepare client update note",
    priority: "Medium",
    due: "02 Apr",
    owner: "Sami K.",
    status: "Scheduled",
  },
  {
    name: "Check external account access",
    priority: "Low",
    due: "03 Apr",
    owner: "Admin",
    status: "Queued",
  },
] as const

export const team = [
  {
    name: "Maha A.",
    role: "Workspace owner",
    function: "Advisory",
    load: "14 live matters",
    seatType: "Internal seat",
  },
  {
    name: "Nour H.",
    role: "Case coordinator",
    function: "Operations",
    load: "11 live matters",
    seatType: "Internal seat",
  },
  {
    name: "Sami K.",
    role: "Relationship manager",
    function: "Client care",
    load: "19 active clients",
    seatType: "Internal seat",
  },
  {
    name: "Portal reviewer",
    role: "Client services",
    function: "External access",
    load: "Shared oversight",
    seatType: "Client-facing support",
  },
] as const

export const portalSnapshot = {
  applicant: "A. Rahman",
  route: "Dominica citizenship route",
  progress: 68,
  currentStage: "Document collection",
  nextStep: "Upload remaining family civil records",
  documents: [
    { name: "Passport copy", status: "Received" },
    { name: "Birth certificate", status: "Requested" },
    { name: "Proof of address", status: "Received" },
  ],
  updates: [
    "Your file review is complete and the route shortlist has been confirmed.",
    "Two family records are still needed before submission readiness can be assessed.",
    "A private update note is scheduled once the final uploads arrive.",
  ],
} as const
