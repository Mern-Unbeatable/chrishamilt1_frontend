import LegalPageLayout from '@/components/legal/LegalPageLayout'
import { LEGAL_DOCUMENTS } from '@/data/legalContent'

export default function TermsOfServicePage() {
  return <LegalPageLayout legalDocument={LEGAL_DOCUMENTS.terms} />
}
