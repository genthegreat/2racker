import { redirect } from 'next/navigation'
import ProfileForm from './profile-form'
import { createClient } from '@/utils/supabase/server'

export default async function Account() {
  const supabase = createClient()

  const {
    data: { user }, error
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }
  
  return <ProfileForm user={user} />
}