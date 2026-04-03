import { calculateWorkspacePricing, saasAppHost } from "@cbideal/config"

export type InternalRole = "Workspace owner" | "Account manager" | "Case coordinator" | "Finance" | "Admin"
export type ClientRole = "Primary applicant" | "Family member" | "Family office contact" | "Counsel"
export type QuotationStatus = "Draft" | "Sent" | "Accepted" | "Partially Paid" | "Paid"
export type PaymentStageStatus =
  | "Upcoming"
  | "Due soon"
  | "Awaiting proof"
  | "Under review"
  | "Approved"
  | "Overdue"
  | "Rejected"
  | "Paid"
export type DocumentStatus = "Not Uploaded" | "Uploaded" | "Under Review" | "Approved" | "Rejected"
export type ReminderStatus = "Scheduled" | "Sent" | "Paused"
export type NotificationChannel = "Email" | "Workspace"

export const workspace = {
  tenantId: "cbi-deal-demo",
  workspaceName: "CBI Deal Platform",
  appHost: saasAppHost,
  firmName: "CBI Deal Advisory",
  internalSeats: 14,
  externalAccounts: 46,
  allowsCustomBranding: true,
  allowsClientSpecificWorkflows: true,
  currencies: ["EUR", "USD", "GBP"] as const,
}

export const pricingSnapshot = calculateWorkspacePricing(
  workspace.internalSeats,
  workspace.externalAccounts,
)

export const internalUsers = [
  {
    id: "usr-maha",
    name: "Maha A.",
    role: "Workspace owner" as InternalRole,
    function: "Advisory leadership",
    email: "maha@cbideal.com",
    load: "14 live matters",
    office: "Cyprus",
  },
  {
    id: "usr-sami",
    name: "Sami K.",
    role: "Account manager" as InternalRole,
    function: "Client relationships",
    email: "sami@cbideal.com",
    load: "19 active client relationships",
    office: "Dubai",
  },
  {
    id: "usr-nour",
    name: "Nour H.",
    role: "Case coordinator" as InternalRole,
    function: "Casework and documentation",
    email: "nour@cbideal.com",
    load: "11 submission tracks",
    office: "Cyprus",
  },
  {
    id: "usr-lina",
    name: "Lina F.",
    role: "Finance" as InternalRole,
    function: "Quotations and payments",
    email: "lina@cbideal.com",
    load: "27 active billing schedules",
    office: "Nicosia",
  },
  {
    id: "usr-admin",
    name: "Omar T.",
    role: "Admin" as InternalRole,
    function: "Workspace administration",
    email: "omar@cbideal.com",
    load: "Access controls and automations",
    office: "Remote",
  },
] as const

export const externalUsers = [
  {
    id: "ext-rahman",
    clientId: "a-rahman",
    name: "Ahmed Rahman",
    role: "Primary applicant" as ClientRole,
    email: "a.rahman@samplemail.com",
    portalStatus: "Portal live",
  },
  {
    id: "ext-noor",
    clientId: "al-noor-holdings",
    name: "Private office contact",
    role: "Family office contact" as ClientRole,
    email: "office@alnoor-demo.com",
    portalStatus: "Portal live",
  },
  {
    id: "ext-westbridge",
    clientId: "westbridge-capital",
    name: "Regional counsel",
    role: "Counsel" as ClientRole,
    email: "counsel@westbridge-demo.com",
    portalStatus: "Invitation sent",
  },
  {
    id: "ext-elsayed",
    clientId: "m-el-sayed",
    name: "M. El Sayed",
    role: "Primary applicant" as ClientRole,
    email: "m.elsayed@samplemail.com",
    portalStatus: "Portal live",
  },
] as const

