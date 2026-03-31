"use client"

export type ImportType = "leads" | "clients" | "cases" | "quotations" | "payments"
export type ImportSource = "Onboarding" | "Workspace"
export type TemplateFormat = "csv" | "xlsx"

type ImportFieldType = "text" | "number" | "date" | "boolean"

export type ImportFieldDefinition = {
  key: string
  label: string
  required?: boolean
  type?: ImportFieldType
  description?: string
  aliases?: string[]
}

export type ImportTypeDefinition = {
  type: ImportType
  label: string
  description: string
  fields: ImportFieldDefinition[]
  sampleRows: Record<string, string>[]
}

export type ParsedImportFile = {
  headers: string[]
  rows: Record<string, string>[]
}

export type ImportMapping = Record<string, string>

export type ImportRowIssue = {
  rowNumber: number
  issues: string[]
}

export type ValidatedImportPreview = {
  mappedRows: Record<string, string>[]
  issues: ImportRowIssue[]
}

const importTypeDefinitions: Record<ImportType, ImportTypeDefinition> = {
  leads: {
    type: "leads",
    label: "Leads",
    description: "Bring in enquiry records, assigned managers, and origin context without rebuilding the lead register manually.",
    fields: [
      { key: "full_name", label: "Full name", required: true, aliases: ["name", "lead_name"] },
      { key: "company_name", label: "Company", aliases: ["company", "firm_name"] },
      { key: "email", label: "Email", required: true, aliases: ["work_email"] },
      { key: "phone", label: "Phone", aliases: ["phone_number", "whatsapp"] },
      { key: "country", label: "Country", aliases: ["country_of_residence", "region"] },
      { key: "interest", label: "Interest", aliases: ["focus", "programme_interest"] },
      { key: "status", label: "Status", aliases: ["lead_status"] },
      { key: "assigned_manager", label: "Assigned manager", aliases: ["owner", "account_manager"] },
      { key: "source_page", label: "Source page", aliases: ["source", "landing_page"] },
      { key: "submitted_at", label: "Submitted at", type: "date", aliases: ["date", "created_at"] },
      { key: "notes", label: "Notes", aliases: ["remarks"] },
    ],
    sampleRows: [
      {
        full_name: "Karim Al Mansoori",
        company_name: "",
        email: "karim@example.com",
        phone: "+971500000000",
        country: "United Arab Emirates",
        interest: "Portugal residence planning",
        status: "New",
        assigned_manager: "Maha A.",
        source_page: "/citizenship-by-investment",
        submitted_at: "2026-03-29",
        notes: "Initial investor enquiry from website form.",
      },
      {
        full_name: "Nadia Fares",
        company_name: "Fares Private Office",
        email: "nadia@faresoffice.com",
        phone: "+965500000000",
        country: "Kuwait",
        interest: "Partnership discussion",
        status: "Qualified",
        assigned_manager: "Sami K.",
        source_page: "/for-companies",
        submitted_at: "2026-03-30",
        notes: "B2B lead looking at SaaS and partnership routes.",
      },
    ],
  },
  clients: {
    type: "clients",
    label: "Clients",
    description: "Import existing client records so the workspace can start with real relationships rather than a blank register.",
    fields: [
      { key: "client_name", label: "Client name", required: true, aliases: ["name", "full_name"] },
      { key: "company_name", label: "Company", aliases: ["company", "firm"] },
      { key: "email", label: "Email", aliases: ["contact_email"] },
      { key: "phone", label: "Phone", aliases: ["phone_number", "whatsapp"] },
      { key: "nationality", label: "Nationality", aliases: ["citizenship"] },
      { key: "country", label: "Country", aliases: ["country_of_residence", "region"] },
      { key: "client_type", label: "Client type", aliases: ["type", "profile_type"] },
      { key: "case_context", label: "Case context", aliases: ["context", "matter_focus"] },
      { key: "region", label: "Region", aliases: ["jurisdiction_region"] },
      { key: "investment_range", label: "Investment range", aliases: ["budget"] },
      { key: "jurisdiction_focus", label: "Jurisdiction focus", aliases: ["route_focus"] },
      { key: "assigned_manager", label: "Assigned manager", aliases: ["owner", "account_manager"] },
      { key: "status", label: "Status", aliases: ["client_status"] },
      { key: "notes", label: "Notes", aliases: ["summary"] },
    ],
    sampleRows: [
      {
        client_name: "Hassan Al Nouri",
        company_name: "",
        email: "hassan@example.com",
        phone: "+974500000000",
        nationality: "Jordanian",
        country: "Qatar",
        client_type: "Private client",
        case_context: "Residence route planning",
        region: "Europe",
        investment_range: "EUR 300k to 600k",
        jurisdiction_focus: "Portugal, Greece",
        assigned_manager: "Nour H.",
        status: "Active",
        notes: "Imported from prior advisory system.",
      },
      {
        client_name: "Aster Family Office",
        company_name: "Aster Family Office",
        email: "office@aster-demo.com",
        phone: "+971500000001",
        nationality: "",
        country: "United Arab Emirates",
        client_type: "Family office",
        case_context: "Citizenship and residence comparison",
        region: "Caribbean and Europe",
        investment_range: "EUR 600k+",
        jurisdiction_focus: "Portugal, Malta, Antigua",
        assigned_manager: "Maha A.",
        status: "Review",
        notes: "Principal and spouse in scope.",
      },
    ],
  },
  cases: {
    type: "cases",
    label: "Cases / applications",
    description: "Move active matters into the platform with clear route, stage, and ownership data.",
    fields: [
      { key: "client_name", label: "Client name", required: true, aliases: ["name"] },
      { key: "case_name", label: "Case name", aliases: ["application_name", "matter_name"] },
      { key: "route", label: "Route / programme", required: true, aliases: ["program", "programme"] },
      { key: "stage", label: "Stage", aliases: ["case_stage"] },
      { key: "application_status", label: "Application status", aliases: ["status"] },
      { key: "assigned_manager", label: "Assigned manager", aliases: ["owner", "account_manager"] },
      { key: "next_milestone", label: "Next milestone", type: "date", aliases: ["next_step_date"] },
      { key: "progress", label: "Progress", type: "number", aliases: ["progress_percent"] },
      { key: "region", label: "Region", aliases: ["jurisdiction_region"] },
    ],
    sampleRows: [
      {
        client_name: "Hassan Al Nouri",
        case_name: "Portugal residence route",
        route: "Portugal residence route",
        stage: "Document collection",
        application_status: "Awaiting required documents",
        assigned_manager: "Nour H.",
        next_milestone: "2026-04-08",
        progress: "42",
        region: "Europe",
      },
      {
        client_name: "Aster Family Office",
        case_name: "Citizenship route comparison",
        route: "Caribbean citizenship shortlist",
        stage: "Jurisdiction comparison",
        application_status: "Shortlist review",
        assigned_manager: "Maha A.",
        next_milestone: "2026-04-15",
        progress: "28",
        region: "Caribbean",
      },
    ],
  },
  quotations: {
    type: "quotations",
    label: "Quotations",
    description: "Bring in existing quotations with commercial totals, VAT logic, and advisor context already in place.",
    fields: [
      { key: "client_name", label: "Client name", required: true, aliases: ["name"] },
      { key: "quotation_id", label: "Quotation ID", aliases: ["id", "quote_id"] },
      { key: "quotation_title", label: "Quotation title", aliases: ["title", "quote_title"] },
      { key: "quotation_date", label: "Quotation date", required: true, type: "date", aliases: ["date"] },
      { key: "advisor_name", label: "Advisor", aliases: ["owner", "account_manager"] },
      { key: "currency", label: "Currency", aliases: ["quote_currency"] },
      { key: "service_fees_total", label: "Service fees total", required: true, type: "number", aliases: ["service_fees"] },
      { key: "government_fees_total", label: "Government fees total", type: "number", aliases: ["government_fees"] },
      { key: "optional_items_total", label: "Optional items total", type: "number", aliases: ["optional_fees"] },
      { key: "discount_amount", label: "Discount amount", type: "number", aliases: ["discount"] },
      { key: "discount_reason", label: "Discount reason", aliases: ["discount_note"] },
      { key: "vat_applied", label: "VAT applied", type: "boolean", aliases: ["vat", "add_vat"] },
      { key: "vat_percentage", label: "VAT percentage", type: "number", aliases: ["vat_rate"] },
      { key: "status", label: "Status", aliases: ["quotation_status"] },
      { key: "notes", label: "Notes", aliases: ["internal_notes", "summary"] },
    ],
    sampleRows: [
      {
        client_name: "Hassan Al Nouri",
        quotation_id: "Q-2048",
        quotation_title: "Portugal residence route quotation",
        quotation_date: "2026-03-18",
        advisor_name: "Nour H.",
        currency: "EUR",
        service_fees_total: "12000",
        government_fees_total: "18000",
        optional_items_total: "2500",
        discount_amount: "1000",
        discount_reason: "Family scope retained",
        vat_applied: "Yes",
        vat_percentage: "19",
        status: "Sent",
        notes: "Imported commercial scope from prior system.",
      },
      {
        client_name: "Aster Family Office",
        quotation_id: "Q-2049",
        quotation_title: "Caribbean comparison and diligence pack",
        quotation_date: "2026-03-22",
        advisor_name: "Maha A.",
        currency: "USD",
        service_fees_total: "14500",
        government_fees_total: "250000",
        optional_items_total: "0",
        discount_amount: "0",
        discount_reason: "",
        vat_applied: "No",
        vat_percentage: "0",
        status: "Draft",
        notes: "Awaiting internal release.",
      },
    ],
  },
  payments: {
    type: "payments",
    label: "Payments",
    description: "Import payment stages, due dates, and status checkpoints so finance visibility starts in the right place.",
    fields: [
      { key: "client_name", label: "Client name", required: true, aliases: ["name"] },
      { key: "payment_label", label: "Payment label", required: true, aliases: ["label", "stage_name"] },
      { key: "amount", label: "Amount", required: true, type: "number", aliases: ["payment_amount"] },
      { key: "currency", label: "Currency", aliases: ["payment_currency"] },
      { key: "due_date", label: "Due date", required: true, type: "date", aliases: ["payment_due_date"] },
      { key: "status", label: "Status", aliases: ["payment_status"] },
      { key: "assigned_manager", label: "Assigned manager", aliases: ["owner", "finance_owner"] },
      { key: "quotation_id", label: "Quotation ID", aliases: ["quote_id"] },
      { key: "notes", label: "Notes", aliases: ["payment_notes"] },
    ],
    sampleRows: [
      {
        client_name: "Hassan Al Nouri",
        payment_label: "Residence strategy retainer",
        amount: "12000",
        currency: "EUR",
        due_date: "2026-04-10",
        status: "Due soon",
        assigned_manager: "Nour H.",
        quotation_id: "Q-2048",
        notes: "First commercial stage.",
      },
      {
        client_name: "Aster Family Office",
        payment_label: "Government contribution stage",
        amount: "250000",
        currency: "USD",
        due_date: "2026-04-22",
        status: "Upcoming",
        assigned_manager: "Maha A.",
        quotation_id: "Q-2049",
        notes: "Awaiting final quotation release.",
      },
    ],
  },
}

