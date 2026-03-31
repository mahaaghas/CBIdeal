"use client"

import type { BrandingSettings } from "@/lib/branding-store"
import type { QuotationRecord } from "@/lib/workflow-store"

type ExportClientRecord = {
  id: string
  name: string
}

type ExportCaseRecord = {
  id: string
  clientId: string
  route: string
}

type ExportOptions = {
  branding: BrandingSettings
  quotations: QuotationRecord[]
  cases: ExportCaseRecord[]
  clients: ExportClientRecord[]
}

function parseDate(value?: string | null) {
  if (!value) return null
  const parsed = new Date(value.replace(",", ""))
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function toQuarterLabel(value?: string | null) {
  const date = parseDate(value)
  if (!date) return "Unscheduled"
  return `Q${Math.floor(date.getMonth() / 3) + 1} ${date.getFullYear()}`
}

function getCurrencyFormat(currency: string) {
  if (currency === "USD") return '"$"#,##0.00'
  if (currency === "GBP") return '"£"#,##0.00'
  return '"€"#,##0.00'
}

function hexToArgb(hex: string) {
  const normalised = hex.replace("#", "")
  return `FF${normalised.toUpperCase()}`
}

function dataUrlToBase64(dataUrl: string) {
  const parts = dataUrl.split(",")
  if (parts.length < 2) return null
  return parts[1]
}

export async function exportQuotationRegister({
  branding,
  quotations,
  cases,
  clients,
}: ExportOptions) {
  const ExcelJS = await import("exceljs")
  const workbook = new ExcelJS.Workbook()
  workbook.creator = branding.companyName
  workbook.created = new Date()
  workbook.modified = new Date()
  workbook.subject = `${branding.companyName} quotation register`
  workbook.title = `${branding.companyName} quotation register`
  workbook.company = branding.companyName

  const worksheet = workbook.addWorksheet("Quotations", {
    views: [{ state: "frozen", ySplit: 4 }],
  })

  const primary = hexToArgb(branding.primaryColor)
  const secondary = hexToArgb(branding.secondaryColor)
  const dark = "FF243244"
  const light = "FFF7F3EC"
  const border = "FFE1E7F0"

  const logoBase64 = branding.companyLogoUrl.startsWith("data:image/")
    ? dataUrlToBase64(branding.companyLogoUrl)
    : null
  const logoExtension = branding.companyLogoUrl.includes("image/png")
    ? "png"
    : branding.companyLogoUrl.includes("image/jpeg") || branding.companyLogoUrl.includes("image/jpg")
      ? "jpeg"
      : undefined

  if (logoBase64 && logoExtension) {
    const imageId = workbook.addImage({
      base64: logoBase64,
      extension: logoExtension,
    })
    worksheet.addImage(imageId, {
      tl: { col: 0.15, row: 0.15 },
      ext: { width: 180, height: 42 },
    })
  }

  worksheet.mergeCells("A1:E1")
  worksheet.mergeCells("A2:E2")
  worksheet.getCell("A1").value = branding.companyName
  worksheet.getCell("A2").value = "Quotation register"
  worksheet.getCell("A3").value = `Generated ${new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date())}`

  ;["A1", "A2", "A3"].forEach((cellId, index) => {
    const cell = worksheet.getCell(cellId)
    cell.font =
      index === 0
        ? { name: "Georgia", size: 20, bold: true, color: { argb: dark } }
        : { name: "Arial", size: index === 1 ? 12 : 10, color: { argb: "FF5E6B7D" } }
  })

  const columns = [
    "Quotation ID",
    "Quotation date",
    "Client name",
    "Company name",
    "Route / case",
    "Advisor / account manager",
    "Subtotal",
    "VAT applied",
    "VAT amount",
    "Total amount",
    "Discount amount",
    "Discount reason",
    "Quotation status",
    "Sent date",
    "Decision",
    "Quarter",
    "Internal notes",
    "Currency",
  ]

  const headerRow = worksheet.getRow(4)
  columns.forEach((label, index) => {
    const cell = headerRow.getCell(index + 1)
    cell.value = label
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: primary },
    }
    cell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FFFFFFFF" } }
    cell.alignment = { vertical: "middle", horizontal: "left" }
    cell.border = {
      bottom: { style: "thin", color: { argb: primary } },
    }
  })
  headerRow.height = 24

  quotations.forEach((quotation) => {
    const caseRecord = cases.find((entry) => entry.id === quotation.caseId)
    const client = clients.find((entry) => entry.id === quotation.clientId)
    const row = worksheet.addRow([
      quotation.id.toUpperCase(),
      parseDate(quotation.quotationDate) ?? quotation.quotationDate,
      client?.name ?? quotation.client,
      branding.companyName,
      caseRecord?.route ?? quotation.title ?? quotation.note,
      quotation.advisorName ?? quotation.owner,
      quotation.subtotal ?? 0,
      quotation.vatApplied ? "Yes" : "No",
      quotation.vatAmount ?? 0,
      quotation.total ?? 0,
      quotation.discountAmount ?? 0,
      quotation.discountReason ?? "",
      quotation.status,
      parseDate(quotation.sentDate) ?? quotation.sentDate ?? "",
      quotation.decisionStatus ?? "Pending",
      toQuarterLabel(quotation.quotationDate),
      quotation.notes ?? quotation.note,
      quotation.currency,
    ])

    row.height = 22
    row.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: light },
      }
      cell.border = {
        bottom: { style: "thin", color: { argb: border } },
      }
      cell.font = { name: "Arial", size: 10, color: { argb: dark } }
      cell.alignment = { vertical: "middle", wrapText: true }
    })

    ;[7, 9, 10, 11].forEach((columnIndex) => {
      row.getCell(columnIndex).numFmt = getCurrencyFormat(quotation.currency)
    })
    if (row.getCell(2).value instanceof Date) {
      row.getCell(2).numFmt = "dd mmm yyyy"
    }
    if (row.getCell(14).value instanceof Date) {
      row.getCell(14).numFmt = "dd mmm yyyy"
    }
  })

  worksheet.columns = [
    { width: 16 },
    { width: 16 },
    { width: 24 },
    { width: 22 },
    { width: 28 },
    { width: 22 },
    { width: 14 },
    { width: 12 },
    { width: 14 },
    { width: 14 },
    { width: 14 },
    { width: 22 },
    { width: 18 },
    { width: 16 },
    { width: 14 },
    { width: 12 },
    { width: 34 },
    { width: 12 },
  ]

  worksheet.autoFilter = {
    from: { row: 4, column: 1 },
    to: { row: 4, column: columns.length },
  }

  const summarySheet = workbook.addWorksheet("Summary")
  summarySheet.getCell("A1").value = "Quotation status distribution"
  summarySheet.getCell("A1").font = { name: "Georgia", size: 16, bold: true, color: { argb: dark } }
  summarySheet.getCell("A3").value = "Status"
  summarySheet.getCell("B3").value = "Count"
  summarySheet.getCell("A3").fill = summarySheet.getCell("B3").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: secondary },
  }
  summarySheet.getCell("A3").font = summarySheet.getCell("B3").font = {
    name: "Arial",
    size: 10,
    bold: true,
    color: { argb: dark },
  }

  const statusCounts = quotations.reduce<Record<string, number>>((accumulator, quotation) => {
    accumulator[quotation.status] = (accumulator[quotation.status] ?? 0) + 1
    return accumulator
  }, {})

  Object.entries(statusCounts).forEach(([status, count], index) => {
    summarySheet.addRow([status, count])
    const row = summarySheet.getRow(index + 4)
    row.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: light },
      }
      cell.border = {
        bottom: { style: "thin", color: { argb: border } },
      }
      cell.font = { name: "Arial", size: 10, color: { argb: dark } }
    })
  })
  summarySheet.columns = [{ width: 24 }, { width: 12 }]

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${branding.companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-quotation-register.xlsx`
  link.click()
  URL.revokeObjectURL(url)
}
