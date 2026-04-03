import { buildSaasAppUrl } from "@cbideal/config"

export type TemplateCategory =
  | "Payment reminder"
  | "Overdue payment"
  | "Missing document"
  | "Document re-upload request"
  | "Quotation follow-up"
  | "Consultation confirmation"
  | "Application progress update"

export type CommunicationStatus = "Draft" | "Prepared" | "Sent" | "Scheduled" | "Failed"

export type TemplateVariableType = "text" | "url"

export interface EmailTemplateVariableDefinition {
  key: string
  label: string
  placeholder: string
  required: boolean
  type: TemplateVariableType
  helpText?: string
}

export interface EmailTemplateRecord {
  id: string
  name: string
  category: TemplateCategory
  subject: string
  previewText: string
  lastEdited: string
  lastUsed: string | null
  locked: true
  variables: EmailTemplateVariableDefinition[]
}

export interface CommunicationLogRecord {
  id: string
  clientId: string
  caseId?: string | null
  quotationId?: string | null
  paymentId?: string | null
  checklistItemId?: string | null
  templateId: string
  templateName: string
  category: TemplateCategory
  subject: string
  previewText: string
  renderedHtml: string
  renderedText: string
  sender: string
  recipient: string
  createdAt: string
  scheduledFor?: string | null
  status: CommunicationStatus
  channel: "Outlook draft" | "Workspace send" | "Scheduled send"
  contextSummary: string
}

export interface EmailIntegrationRecord {
  provider: "Microsoft 365"
  connected: boolean
  senderMailbox: string
  senderName: string
  replyTo: string
  lastTested: string | null
  status: "Connected" | "Setup needed" | "Draft-only mode"
  note: string
}

const commonVariables: EmailTemplateVariableDefinition[] = [
  {
    key: "client_name",
    label: "Client Name",
    placeholder: "Ahmed Rahman",
    required: true,
    type: "text",
  },
  {
    key: "case_name",
    label: "Case Name",
    placeholder: "Dominica citizenship route",
    required: true,
    type: "text",
  },
  {
    key: "account_manager_name",
    label: "Account Manager Name",
    placeholder: "Sami K.",
    required: true,
    type: "text",
  },
]

const portalUrl = buildSaasAppUrl("/portal")
const portalPaymentsUrl = buildSaasAppUrl("/portal/payments")
const portalDocumentsUrl = buildSaasAppUrl("/portal/documents")
const portalMessagesUrl = buildSaasAppUrl("/portal/messages")

export const emailTemplates: EmailTemplateRecord[] = [
  {
    id: "tpl-payment-reminder",
    name: "Payment reminder / due soon",
    category: "Payment reminder",
    subject: "Payment reminder for {{case_name}}",
    previewText: "A payment stage is approaching and we have prepared the relevant details for you.",
    lastEdited: "26 Mar 2026",
    lastUsed: "30 Mar 2026",
    locked: true,
    variables: [
      ...commonVariables,
      {
        key: "payment_amount",
        label: "Payment Amount",
        placeholder: "USD 200,000",
        required: true,
        type: "text",
      },
      {
        key: "payment_due_date",
        label: "Payment Due Date",
        placeholder: "04 Apr 2026",
        required: true,
        type: "text",
      },
      {
        key: "portal_link",
        label: "Portal Link",
        placeholder: portalPaymentsUrl,
        required: true,
        type: "url",
      },
    ],
  },
  {
    id: "tpl-overdue-payment",
    name: "Payment reminder / overdue",
    category: "Overdue payment",
    subject: "Overdue payment note for {{case_name}}",
    previewText: "A payment stage remains open and requires attention before the file can move forward.",
    lastEdited: "25 Mar 2026",
    lastUsed: "29 Mar 2026",
    locked: true,
    variables: [
      ...commonVariables,
      {
        key: "payment_amount",
        label: "Payment Amount",
        placeholder: "EUR 4,200",
        required: true,
        type: "text",
      },
      {
        key: "payment_due_date",
        label: "Payment Due Date",
        placeholder: "27 Mar 2026",
        required: true,
        type: "text",
      },
      {
        key: "portal_link",
        label: "Portal Link",
        placeholder: portalPaymentsUrl,
        required: true,
        type: "url",
      },
    ],
  },
  {
    id: "tpl-missing-document",
    name: "Missing document request",
    category: "Missing document",
    subject: "Document still required for {{case_name}}",
    previewText: "One requested item is still outstanding before the file can move forward.",
    lastEdited: "28 Mar 2026",
    lastUsed: "30 Mar 2026",
    locked: true,
    variables: [
      ...commonVariables,
      {
        key: "document_name",
        label: "Document Name",
        placeholder: "Passport copy",
        required: true,
        type: "text",
      },
      {
        key: "upload_link",
        label: "Upload Link",
        placeholder: portalDocumentsUrl,
        required: true,
        type: "url",
        helpText: "Use the direct portal upload URL for the requested item.",
      },
    ],
  },
  {
    id: "tpl-document-reupload",
    name: "Document re-upload request",
    category: "Document re-upload request",
    subject: "Please re-upload {{document_name}}",
    previewText: "A reviewed document needs to be replaced before it can be approved.",
    lastEdited: "29 Mar 2026",
    lastUsed: "31 Mar 2026",
    locked: true,
    variables: [
      ...commonVariables,
      {
        key: "document_name",
        label: "Document Name",
        placeholder: "Proof of address",
        required: true,
        type: "text",
      },
      {
        key: "rejection_reason",
        label: "Rejection Reason",
        placeholder: "The scan is incomplete and the lower edge is cut off.",
        required: true,
        type: "text",
      },
      {
        key: "upload_link",
        label: "Upload Link",
        placeholder: portalDocumentsUrl,
        required: true,
        type: "url",
      },
    ],
  },
  {
    id: "tpl-quotation-followup",
    name: "Quotation follow-up",
    category: "Quotation follow-up",
    subject: "Follow-up on {{quotation_name}}",
    previewText: "A brief follow-up on the quotation currently linked to your file.",
    lastEdited: "23 Mar 2026",
    lastUsed: "27 Mar 2026",
    locked: true,
    variables: [
      ...commonVariables,
      {
        key: "quotation_name",
        label: "Quotation Name",
        placeholder: "M. El Sayed quotation",
        required: true,
        type: "text",
      },
      {
        key: "portal_link",
        label: "Portal Link",
        placeholder: portalUrl,
        required: true,
        type: "url",
      },
    ],
  },
  {
    id: "tpl-consultation-confirmation",
    name: "Consultation confirmation",
    category: "Consultation confirmation",
    subject: "Your consultation with {{company_name}}",
    previewText: "A structured confirmation of the introductory discussion and next practical step.",
    lastEdited: "21 Mar 2026",
    lastUsed: null,
    locked: true,
    variables: [
      {
        key: "client_name",
        label: "Client Name",
        placeholder: "Ahmed Rahman",
        required: true,
        type: "text",
      },
      {
        key: "company_name",
        label: "Company Name",
        placeholder: "CBI Deal Advisory",
        required: true,
        type: "text",
      },
      {
        key: "portal_link",
        label: "Portal Link",
        placeholder: portalUrl,
        required: true,
        type: "url",
      },
    ],
  },
  {
    id: "tpl-progress-update",
    name: "Application progress update",
    category: "Application progress update",
    subject: "Progress update for {{case_name}}",
    previewText: "A concise update on your current matter and the next point of movement.",
    lastEdited: "24 Mar 2026",
    lastUsed: "30 Mar 2026",
    locked: true,
    variables: [
      ...commonVariables,
      {
        key: "portal_link",
        label: "Portal Link",
        placeholder: portalMessagesUrl,
        required: true,
        type: "url",
      },
    ],
  },
]