export const clients = [
  {
    id: "al-noor-holdings",
    name: "Al Noor Holdings",
    type: "Family office",
    context: "Residence and contingency planning",
    status: "Active",
    owner: "Maha A.",
    ownerId: "usr-maha",
    jurisdictionFocus: "Portugal, Malta",
    portalStatus: "Portal live",
    summary: "Long-horizon residence planning and optionality for principals, spouse, and two dependants.",
    region: "Dubai, UAE",
    investmentRange: "EUR 500k+",
  },
  {
    id: "a-rahman",
    name: "Ahmed Rahman",
    type: "Private client",
    context: "Citizenship planning",
    status: "Active",
    owner: "Sami K.",
    ownerId: "usr-sami",
    jurisdictionFocus: "Dominica, Grenada",
    portalStatus: "Portal live",
    summary: "Second citizenship planning with spouse inclusion and timing sensitivity.",
    region: "Kuwait City, Kuwait",
    investmentRange: "USD 250k to 400k",
  },
  {
    id: "westbridge-capital",
    name: "Westbridge Capital",
    type: "Corporate client",
    context: "Residence advisory",
    status: "Onboarding",
    owner: "Nour H.",
    ownerId: "usr-nour",
    jurisdictionFocus: "Portugal, Greece",
    portalStatus: "Invitation sent",
    summary: "Residence-led planning for senior principals and a later client account structure for shared file access.",
    region: "Doha, Qatar",
    investmentRange: "EUR 800k+",
  },
  {
    id: "m-el-sayed",
    name: "M. El Sayed",
    type: "Private client",
    context: "Strategic relocation",
    status: "Review",
    owner: "Maha A.",
    ownerId: "usr-maha",
    jurisdictionFocus: "Antigua, Portugal",
    portalStatus: "Portal live",
    summary: "Cross-border family relocation with mixed citizenship and residence considerations.",
    region: "Riyadh, Saudi Arabia",
    investmentRange: "EUR 350k to 600k",
  },
] as const

export const cases = [
  {
    id: "case-2041",
    clientId: "al-noor-holdings",
    client: "Al Noor Holdings",
    route: "Portugal residence route",
    stage: "Due diligence preparation",
    owner: "Maha A.",
    ownerId: "usr-maha",
    nextMilestone: "12 Apr 2026",
    progress: 72,
    applicationStatus: "Strategy review complete",
    region: "Europe",
  },
  {
    id: "case-2034",
    clientId: "a-rahman",
    client: "Ahmed Rahman",
    route: "Dominica citizenship route",
    stage: "Government review",
    owner: "Sami K.",
    ownerId: "usr-sami",
    nextMilestone: "07 Apr 2026",
    progress: 84,
    applicationStatus: "Formal review",
    region: "Caribbean",
  },
  {
    id: "case-2028",
    clientId: "westbridge-capital",
    client: "Westbridge Capital",
    route: "European residence structure",
    stage: "Document collection",
    owner: "Nour H.",
    ownerId: "usr-nour",
    nextMilestone: "02 Apr 2026",
    progress: 48,
    applicationStatus: "Portal onboarding",
    region: "Europe",
  },
  {
    id: "case-2017",
    clientId: "m-el-sayed",
    client: "M. El Sayed",
    route: "Strategic relocation",
    stage: "Jurisdiction comparison",
    owner: "Maha A.",
    ownerId: "usr-maha",
    nextMilestone: "31 Mar 2026",
    progress: 38,
    applicationStatus: "Jurisdiction reassessment",
    region: "Caribbean and Europe",
  },
] as const

