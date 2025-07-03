import { createContext, useContext } from 'react'

export const AppContext = createContext({})

export default function AppContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppContext.Provider value={{}}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useAppContext must be used within a SoundProvider')
  }

  return context
}
