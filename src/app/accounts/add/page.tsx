'use client'
import React from 'react'
import { useProfileContext } from '@/context/ProfileContext';
import Spinner from '@/components/spinner/Spinner';
import { redirect } from 'next/navigation';
import AddAccountForm from './addaccount';

export default function AddAccount() {
  const { profile, loading, error, authState } = useProfileContext();

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="overline text-2xl mt-4">{profile.full_name || 'Guest'}&#39;s Portfolio</h1>
      <AddAccountForm id={profile.id} />
    </div>
  )
}