export const quotations = [
  {
    id: "quo-1001",
    caseId: "case-2034",
    clientId: "a-rahman",
    client: "Ahmed Rahman",
    status: "Partially Paid" as QuotationStatus,
    currency: "USD",
    quotationDate: "18 Mar 2026",
    validUntil: "08 Apr 2026",
    owner: "Sami K.",
    ownerId: "usr-sami",
    note: "Quotation covers principal applicant and spouse, with diligence handling and submission coordination.",
    serviceFees: [
      { label: "Advisory structuring and route review", amount: 9000 },
      { label: "Submission coordination", amount: 6500 },
    ],
    governmentFees: [
      { label: "Government contribution", amount: 200000 },
      { label: "Due diligence fees", amount: 12000 },
    ],
    optionalItems: [
      { label: "Certified translation pack", amount: 1450 },
      { label: "Expedited civil records coordination", amount: 950 },
    ],
  },
  {
    id: "quo-1002",
    caseId: "case-2041",
    clientId: "al-noor-holdings",
    client: "Al Noor Holdings",
    status: "Sent" as QuotationStatus,
    currency: "EUR",
    quotationDate: "21 Mar 2026",
    validUntil: "15 Apr 2026",
    owner: "Maha A.",
    ownerId: "usr-maha",
    note: "Fee schedule is staged against residence route preparation, family document management, and provider-side coordination.",
    serviceFees: [
      { label: "Residence route strategy", amount: 12000 },
      { label: "Family documentation management", amount: 4800 },
      { label: "Provider coordination", amount: 6200 },
    ],
    governmentFees: [
      { label: "Provider filing costs", amount: 18000 },
      { label: "Residence permit issuance", amount: 5600 },
    ],
    optionalItems: [{ label: "Tax residency briefing", amount: 3200 }],
  },
  {
    id: "quo-1003",
    caseId: "case-2028",
    clientId: "westbridge-capital",
    client: "Westbridge Capital",
    status: "Draft" as QuotationStatus,
    currency: "EUR",
    quotationDate: "28 Mar 2026",
    validUntil: "18 Apr 2026",
    owner: "Nour H.",
    ownerId: "usr-nour",
    note: "Draft quotation prepared for a two-principal residence structure with external portal access for counsel and finance.",
    serviceFees: [
      { label: "Residence planning workstream", amount: 14000 },
      { label: "Portal setup for client stakeholders", amount: 1800 },
    ],
    governmentFees: [{ label: "Indicative filing costs", amount: 9200 }],
    optionalItems: [{ label: "Board briefing pack", amount: 2100 }],
  },
  {
    id: "quo-1004",
    caseId: "case-2017",
    clientId: "m-el-sayed",
    client: "M. El Sayed",
    status: "Accepted" as QuotationStatus,
    currency: "EUR",
    quotationDate: "14 Mar 2026",
    validUntil: "02 Apr 2026",
    owner: "Maha A.",
    ownerId: "usr-maha",
    note: "Accepted quotation for route comparison, document readiness, and staged jurisdictional narrowing.",
    serviceFees: [
      { label: "Cross-jurisdiction comparison", amount: 7800 },
      { label: "Casework and document review", amount: 4200 },
    ],
    governmentFees: [{ label: "Indicative programme filing reserve", amount: 11000 }],
    optionalItems: [],
  },
] as const

export const paymentSchedules = [
  {
    id: "pay-rahman-1",
    quotationId: "quo-1001",
    caseId: "case-2034",
    clientId: "a-rahman",
    client: "Ahmed Rahman",
    label: "Initial advisory retainer",
    amount: 9000,
    currency: "USD",
    dueDate: "22 Mar 2026",
    status: "Approved" as PaymentStageStatus,
    assignedManager: "Sami K.",
    assignedManagerId: "usr-sami",
  },
  {
    id: "pay-rahman-2",
    quotationId: "quo-1001",
    caseId: "case-2034",
    clientId: "a-rahman",
    client: "Ahmed Rahman",
    label: "Government contribution stage",
    amount: 200000,
    currency: "USD",
    dueDate: "04 Apr 2026",
    status: "Awaiting proof" as PaymentStageStatus,
    assignedManager: "Sami K.",
    assignedManagerId: "usr-sami",
  },
  {
    id: "pay-noor-1",
    quotationId: "quo-1002",
    caseId: "case-2041",
    clientId: "al-noor-holdings",
    client: "Al Noor Holdings",
    label: "Residence strategy stage",
    amount: 12000,
    currency: "EUR",
    dueDate: "05 Apr 2026",
    status: "Due soon" as PaymentStageStatus,
    assignedManager: "Maha A.",
    assignedManagerId: "usr-maha",
  },
  {
    id: "pay-noor-2",
    quotationId: "quo-1002",
    caseId: "case-2041",
    clientId: "al-noor-holdings",
    client: "Al Noor Holdings",
    label: "Provider coordination stage",
    amount: 6200,
    currency: "EUR",
    dueDate: "19 Apr 2026",
    status: "Upcoming" as PaymentStageStatus,
    assignedManager: "Maha A.",
    assignedManagerId: "usr-maha",
  },
  {
    id: "pay-westbridge-1",
    quotationId: "quo-1003",
    caseId: "case-2028",
    clientId: "westbridge-capital",
    client: "Westbridge Capital",
    label: "Residence planning commencement",
    amount: 14000,
    currency: "EUR",
    dueDate: "12 Apr 2026",
    status: "Upcoming" as PaymentStageStatus,
    assignedManager: "Nour H.",
    assignedManagerId: "usr-nour",
  },
  {
    id: "pay-elsayed-1",
    quotationId: "quo-1004",
    caseId: "case-2017",
    clientId: "m-el-sayed",
    client: "M. El Sayed",
    label: "Casework and review stage",
    amount: 4200,
    currency: "EUR",
    dueDate: "27 Mar 2026",
    status: "Rejected" as PaymentStageStatus,
    assignedManager: "Maha A.",
    assignedManagerId: "usr-maha",
  },
] as const

