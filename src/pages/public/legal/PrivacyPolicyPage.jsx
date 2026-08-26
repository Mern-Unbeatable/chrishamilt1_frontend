import LegalPageLayout from '@/components/legal/LegalPageLayout'
import { LEGAL_DOCUMENTS } from '@/data/legalContent'

export default function PrivacyPolicyPage() {
  return <LegalPageLayout legalDocument={LEGAL_DOCUMENTS.privacy} />
}
