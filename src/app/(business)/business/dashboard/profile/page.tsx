import { getBusinessProfile } from '@/app/actions/businessProfile'
import { getSystemCategories } from '@/app/actions/categories'
import ProfileFormClient from './ProfileFormClient'

export const metadata = {
  title: 'Edit Business Profile - NearbyDirect'
}

export default async function BusinessDashboardProfile() {
  const profileData = await getBusinessProfile()
  const categoriesList = await getSystemCategories()

  return <ProfileFormClient initialData={profileData} categoriesList={categoriesList} />
}
