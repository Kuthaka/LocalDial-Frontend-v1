import { getBusinessProfile } from '@/app/actions/businessProfile'
import ProfileFormClient from './ProfileFormClient'

export const metadata = {
  title: 'Edit Business Profile - NearbyDirect'
}

export default async function BusinessDashboardProfile() {
  const profileData = await getBusinessProfile()

  return <ProfileFormClient initialData={profileData} />
}
