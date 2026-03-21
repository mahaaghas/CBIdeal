import { netlifyFormNames } from "@/lib/forms"

const investorFieldNames = [
  "full_name",
  "email",
  "phone_whatsapp",
  "nationality",
  "residence_country",
  "preferred_destination",
  "budget_range",
  "timeline",
  "applicant_type",
  "program_type",
  "notes",
  "source_page",
  "consent",
]

const companyFieldNames = [
  "company_name",
  "contact_person",
  "work_email",
  "phone_whatsapp",
  "region_served",
  "team_size",
  "interest_type",
  "timeline",
  "message",
  "source_page",
  "consent",
]

export function NetlifyFormDefinitions() {
  return (
    <div className="hidden" aria-hidden="true">
      <form name={netlifyFormNames.investor} data-netlify="true" netlify-honeypot="bot-field" hidden>
        <input type="hidden" name="form-name" value={netlifyFormNames.investor} />
        <input type="text" name="bot-field" />
        {investorFieldNames.map((fieldName) => (
          <input key={fieldName} type="text" name={fieldName} />
        ))}
      </form>

      <form name={netlifyFormNames.company} data-netlify="true" netlify-honeypot="bot-field" hidden>
        <input type="hidden" name="form-name" value={netlifyFormNames.company} />
        <input type="text" name="bot-field" />
        {companyFieldNames.map((fieldName) => (
          <input key={fieldName} type="text" name={fieldName} />
        ))}
      </form>

      <form name={netlifyFormNames.partner} data-netlify="true" netlify-honeypot="bot-field" hidden>
        <input type="hidden" name="form-name" value={netlifyFormNames.partner} />
        <input type="text" name="bot-field" />
        {companyFieldNames.map((fieldName) => (
          <input key={fieldName} type="text" name={fieldName} />
        ))}
      </form>
    </div>
  )
}
