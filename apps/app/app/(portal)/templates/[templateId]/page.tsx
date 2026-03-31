"use client"

import { useParams } from "next/navigation"
import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { EmailTemplateEditor } from "@/components/email-template-editor"

export default function TemplateDetailPage() {
  const params = useParams<{ templateId: string }>()
  const templateId = typeof params.templateId === "string" ? params.templateId : ""

  return (
    <div className="space-y-8">
      <CrmPageHeader
        eyebrow="Templates"
        title="Template preview and editor"
        description="Adjust copy, placeholders, and presentation while keeping the message aligned with the wider communication library."
      />
      <EmailTemplateEditor templateId={templateId} />
    </div>
  )
}
