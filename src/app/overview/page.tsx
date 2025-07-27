"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function OverviewRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    router.push('/overview/project-overview')
  }, [router])
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-medium">Redirecting to Project Overview...</h2>
        <p className="mt-2 text-gray-500">Please wait a moment.</p>
      </div>
    </div>
  )
}