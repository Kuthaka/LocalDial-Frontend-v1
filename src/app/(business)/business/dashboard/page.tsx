import { getBusinessProfile } from '@/app/actions/businessProfile'
import OverviewClient from './OverviewClient'

export const metadata = {
  title: 'Dashboard Overview - NearbyDirect'
}

export default async function BusinessDashboardOverview() {
  const profileData = await getBusinessProfile()

  return <OverviewClient profileData={profileData} />
}
