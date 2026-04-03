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
        title="Locked template preview and send"
        description="Fill approved variables, preview the final rendered email, and send it without exposing raw HTML or editable layout code."
      />
      <EmailTemplateEditor templateId={templateId} />
    </div>
  )
}
