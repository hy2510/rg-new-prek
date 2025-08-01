import { createContext, useContext, ReactNode } from 'react'
import { useSounds } from '@hooks/useSounds'
import { ThemeType } from '@interfaces/IThemeType'

export interface ISoundContext extends ReturnType<typeof useSounds> {}

const SoundContext = createContext<ISoundContext | null>(null)

type SoundProviderProps = {
  children: ReactNode
  initialTheme?: ThemeType
  initialThemeNumber?: number
}

export function SoundProvider({
  children,
  initialTheme = 'Baro',
  initialThemeNumber = 1,
}: SoundProviderProps) {
  const sound = useSounds({
    theme: initialTheme,
    themeNumber: initialThemeNumber,
  })

  return (
    <SoundContext.Provider value={sound}>
      {children}
      {sound.renderAudioElements()}
    </SoundContext.Provider>
  )
}

export function useSoundContext(): ISoundContext {
  const context = useContext(SoundContext)

  if (!context) {
    throw new Error('useSoundContext must be used within a SoundProvider')
  }

  return context
}