export const communicationHistory: CommunicationLogRecord[] = [
  {
    id: "comm-1001",
    clientId: "a-rahman",
    caseId: "case-2034",
    quotationId: "quo-1001",
    paymentId: "pay-rahman-2",
    templateId: "tpl-payment-reminder",
    templateName: "Payment reminder / due soon",
    category: "Payment reminder",
    subject: "Payment reminder for Dominica citizenship route",
    previewText: "A payment stage is approaching and we have prepared the relevant details for you.",
    renderedHtml: "<p>Rendered HTML snapshot</p>",
    renderedText:
      "Dear Ahmed Rahman,\n\nThis is a quiet reminder that USD 200,000 relating to Dominica citizenship route is approaching its due date on 04 Apr 2026.\n\nSami K.\nCBI Deal Advisory",
    sender: "Sami K. <private@cbideal.nl>",
    recipient: "a.rahman@samplemail.com",
    createdAt: "30 Mar 2026 10:20",
    scheduledFor: null,
    status: "Sent",
    channel: "Workspace send",
    contextSummary: "Payment reminder sent for the government contribution stage.",
  },
  {
    id: "comm-1002",
    clientId: "m-el-sayed",
    caseId: "case-2017",
    paymentId: "pay-elsayed-1",
    templateId: "tpl-overdue-payment",
    templateName: "Payment reminder / overdue",
    category: "Overdue payment",
    subject: "Overdue payment note for Strategic relocation",
    previewText: "A payment stage remains open and requires attention before the file can move forward.",
    renderedHtml: "<p>Rendered HTML snapshot</p>",
    renderedText:
      "Dear M. El Sayed,\n\nThe payment stage of EUR 4,200 linked to Strategic relocation remains open beyond the planned date of 27 Mar 2026.\n\nMaha A.\nCBI Deal Advisory",
    sender: "Maha A. <private@cbideal.nl>",
    recipient: "m.elsayed@samplemail.com",
    createdAt: "29 Mar 2026 16:40",
    scheduledFor: "31 Mar 2026 09:00",
    status: "Scheduled",
    channel: "Scheduled send",
    contextSummary: "Scheduled overdue payment follow-up after rejection of proof.",
  },
  {
    id: "comm-1003",
    clientId: "al-noor-holdings",
    caseId: "case-2041",
    checklistItemId: "doc-noor-3",
    templateId: "tpl-missing-document",
    templateName: "Missing document request",
    category: "Missing document",
    subject: "Document still required for Portugal residence route",
    previewText: "One requested item is still outstanding before the file can move forward.",
    renderedHtml: "<p>Rendered HTML snapshot</p>",
    renderedText:
      `Dear Al Noor Holdings,\n\nWe still require Proof of address pack for Portugal residence route.\n\nYou can upload it here: ${portalDocumentsUrl}\n\nMaha A.\nCBI Deal Advisory`,
    sender: "Maha A. <private@cbideal.nl>",
    recipient: "office@alnoor-demo.com",
    createdAt: "30 Mar 2026 08:15",
    scheduledFor: null,
    status: "Prepared",
    channel: "Outlook draft",
    contextSummary: "Missing document reminder prepared for the family office contact.",
  },
]

export const emailIntegrationSettings: EmailIntegrationRecord = {
  provider: "Microsoft 365",
  connected: true,
  senderMailbox: "private@cbideal.nl",
  senderName: "CBI Deal Advisory",
  replyTo: "private@cbideal.nl",
  lastTested: "30 Mar 2026 09:12",
  status: "Draft-only mode",
  note: "Prepared email flows and communication logs are live. Direct Microsoft sending can be enabled in the next phase.",
}
