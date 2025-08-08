'use client'

import MarketingPage from './marketing/page'
import WhatsOnPage from './whats-on/page'

export default function Index() {
  const enableMarketing = process.env.NEXT_PUBLIC_ENABLE_MARKETING === 'true'
  return enableMarketing ? <MarketingPage /> : <WhatsOnPage />
}