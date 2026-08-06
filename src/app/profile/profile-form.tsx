'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import Avatar from './avatar'
import Spinner from '@/components/spinner/Spinner'
import Modal from '@/components/Modal'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function ProfileForm({ user }: { user: User | null }) {
  const supabase = createClient()
  const { signOut } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [avatar_url, setAvatarUrl] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, avatar_url`)
        .eq('id', user?.id)
        .single()

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      if (data) {
        setFullname(data.full_name)
        setUsername(data.username)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error: any) {
      setModalMessage(`Error collecting Profile. ${error.message}`);
      setModalOpen(true);
      setModalStatus(false);
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  async function updateProfile({
    username,
    avatar_url,
  }: {
    username: string | null
    fullname: string | null
    avatar_url: string | null
  }) {
    try {
      setLoading(true)

      const { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        full_name: fullname,
        username,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      setModalMessage('Profile updated!');
      setModalOpen(true);
      setModalStatus(true);
    } catch (error: any) {
      alert('Error updating the data!')
      setModalMessage(`Error updating the data! ${error.message}`);
      setModalOpen(true);
      setModalStatus(false);
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <div className="form-widget">
      <div>
        <Avatar
          uid={user?.id ?? null}
          url={avatar_url}
          size={150}
          onUpload={(url) => {
            setAvatarUrl(url)
            updateProfile({ fullname, username, avatar_url: url })
          }}
        />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={user?.email} disabled />
      </div>
      <div>
        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          type="text"
          value={fullname || ''}
          onChange={(e) => setFullname(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div>
        <button
          className="button primary block"
          onClick={() => updateProfile({ fullname, username, avatar_url })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} success={modalStatus} message={modalMessage} redirectUrl={modalStatus ? "/profile" : undefined} />

      <div>
        <button
          className="button block"
          type="button"
          disabled={isSigningOut}
          onClick={async () => {
            setIsSigningOut(true);
            try {
              await fetch('/auth/signout', { method: 'POST' });
              await signOut();
              router.replace('/login');
              router.refresh();
            } finally {
              setIsSigningOut(false);
            }
          }}
        >
          {isSigningOut ? 'Signing out...' : 'Sign out'}
        </button>
      </div>
    </div>
  )
}