export const paymentProofs = [
  {
    id: "proof-rahman-stage-1",
    paymentId: "pay-rahman-1",
    clientId: "a-rahman",
    client: "Ahmed Rahman",
    uploadedAt: "22 Mar 2026",
    fileName: "rahman-retainer-proof.pdf",
    status: "Approved",
    reviewer: "Lina F.",
    reviewerId: "usr-lina",
    reviewedAt: "23 Mar 2026",
    rejectionReason: null,
  },
  {
    id: "proof-elsayed-stage-1",
    paymentId: "pay-elsayed-1",
    clientId: "m-el-sayed",
    client: "M. El Sayed",
    uploadedAt: "28 Mar 2026",
    fileName: "elsayed-wire-slip.jpg",
    status: "Rejected",
    reviewer: "Lina F.",
    reviewerId: "usr-lina",
    reviewedAt: "29 Mar 2026",
    rejectionReason: "Transfer slip did not show the reference number and beneficiary details clearly.",
  },
] as const

export const documentChecklistItems = [
  {
    id: "doc-rahman-passport",
    caseId: "case-2034",
    clientId: "a-rahman",
    category: "Identity",
    item: "Principal passport copy",
    status: "Approved" as DocumentStatus,
    reviewer: "Nour H.",
    reviewedAt: "20 Mar 2026",
    uploadedAt: "18 Mar 2026",
    comment: "Legible and complete.",
  },
  {
    id: "doc-rahman-spouse-passport",
    caseId: "case-2034",
    clientId: "a-rahman",
    category: "Family",
    item: "Spouse passport copy",
    status: "Under Review" as DocumentStatus,
    reviewer: "Nour H.",
    reviewedAt: null,
    uploadedAt: "29 Mar 2026",
    comment: null,
  },
  {
    id: "doc-rahman-marriage",
    caseId: "case-2034",
    clientId: "a-rahman",
    category: "Family",
    item: "Marriage certificate",
    status: "Rejected" as DocumentStatus,
    reviewer: "Nour H.",
    reviewedAt: "27 Mar 2026",
    uploadedAt: "26 Mar 2026",
    comment: "Certificate needs full certified translation and visible issuing stamp.",
  },
  {
    id: "doc-noor-source-funds",
    caseId: "case-2041",
    clientId: "al-noor-holdings",
    category: "Financial",
    item: "Source-of-funds memorandum",
    status: "Under Review" as DocumentStatus,
    reviewer: "Maha A.",
    reviewedAt: null,
    uploadedAt: "29 Mar 2026",
    comment: null,
  },
  {
    id: "doc-noor-proof-address",
    caseId: "case-2041",
    clientId: "al-noor-holdings",
    category: "Identity",
    item: "Proof of residential address",
    status: "Approved" as DocumentStatus,
    reviewer: "Nour H.",
    reviewedAt: "25 Mar 2026",
    uploadedAt: "24 Mar 2026",
    comment: "Current and legible.",
  },
  {
    id: "doc-westbridge-board-resolution",
    caseId: "case-2028",
    clientId: "westbridge-capital",
    category: "Legal",
    item: "Board authority resolution",
    status: "Uploaded" as DocumentStatus,
    reviewer: null,
    reviewedAt: null,
    uploadedAt: "30 Mar 2026",
    comment: null,
  },
  {
    id: "doc-westbridge-principal-profiles",
    caseId: "case-2028",
    clientId: "westbridge-capital",
    category: "Program-specific",
    item: "Principal profile pack",
    status: "Not Uploaded" as DocumentStatus,
    reviewer: null,
    reviewedAt: null,
    uploadedAt: null,
    comment: null,
  },
  {
    id: "doc-elsayed-children-birth",
    caseId: "case-2017",
    clientId: "m-el-sayed",
    category: "Family",
    item: "Children's birth certificates",
    status: "Not Uploaded" as DocumentStatus,
    reviewer: null,
    reviewedAt: null,
    uploadedAt: null,
    comment: null,
  },
  {
    id: "doc-elsayed-clearance",
    caseId: "case-2017",
    clientId: "m-el-sayed",
    category: "Legal",
    item: "Police clearance",
    status: "Uploaded" as DocumentStatus,
    reviewer: null,
    reviewedAt: null,
    uploadedAt: "28 Mar 2026",
    comment: null,
  },
] as const

