export type User = {
  id: string
  name: string
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  zip: string | null
  profile_image: string | null
  account_type: 'renter' | 'owner'
  created_at: string
  image: string | null
}
