'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, getAuth } from "firebase/auth"
import { Button } from "@/components/ui/button"
import { app } from "@/configs/firebaseConfig"

export default function Home() {
  const router = useRouter()
  const auth = getAuth(app)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If user is authenticated, redirect to /home (or dashboard, profile, etc.)
        router.push('/home')
      }
    })

    return () => unsubscribe()
  }, [auth, router])

  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center max-w-3xl mx-auto">
      <h1 className="text-blue-600 text-3xl font-bold mb-4">Welcome to Hazina, your financial app</h1>
      <p className="mb-6 text-gray-700">
        Hazina is not just a digital wallet; it’s a comprehensive financial ecosystem designed to empower
        individuals and businesses to manage, grow, and optimize their finances from one intuitive app.
        Save, invest, budget, transact, and receive tailored financial advice with ease and security — anywhere in the world.
      </p>
      <Button onClick={() => router.push('/auth')}>Get Started</Button>
    </div>
  )
}