export function getImportTypeDefinitions() {
  return Object.values(importTypeDefinitions)
}

export function getImportDefinition(type: ImportType) {
  return importTypeDefinitions[type]
}

export function normaliseImportHeader(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
}

export function parseCsvText(text: string): ParsedImportFile {
  const lines = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .filter((line) => line.trim().length > 0)

  if (!lines.length) {
    return { headers: [], rows: [] }
  }

  const parseLine = (line: string) => {
    const values: string[] = []
    let current = ""
    let inQuotes = false

    for (let index = 0; index < line.length; index += 1) {
      const character = line[index]
      const next = line[index + 1]

      if (character === "\"") {
        if (inQuotes && next === "\"") {
          current += "\""
          index += 1
        } else {
          inQuotes = !inQuotes
        }
        continue
      }

      if (character === "," && !inQuotes) {
        values.push(current.trim())
        current = ""
        continue
      }

      current += character
    }

    values.push(current.trim())
    return values
  }

  const headers = parseLine(lines[0]).map((header) => header.trim())
  const rows = lines.slice(1).map((line) => {
    const cells = parseLine(line)
    return headers.reduce<Record<string, string>>((record, header, index) => {
      record[header] = cells[index] ?? ""
      return record
    }, {})
  })

  return { headers, rows }
}

