export type TemplateCategory =
  | "Payment reminder"
  | "Overdue payment"
  | "Missing document"
  | "Document re-upload request"
  | "Quotation follow-up"
  | "Consultation confirmation"
  | "Application progress update"

export type CommunicationStatus = "Draft" | "Prepared" | "Sent" | "Scheduled" | "Failed"

export interface EmailTemplateRecord {
  id: string
  name: string
  category: TemplateCategory
  subject: string
  previewText: string
  htmlBody: string
  textBody: string
  lastEdited: string
  lastUsed: string | null
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

const shell = (headline: string, body: string, ctaLabel = "Open your portal", ctaHref = "{{portal_link}}") => `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea;padding:24px 0;font-family:Manrope,Arial,sans-serif;color:#223047;">
  <tr>
    <td align="center">
      <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="width:640px;max-width:640px;background:#ffffff;border-radius:20px;overflow:hidden;">
        <tr>
          <td style="background:{{brand_primary_strong}};padding:24px 32px;">
            <div>{{brand_header_markup}}</div>
            <div style="margin-top:10px;font-size:12px;letter-spacing:0.24em;text-transform:uppercase;color:#d7dce6;">Private client communication</div>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <h1 style="margin:0 0 16px;font-family:Cormorant Garamond,Georgia,serif;font-size:34px;line-height:1.08;color:#223047;">${headline}</h1>
            <div style="font-size:16px;line-height:1.8;color:#4e5a6f;">${body}</div>
            <div style="margin-top:28px;">
              <a href="${ctaHref}" style="display:inline-block;background:{{brand_primary}};color:{{brand_on_primary}};text-decoration:none;padding:13px 22px;border-radius:999px;font-size:14px;font-weight:600;">${ctaLabel}</a>
            </div>
            <div style="margin-top:28px;padding-top:20px;border-top:1px solid #e7ebf2;font-size:13px;line-height:1.8;color:#66728a;">
              {{sender_name}}<br/>
              {{company_name}}<br/>
              {{reply_to}}
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`

export const emailTemplates: EmailTemplateRecord[] = [
  {
    id: "tpl-payment-reminder",
    name: "Payment reminder / due soon",
    category: "Payment reminder",
    subject: "Payment reminder for {{case_name}}",
    previewText: "A payment stage is approaching and we have prepared the relevant details for you.",
    htmlBody: shell(
      "A payment stage is approaching",
      "<p>Dear {{client_name}},</p><p>This is a quiet reminder that <strong>{{payment_amount}}</strong> relating to <strong>{{case_name}}</strong> is approaching its due date on <strong>{{payment_due_date}}</strong>.</p><p>If the transfer has already been arranged, you may upload the proof directly through the portal. If anything needs clarification, your account manager can assist before the stage becomes urgent.</p>",
      "Open payment detail",
      "{{portal_link}}/payments",
    ),
    textBody:
      "Dear {{client_name}},\n\nThis is a reminder that {{payment_amount}} relating to {{case_name}} is approaching its due date on {{payment_due_date}}.\n\nYou may upload proof through the portal here: {{portal_link}}/payments\n\n{{account_manager_name}}\n{{company_name}}",
    lastEdited: "26 Mar 2026",
    lastUsed: "30 Mar 2026",
  },
  {
    id: "tpl-overdue-payment",
    name: "Payment reminder / overdue",
    category: "Overdue payment",
    subject: "Overdue payment note for {{case_name}}",
    previewText: "A payment stage remains open and requires attention before the file can move forward.",
    htmlBody: shell(
      "A payment stage remains open",
      "<p>Dear {{client_name}},</p><p>The payment stage of <strong>{{payment_amount}}</strong> linked to <strong>{{case_name}}</strong> remains open beyond the planned date of <strong>{{payment_due_date}}</strong>.</p><p>Where possible, please arrange the payment or share an update so we can keep the matter moving in a controlled way.</p>",
      "Review payment stage",
      "{{portal_link}}/payments",
    ),
    textBody:
      "Dear {{client_name}},\n\nThe payment stage of {{payment_amount}} linked to {{case_name}} remains open beyond the planned date of {{payment_due_date}}.\n\nPlease review the payment stage here: {{portal_link}}/payments\n\n{{account_manager_name}}\n{{company_name}}",
    lastEdited: "25 Mar 2026",
    lastUsed: "29 Mar 2026",
  },
  {
    id: "tpl-missing-document",
    name: "Missing document request",
    category: "Missing document",
    subject: "Document still required for {{case_name}}",
    previewText: "One requested item is still outstanding before the file can move forward.",
    htmlBody: shell(
      "A document is still required",
      "<p>Dear {{client_name}},</p><p>We still require <strong>{{document_name}}</strong> in order to keep <strong>{{case_name}}</strong> moving without delay.</p><p>You can upload the item securely through the portal using the link below.</p>",
      "Upload document",
      "{{upload_link}}",
    ),
    textBody:
      "Dear {{client_name}},\n\nWe still require {{document_name}} for {{case_name}}.\n\nYou can upload it here: {{upload_link}}\n\n{{account_manager_name}}\n{{company_name}}",
    lastEdited: "28 Mar 2026",
    lastUsed: "30 Mar 2026",
  },
  {
    id: "tpl-document-reupload",
    name: "Document re-upload request",
    category: "Document re-upload request",
    subject: "Please re-upload {{document_name}}",
    previewText: "A reviewed document needs to be replaced before it can be approved.",
    htmlBody: shell(
      "A reviewed document needs to be replaced",
      "<p>Dear {{client_name}},</p><p>We reviewed <strong>{{document_name}}</strong> and a revised upload is required before it can be approved.</p><p><strong>Review note:</strong> {{rejection_reason}}</p><p>Once updated, the file can be uploaded directly through the portal.</p>",
      "Upload revised document",
      "{{upload_link}}",
    ),
    textBody:
      "Dear {{client_name}},\n\nWe reviewed {{document_name}} and a revised upload is required.\n\nReview note: {{rejection_reason}}\n\nPlease upload the revised file here: {{upload_link}}\n\n{{account_manager_name}}\n{{company_name}}",
    lastEdited: "29 Mar 2026",
    lastUsed: "31 Mar 2026",
  },
  {
    id: "tpl-quotation-followup",
    name: "Quotation follow-up",
    category: "Quotation follow-up",
    subject: "Follow-up on {{quotation_name}}",
    previewText: "A brief follow-up on the quotation currently linked to your file.",
    htmlBody: shell(
      "A brief follow-up on your quotation",
      "<p>Dear {{client_name}},</p><p>We are following up on <strong>{{quotation_name}}</strong>, which remains open in relation to <strong>{{case_name}}</strong>.</p><p>If helpful, we can clarify the structure, timing, or next administrative step before anything further is decided.</p>",
      "Open portal view",
      "{{portal_link}}",
    ),
    textBody:
      "Dear {{client_name}},\n\nWe are following up on {{quotation_name}}, which remains open in relation to {{case_name}}.\n\nPlease let us know if you would like clarification on structure or next steps.\n\n{{account_manager_name}}\n{{company_name}}",
    lastEdited: "23 Mar 2026",
    lastUsed: "27 Mar 2026",
  },
  {
    id: "tpl-consultation-confirmation",
    name: "Consultation confirmation",
    category: "Consultation confirmation",
    subject: "Your consultation with {{company_name}}",
    previewText: "A structured confirmation of the introductory discussion and next practical step.",
    htmlBody: shell(
      "Your consultation is noted",
      "<p>Dear {{client_name}},</p><p>Thank you for arranging an introductory discussion with <strong>{{company_name}}</strong>.</p><p>We will use the conversation to understand priorities, timing, and the relevant route structure before suggesting any next step.</p>",
      "Open your portal",
      "{{portal_link}}",
    ),
    textBody:
      "Dear {{client_name}},\n\nThank you for arranging an introductory discussion with {{company_name}}.\n\nWe will use the conversation to understand priorities, timing, and route structure before suggesting any next step.\n\n{{sender_name}}",
    lastEdited: "21 Mar 2026",
    lastUsed: null,
  },
  {
    id: "tpl-progress-update",
    name: "Application progress update",
    category: "Application progress update",
    subject: "Progress update for {{case_name}}",
    previewText: "A concise update on your current matter and the next point of movement.",
    htmlBody: shell(
      "A progress update on your matter",
      "<p>Dear {{client_name}},</p><p>This is a concise update regarding <strong>{{case_name}}</strong>.</p><p>The current position remains structured, and the next step is being managed in line with the agreed process. Where further input is needed from you, it will appear clearly in the portal.</p>",
      "View recent updates",
      "{{portal_link}}/messages",
    ),
    textBody:
      "Dear {{client_name}},\n\nThis is a concise update regarding {{case_name}}.\n\nThe current position remains structured and the next step is being managed in line with the agreed process.\n\n{{account_manager_name}}\n{{company_name}}",
    lastEdited: "24 Mar 2026",
    lastUsed: "30 Mar 2026",
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
    renderedHtml: shell(
      "A payment stage is approaching",
      "<p>Dear Ahmed Rahman,</p><p>This is a quiet reminder that <strong>USD 200,000</strong> relating to <strong>Dominica citizenship route</strong> is approaching its due date on <strong>04 Apr 2026</strong>.</p><p>If the transfer has already been arranged, you may upload the proof directly through the portal. If anything needs clarification, your account manager can assist before the stage becomes urgent.</p>",
      "Open payment detail",
      "https://app.cbideal.nl/portal/payments",
    ),
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
    renderedHtml: shell(
      "A payment stage remains open",
      "<p>Dear M. El Sayed,</p><p>The payment stage of <strong>EUR 4,200</strong> linked to <strong>Strategic relocation</strong> remains open beyond the planned date of <strong>27 Mar 2026</strong>.</p><p>Where possible, please arrange the payment or share an update so we can keep the matter moving in a controlled way.</p>",
      "Review payment stage",
      "https://app.cbideal.nl/portal/payments",
    ),
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
    renderedHtml: shell(
      "A document is still required",
      "<p>Dear Al Noor Holdings,</p><p>We still require <strong>Proof of address pack</strong> in order to keep <strong>Portugal residence route</strong> moving without delay.</p><p>You can upload the item securely through the portal using the link below.</p>",
      "Upload document",
      "https://app.cbideal.nl/portal/documents",
    ),
    renderedText:
      "Dear Al Noor Holdings,\n\nWe still require Proof of address pack for Portugal residence route.\n\nYou can upload it here: https://app.cbideal.nl/portal/documents\n\nMaha A.\nCBI Deal Advisory",
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