export const documentUploads = [
  {
    id: "upload-1001",
    checklistItemId: "doc-rahman-passport",
    caseId: "case-2034",
    client: "Ahmed Rahman",
    fileName: "rahman-passport.pdf",
    uploadedBy: "Ahmed Rahman",
    uploadedAt: "18 Mar 2026",
    status: "Approved" as DocumentStatus,
  },
  {
    id: "upload-1002",
    checklistItemId: "doc-rahman-marriage",
    caseId: "case-2034",
    client: "Ahmed Rahman",
    fileName: "rahman-marriage-certificate.pdf",
    uploadedBy: "Ahmed Rahman",
    uploadedAt: "26 Mar 2026",
    status: "Rejected" as DocumentStatus,
  },
  {
    id: "upload-1003",
    checklistItemId: "doc-noor-source-funds",
    caseId: "case-2041",
    client: "Al Noor Holdings",
    fileName: "alnoor-source-funds-memo.pdf",
    uploadedBy: "Private office contact",
    uploadedAt: "29 Mar 2026",
    status: "Under Review" as DocumentStatus,
  },
  {
    id: "upload-1004",
    checklistItemId: "doc-westbridge-board-resolution",
    caseId: "case-2028",
    client: "Westbridge Capital",
    fileName: "westbridge-board-resolution.pdf",
    uploadedBy: "Regional counsel",
    uploadedAt: "30 Mar 2026",
    status: "Uploaded" as DocumentStatus,
  },
  {
    id: "upload-1005",
    checklistItemId: "doc-elsayed-clearance",
    caseId: "case-2017",
    client: "M. El Sayed",
    fileName: "elsayed-police-clearance.pdf",
    uploadedBy: "M. El Sayed",
    uploadedAt: "28 Mar 2026",
    status: "Uploaded" as DocumentStatus,
  },
] as const

export const reviewDecisions = [
  {
    id: "review-9001",
    checklistItemId: "doc-rahman-passport",
    caseId: "case-2034",
    item: "Principal passport copy",
    decision: "Approved",
    reviewer: "Nour H.",
    reviewerId: "usr-nour",
    decidedAt: "20 Mar 2026",
    note: "All pages clear and current.",
  },
  {
    id: "review-9002",
    checklistItemId: "doc-rahman-marriage",
    caseId: "case-2034",
    item: "Marriage certificate",
    decision: "Rejected",
    reviewer: "Nour H.",
    reviewerId: "usr-nour",
    decidedAt: "27 Mar 2026",
    note: "Please re-upload with certified translation and full stamp visibility.",
  },
  {
    id: "review-9003",
    checklistItemId: "doc-noor-proof-address",
    caseId: "case-2041",
    item: "Proof of residential address",
    decision: "Approved",
    reviewer: "Nour H.",
    reviewerId: "usr-nour",
    decidedAt: "25 Mar 2026",
    note: "Accepted for current residence verification.",
  },
] as const

export const notificationLog = [
  {
    id: "notif-001",
    type: "Quotation sent",
    channel: "Email" as NotificationChannel,
    recipient: "Ahmed Rahman",
    recipientType: "Client",
    relatedTo: "quo-1001",
    sentAt: "18 Mar 2026, 14:10",
    status: "Sent",
  },
  {
    id: "notif-002",
    type: "Payment reminder",
    channel: "Email" as NotificationChannel,
    recipient: "Al Noor Holdings",
    recipientType: "Client",
    relatedTo: "pay-noor-1",
    sentAt: "29 Mar 2026, 09:00",
    status: "Sent",
  },
  {
    id: "notif-003",
    type: "Proof of payment rejected",
    channel: "Email" as NotificationChannel,
    recipient: "M. El Sayed",
    recipientType: "Client",
    relatedTo: "proof-elsayed-stage-1",
    sentAt: "29 Mar 2026, 16:40",
    status: "Sent",
  },
  {
    id: "notif-004",
    type: "Document rejected and re-upload requested",
    channel: "Workspace" as NotificationChannel,
    recipient: "Sami K.",
    recipientType: "Internal",
    relatedTo: "doc-rahman-marriage",
    sentAt: "27 Mar 2026, 12:08",
    status: "Sent",
  },
  {
    id: "notif-005",
    type: "Missing documents reminder",
    channel: "Email" as NotificationChannel,
    recipient: "Westbridge Capital",
    recipientType: "Client",
    relatedTo: "case-2028",
    sentAt: "30 Mar 2026, 08:00",
    status: "Scheduled",
  },
] as const

