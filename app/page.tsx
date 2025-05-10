'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, getAuth } from "firebase/auth"
import { Button } from "@/components/ui/button"
import { app } from "@/configs/firebaseConfig"
import { ChevronRight, Wallet, BarChart3, CreditCard, PiggyBank, Globe, Lock, TrendingUp, Shield, Flame } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const auth = getAuth(app)
  const [loading, setLoading] = useState(true)
  const [animationComplete, setAnimationComplete] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/')
      }
      setLoading(false)
    })

    // Trigger animation completion after delay
    const timer = setTimeout(() => {
      setAnimationComplete(true)
    }, 1800)

    return () => {
      unsubscribe()
      clearTimeout(timer)
    }
  }, [auth, router])

  const features = [
    { icon: <Wallet className="text-purple-500" />, title: "Smart Wallet", description: "Manage multiple currencies with zero fees" },
    { icon: <BarChart3 className="text-green-500" />, title: "Intelligent Investing", description: "AI-powered portfolio recommendations" },
    { icon: <CreditCard className="text-green-500" />, title: "Market Snapshots", description: "Get Market snapshots daily for better investments" },
    { icon: <Flame className="text-pink-500" />, title: "Daily Streaks", description: "Build up streaks by daily investments, savings or expense tracking" }
  ]

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-green-900 to-black">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-green-400 font-bold">H</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 overflow-hidden font-poppins">
      {/* Animated geometric shapes in background */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-300/20 blur-3xl transform transition-all duration-[2000ms] ${animationComplete ? 'translate-x-24 translate-y-12 scale-150' : ''}`}></div>
        <div className={`absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-green-300/20 blur-3xl transform transition-all duration-[2500ms] ${animationComplete ? '-translate-x-24 -translate-y-12 scale-125' : ''}`}></div>
        <div className={`absolute top-2/3 left-1/2 w-48 h-48 rounded-full bg-teal-300/20 blur-3xl transform transition-all duration-[3000ms] ${animationComplete ? 'translate-x-12 -translate-y-24 scale-150' : ''}`}></div>
      </div>

      {/* Header with interactive elements */}
      <header className="pt-6 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center">
          <h2 className="ml-3 text-xl font-bold bg-gradient-to-r from-green-700 to-teal-600 bg-clip-text text-transparent">H A Z I N A</h2>
        </div>
        <nav className="hidden md:flex space-x-8">
          <Button variant="ghost" className="text-gray-600 hover:text-green-700">Features</Button>
          <Button variant="ghost" className="text-gray-600 hover:text-green-700">Pricing</Button>
          <Button variant="ghost" className="text-gray-600 hover:text-green-700">Support</Button>
        </nav>
        <Button onClick={() => router.push('/auth')} variant="outline" className="hidden md:flex border-green-600 text-green-700 hover:bg-green-50">Sign In</Button>
      </header>

      {/* Hero section with advanced visuals */}
      <main>
        <div className="relative mx-auto mt-12 md:mt-24 px-6 md:px-12 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 space-y-6 md:pr-12 z-10">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-2">
                <span className="animate-pulse mr-2 w-2 h-2 bg-green-600 rounded-full"></span>
                New: Smart Saving Features
              </div>
              
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-green-700 via-teal-700 to-purple-700 bg-clip-text text-transparent">Reimagine Your Financial Future</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 max-w-lg">
                Hazina {"isn't"} just a wallet {"it's"} your all-in-one financial ecosystem designed to empower, protect, and grow your assets with AI-driven insights.
              </p>
              
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => router.push('/auth')}
                  className="bg-gradient-to-r from-green-600 to-teal-700 hover:from-green-700 hover:to-teal-800 text-white px-8 py-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Get Started <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                
                {/* <Button 
                  variant="outline" 
                  className="border-2 border-teal-200 text-teal-700 px-8 py-6 rounded-xl font-bold text-lg hover:bg-teal-50 transition-all duration-300"
                >
                  Watch Demo
                </Button> */}
              </div>
              
              <div className="flex items-center pt-6">
                <div className="flex -space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br ${
                      ['from-purple-400 to-teal-400', 'from-green-400 to-cyan-400', 'from-green-400 to-teal-400', 'from-yellow-400 to-orange-400', 'from-red-400 to-pink-400'][i]
                    }`}></div>
                  ))}
                </div>
                <div className="ml-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-500">★</span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">Trusted by 100,000+ users worldwide</p>
                </div>
              </div>
            </div>
            
            {/* Interactive dashboard mockup */}
            <div className="md:w-1/2 w-full mt-12 md:mt-0 perspective-1000">
              <div className="relative transform rotate-y-10 rotate-x-5 transition-transform duration-700 hover:rotate-y-0 hover:rotate-x-0">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-600 to-teal-700 transform translate-x-2 translate-y-2 -z-10 blur opacity-40"></div>
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
                  <div className="bg-gradient-to-r from-green-600 to-teal-700 h-3"></div>
                  <div className="p-4 bg-gradient-to-br from-green-50 to-teal-50">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="font-bold text-gray-800">Your Dashboard</h3>
                        <p className="text-sm text-gray-500">Welcome back, Alfredo</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-teal-600"></div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-gray-700">Total Balance</h4>
                        <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">+2.4%</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">Ksh 24,395.00</p>
                      <div className="h-2 w-full bg-gray-100 rounded-full mt-2">
                        <div className="h-2 rounded-full bg-gradient-to-r from-green-500 to-teal-600 w-3/4"></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="flex justify-between">
                          <span className="text-xs font-medium text-gray-500">Savings</span>
                          <PiggyBank className="h-4 w-4 text-pink-500" />
                        </div>
                        <p className="font-bold text-gray-800">Ksh 8,250</p>
                        <span className="text-xs text-green-600">+5.3%</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="flex justify-between">
                          <span className="text-xs font-medium text-gray-500">Investments</span>
                          <TrendingUp className="h-4 w-4 text-purple-500" />
                        </div>
                        <p className="font-bold text-gray-800">Ksh 16,145</p>
                        <span className="text-xs text-green-600">+1.8%</span>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-600 to-teal-700 rounded-lg p-4 text-white">
                      <div className="flex md:flex-row flex-col justify-between gap-5 md:items-center">
                        <div>
                          <p className="text-xs font-medium opacity-80">Smart Investment</p>
                          <p className="font-bold">AI Portfolio Suggestion</p>
                          <p className="text-xs mt-1 opacity-80">Projected return: +12.5%</p>
                        </div>
                        <Button className="bg-white/20 hover:bg-white/30 text-white text-xs py-1 px-3">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features section */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-700 via-teal-700 to-purple-700 bg-clip-text text-transparent">Revolutionary Features</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">Experience the next generation of financial technology with AI-powered insights and global accessibility.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Trust indicators */}
        <div className="bg-gradient-to-br from-green-900 to-teal-900 py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center text-white opacity-80">
              <div className="flex items-center">
                <Globe className="mr-2" />
                <span>Global Access</span>
              </div>
              <div className="flex items-center">
                <Lock className="mr-2" />
                <span>Bank-Grade Security</span>
              </div>
              <div className="flex items-center">
                <Shield className="mr-2" />
                <span>100% Asset Protection</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="mr-2" />
                <span>AI-Powered Growth</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA section */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-700 via-teal-700 to-purple-700 bg-clip-text text-transparent mb-6">
              Start Your Financial Evolution Today
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of forward-thinking individuals and businesses who have transformed their financial experience.
            </p>
            <Button 
              onClick={() => router.push('/auth')}
              className="bg-gradient-to-r from-green-600 to-teal-700 hover:from-green-700 hover:to-teal-800 text-white px-10 py-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Create Free Account <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-50 border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
             
              <h2 className="ml-2 text-lg font-bold bg-gradient-to-r from-green-700 to-teal-600 bg-clip-text text-transparent">H A Z I N A</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-green-700">Privacy</a>
              <a href="#" className="hover:text-green-700">Terms</a>
              <a href="#" className="hover:text-green-700">Support</a>
              <a href="#" className="hover:text-green-700">Contact</a>
            </div>
            <div className="mt-6 md:mt-0 text-sm text-gray-500">
              © 2025 Hazina. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}