export async function parseImportFile(file: File): Promise<ParsedImportFile> {
  if (file.name.toLowerCase().endsWith(".csv")) {
    const text = await file.text()
    return parseCsvText(text)
  }

  const exceljs = await import("exceljs")
  const workbook = new exceljs.Workbook()
  const buffer = await file.arrayBuffer()
  await workbook.xlsx.load(buffer)
  const worksheet = workbook.worksheets[0]

  if (!worksheet) {
    return { headers: [], rows: [] }
  }

  const headerRow = worksheet.getRow(1)
  const headers = headerRow.values
    .slice(1)
    .map((value) => (value == null ? "" : String(value).trim()))

  const rows: Record<string, string>[] = []
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return
    const record = headers.reduce<Record<string, string>>((entry, header, index) => {
      const value = row.getCell(index + 1).value
      entry[header] = value == null ? "" : String(value).trim()
      return entry
    }, {})

    if (Object.values(record).some((value) => value.trim().length > 0)) {
      rows.push(record)
    }
  })

  return { headers, rows }
}

export function suggestMappings(type: ImportType, headers: string[]) {
  const definition = getImportDefinition(type)
  const normalizedHeaders = headers.map((header) => ({
    raw: header,
    normalised: normaliseImportHeader(header),
  }))

  return definition.fields.reduce<ImportMapping>((mapping, field) => {
    const aliases = [field.key, ...(field.aliases ?? [])].map(normaliseImportHeader)
    const matched = normalizedHeaders.find((header) => aliases.includes(header.normalised))
    mapping[field.key] = matched?.raw ?? ""
    return mapping
  }, {})
}

