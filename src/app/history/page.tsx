"use client"

import PaidTotal from '@/components/paidTotal/paidTotal'
import React from 'react'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState, useEffect } from "react"

export default function History() {
  const supabase = createClientComponentClient()
  const [users, setUsers] = useState([])

  const getUsers = async() => {
    try {
      const { data, error } = await supabase.from("auth.users").select("*")
      if (error) {
        throw error
      }
      if (data) {
        setUsers(data)
      }
    } catch (error) {
      console.error('Error fetching users:', error.message);
    }
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <div className='align-center'>
        <h2>Users</h2>
        <ul>
        {users.map(user => (
          <li key={user.id}>
            <div>User ID: {user.id}</div>
            <div>Email: {user.email}</div>
          </li>
        ))}
        </ul>

        <PaidTotal />

        <div>Loading Bar</div>

        <h1>History</h1>

        <table className="table-auto">
            <thead>
                <tr>
                <th>Song</th>
                <th>Artist</th>
                <th>Year</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
                <td>Malcolm Lockyer</td>
                <td>1961</td>
                </tr>
                <tr>
                <td>Witchy Woman</td>
                <td>The Eagles</td>
                <td>1972</td>
                </tr>
                <tr>
                <td>Shining Star</td>
                <td>Earth, Wind, and Fire</td>
                <td>1975</td>
                </tr>
            </tbody>
        </table>
    </div>
  )
}