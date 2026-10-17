export const DARK = '#1D3045'

export const NAV_LINKS = [
  { label: 'Destinations', href: '#destinations' },
  { label: 'Inbound', href: '#services' },
  { label: 'Outbound', href: '#services' },
  { label: 'Cruises', href: '#services' },
  { label: 'Corporate & MICE', href: '#services' },
]

export type EnquiryType = 'general' | 'destination' | 'cruise' | 'mice'

export const ENQUIRY_TYPES: { id: EnquiryType; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'destination', label: 'Destination' },
  { id: 'cruise', label: 'Cruise' },
  { id: 'mice', label: 'Corporate & MICE' },
]