function parseBoolean(value: string) {
  const normalised = value.trim().toLowerCase()
  return ["yes", "true", "1", "y"].includes(normalised)
}

function hasValidDate(value: string) {
  const timestamp = new Date(value).getTime()
  return !Number.isNaN(timestamp)
}

export function buildValidatedImportPreview(type: ImportType, rows: Record<string, string>[], mapping: ImportMapping): ValidatedImportPreview {
  const definition = getImportDefinition(type)
  const mappedRows = rows.map((row) =>
    definition.fields.reduce<Record<string, string>>((record, field) => {
      const sourceColumn = mapping[field.key]
      record[field.key] = sourceColumn ? row[sourceColumn]?.trim() ?? "" : ""
      return record
    }, {}),
  )

  const issues: ImportRowIssue[] = mappedRows
    .map((row, index) => {
      const rowIssues = definition.fields.flatMap((field) => {
        const value = row[field.key] ?? ""

        if (field.required && !value.trim()) {
          return [`${field.label} is required.`]
        }

        if (!value.trim()) return []

        if (field.type === "number" && Number.isNaN(Number(value))) {
          return [`${field.label} should be a number.`]
        }

        if (field.type === "date" && !hasValidDate(value)) {
          return [`${field.label} should be a valid date.`]
        }

        if (field.type === "boolean" && !["yes", "true", "1", "y", "no", "false", "0", "n"].includes(value.trim().toLowerCase())) {
          return [`${field.label} should be Yes or No.`]
        }

        return []
      })

      return rowIssues.length ? { rowNumber: index + 2, issues: rowIssues } : null
    })
    .filter((issue): issue is ImportRowIssue => Boolean(issue))

  return { mappedRows, issues }
}

export async function downloadImportTemplate(type: ImportType, format: TemplateFormat) {
  const definition = getImportDefinition(type)
  const fileName = `cbideal-${type}-template.${format}`

  if (format === "csv") {
    const headers = definition.fields.map((field) => field.key)
    const csv = [
      headers.join(","),
      ...definition.sampleRows.map((row) =>
        headers
          .map((header) => {
            const value = row[header] ?? ""
            return value.includes(",") ? `"${value.replace(/"/g, "\"\"")}"` : value
          })
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    link.click()
    URL.revokeObjectURL(url)
    return
  }

  const exceljs = await import("exceljs")
  const workbook = new exceljs.Workbook()
  const worksheet = workbook.addWorksheet(definition.label)
  const headers = definition.fields.map((field) => field.key)
  worksheet.addRow(headers)
  definition.sampleRows.forEach((row) => {
    worksheet.addRow(headers.map((header) => row[header] ?? ""))
  })

  const headerRow = worksheet.getRow(1)
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } }
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF3D5A86" } }
    cell.alignment = { vertical: "middle", horizontal: "left" }
  })
  worksheet.views = [{ state: "frozen", ySplit: 1 }]
  worksheet.columns = headers.map((header) => ({ key: header, width: Math.max(header.length + 4, 18) }))

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

export function formatPreviewValue(field: ImportFieldDefinition, value: string) {
  if (!value.trim()) return "—"
  if (field.type === "boolean") return parseBoolean(value) ? "Yes" : "No"
  return value
}
