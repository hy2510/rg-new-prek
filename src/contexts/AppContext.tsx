import { createContext, useContext, useState, ReactNode } from 'react'

interface AppContextType {
  isLoading: boolean
  loadingProgress: number
  setLoading: (loading: boolean) => void
  setLoadingProgress: (progress: number) => void
  updateLoadingProgress: (increment: number) => void
}

export const AppContext = createContext<AppContextType | undefined>(undefined)

export default function AppContextProvider({
  children,
}: {
  children: ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)

  const setLoading = (loading: boolean) => {
    setIsLoading(loading)
  }

  const updateLoadingProgress = (increment: number) => {
    setLoadingProgress((prev) => Math.min(100, prev + increment))
  }

  const value: AppContextType = {
    isLoading,
    loadingProgress,
    setLoading,
    setLoadingProgress,
    updateLoadingProgress,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useAppContext must be used within a AppContextProvider')
  }

  return context
}
