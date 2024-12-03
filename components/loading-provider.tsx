"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { LoadingSpinner } from "./loading-spinner"

const LoadingContext = createContext({
  isLoading: false,
  setIsLoading: (value: boolean) => {},
})

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleStart = () => setIsLoading(true)
    const handleStop = () => setIsLoading(false)

    window.addEventListener("beforeunload", handleStart)
    window.addEventListener("load", handleStop)

    return () => {
      window.removeEventListener("beforeunload", handleStart)
      window.removeEventListener("load", handleStop)
    }
  }, [])

  useEffect(() => {
    setIsLoading(true)
    const timeout = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timeout)
  }, [pathname, searchParams])

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {isLoading && <LoadingSpinner />}
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = () => useContext(LoadingContext)