export const reminderSettings = [
  {
    id: "rem-pay-upcoming",
    name: "Upcoming payment reminder",
    trigger: "3 days before due date",
    audience: "Client and assigned account manager",
    status: "Scheduled" as ReminderStatus,
  },
  {
    id: "rem-pay-overdue",
    name: "Overdue payment reminder",
    trigger: "1 day after due date",
    audience: "Client, finance, and assigned account manager",
    status: "Scheduled" as ReminderStatus,
  },
  {
    id: "rem-doc-missing",
    name: "Missing documents reminder",
    trigger: "Every 5 days while required items remain open",
    audience: "Client portal users and account manager",
    status: "Scheduled" as ReminderStatus,
  },
  {
    id: "rem-reupload",
    name: "Rejected item re-upload request",
    trigger: "Immediately after review rejection",
    audience: "Client portal user",
    status: "Scheduled" as ReminderStatus,
  },
] as const

export const tasks = [
  {
    id: "task-001",
    name: "Approve Rahman payment proof",
    priority: "High",
    due: "Today",
    owner: "Lina F.",
    ownerId: "usr-lina",
    status: "In progress",
    caseId: "case-2034",
  },
  {
    id: "task-002",
    name: "Review Al Noor source-of-funds memo",
    priority: "High",
    due: "Today",
    owner: "Maha A.",
    ownerId: "usr-maha",
    status: "Scheduled",
    caseId: "case-2041",
  },
  {
    id: "task-003",
    name: "Issue Westbridge quotation",
    priority: "Medium",
    due: "Tomorrow",
    owner: "Nour H.",
    ownerId: "usr-nour",
    status: "Waiting on client",
    caseId: "case-2028",
  },
  {
    id: "task-004",
    name: "Follow up on El Sayed payment re-upload",
    priority: "Medium",
    due: "02 Apr",
    owner: "Sami K.",
    ownerId: "usr-sami",
    status: "Queued",
    caseId: "case-2017",
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

export const dashboardMetrics = [
  {
    label: "Live quotations",
    value: `${quotations.length}`,
    note: "Draft, sent, and accepted fee schedules currently in circulation.",
    trend: "2 awaiting approval",
  },
  {
    label: "Payment stages",
    value: `${paymentSchedules.length}`,
    note: "Scheduled, overdue, and under-review payment checkpoints across active matters.",
    trend: "3 need action this week",
  },
  {
    label: "Checklist items",
    value: `${documentChecklistItems.length}`,
    note: "Required records grouped by identity, family, financial, legal, and programme needs.",
    trend: "4 rejected or missing",
  },
  {
    label: "Workflow reminders",
    value: `${reminderSettings.length}`,
    note: "Automated client and internal reminders covering payments, uploads, and re-uploads.",
    trend: "All active",
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
      { name: "Westbridge Capital", focus: "Residence route comparison", owner: "Nour H." },
      { name: "M. Al Sabah", focus: "Grenada / Antigua comparison", owner: "Sami K." },
    ],
  },
  {
    label: "Awaiting documents",
    count: 11,
    items: [
      { name: "Al Noor Holdings", focus: "Source-of-funds pack", owner: "Maha A." },
      { name: "Ahmed Rahman", focus: "Family civil records", owner: "Sami K." },
      { name: "Westbridge Capital", focus: "Principal profiles", owner: "Nour H." },
    ],
  },
  {
    label: "Formal handling",
    count: 7,
    items: [
      { name: "M. El Sayed", focus: "Payment re-upload request", owner: "Maha A." },
      { name: "Al Noor Holdings", focus: "Provider coordination", owner: "Maha A." },
    ],
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
    caseId: "case-2041",
    quotationId: "quo-1002",
    paymentIds: ["pay-noor-1", "pay-noor-2"],
    notes: [
      "Family office requested a narrower shortlist focused on residence quality and long-term European optionality.",
      "Source-of-funds memo due this week before provider hand-off.",
      "Client portal is active for secure document sharing.",
    ],
  },
  "a-rahman": {
    id: "a-rahman",
    name: "Ahmed Rahman",
    contact: "Primary applicant",
    owner: "Sami K.",
    profileType: "Private client",
    region: "Kuwait City, Kuwait",
    status: "Active",
    applicationStatus: "Document collection",
    summary:
      "Direct citizenship comparison with spouse inclusion and a preference for cleaner timing and practical family administration.",
    caseId: "case-2034",
    quotationId: "quo-1001",
    paymentIds: ["pay-rahman-1", "pay-rahman-2"],
    notes: [
      "Client prefers a route that balances family inclusion with manageable economics.",
      "Awaiting certified marriage record before provider coordination.",
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
    caseId: "case-2028",
    quotationId: "quo-1003",
    paymentIds: ["pay-westbridge-1"],
    notes: [
      "Portal invitation sent to regional counsel and finance lead.",
      "Need to confirm which principals require external access and who signs off on the quotation.",
    ],
  },
  "m-el-sayed": {
    id: "m-el-sayed",
    name: "M. El Sayed",
    contact: "Primary applicant",
    owner: "Maha A.",
    profileType: "Private client",
    region: "Riyadh, Saudi Arabia",
    status: "Review",
    applicationStatus: "Jurisdiction reassessment",
    summary:
      "Mixed citizenship and residency planning with a preference for discretion and a slower decision cadence.",
    caseId: "case-2017",
    quotationId: "quo-1004",
    paymentIds: ["pay-elsayed-1"],
    notes: [
      "Client requested a slower pace while family timing is reassessed.",
      "Payment proof rejected and re-upload request already issued through the portal.",
    ],
  },
} as const

export const team = internalUsers.map((member) => ({
  name: member.name,
  role: member.role,
  function: member.function,
  load: member.load,
  seatType: "Internal seat",
}))

export const documents = documentUploads.map((upload) => ({
  name: upload.fileName,
  caseId: upload.caseId,
  status: upload.status,
  origin: upload.uploadedBy,
  updatedAt: upload.uploadedAt,
}))

export const portalSnapshot = {
  applicant: "Ahmed Rahman",
  route: "Dominica citizenship route",
  progress: 68,
  currentStage: "Document collection",
  nextStep: "Re-upload the marriage certificate with certified translation",
  quotationId: "quo-1001",
  paymentIds: ["pay-rahman-1", "pay-rahman-2"],
  documents: [
    { name: "Principal passport copy", status: "Approved" as DocumentStatus },
    { name: "Spouse passport copy", status: "Under Review" as DocumentStatus },
    { name: "Marriage certificate", status: "Rejected" as DocumentStatus },
  ],
  updates: [
    "Your route shortlist has been confirmed and the quotation has been accepted.",
    "The government contribution stage is now awaiting proof of payment.",
    "One family record requires re-upload before submission readiness can be finalised.",
  ],
} as const

export function getQuotationTotal(quotationId: string) {
  const quotation = quotations.find((item) => item.id === quotationId)

  if (!quotation) return 0

  return [...quotation.serviceFees, ...quotation.governmentFees, ...quotation.optionalItems].reduce(
    (total, line) => total + line.amount,
    0,
  )
}

export function getQuotationById(quotationId: string) {
  return quotations.find((item) => item.id === quotationId)
}

export function getPaymentsForClient(clientId: string) {
  return paymentSchedules.filter((item) => item.clientId === clientId)
}

export function getChecklistForCase(caseId: string) {
  return documentChecklistItems.filter((item) => item.caseId === caseId)
}

export function getUploadsForCase(caseId: string) {
  return documentUploads.filter((item) => item.caseId === caseId)
}

export function getReviewsForCase(caseId: string) {
  return reviewDecisions.filter((item) => item.caseId === caseId)
}

export function getNotificationsForClient(clientId: string) {
  const client = clients.find((item) => item.id === clientId)
  if (!client) return []

  return notificationLog.filter((item) => item.recipient === client.name)
}
