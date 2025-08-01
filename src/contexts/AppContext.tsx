import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'

import { IStudyInfo } from '@interfaces/IStudyInfo'
import { getInfoData } from '@services/api'

interface AppContextType {
  isLoading: boolean
  loadingProgress: number
  studyInfo: IStudyInfo
  setLoading: (loading: boolean) => void
  setLoadingProgress: (progress: number) => void
  updateLoadingProgress: (increment: number) => void
}

const defaultStudyInfo: IStudyInfo = {
  Book: '',
  Mode: '',
  Server: '',
  StudyId: '',
  StudentHistoryId: '',
  Url: '',
  User: '',
}

export const AppContext = createContext<AppContextType | undefined>(undefined)

export default function AppContextProvider({
  children,
}: {
  children: ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)

  const [studyInfo, setStudyInfo] = useState<IStudyInfo>(defaultStudyInfo)

  const setLoading = (loading: boolean) => {
    setIsLoading(loading)
  }

  const updateLoadingProgress = (increment: number) => {
    setLoadingProgress((prev) => Math.min(100, prev + increment))
  }

  const value: AppContextType = {
    isLoading,
    loadingProgress,
    studyInfo,
    setLoading,
    setLoadingProgress,
    updateLoadingProgress,
  }

  useEffect(() => {
    const apiStudyInfo = window.sessionStorage.getItem('apiStudyInfo')

    if (apiStudyInfo) {
      const parsedStudyInfo = JSON.parse(apiStudyInfo)
      const studyInfo: IStudyInfo = {
        Book: parsedStudyInfo.book,
        Mode: parsedStudyInfo.mode,
        Server: parsedStudyInfo.server,
        StudyId: parsedStudyInfo.stdid,
        StudentHistoryId: parsedStudyInfo.sthid,
        Url: parsedStudyInfo.url,
        User: parsedStudyInfo.user,
      }
      setStudyInfo(studyInfo)
      getInfoData(studyInfo.StudyId, studyInfo.StudentHistoryId)
    }
  }, [])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useAppContext must be used within a AppContextProvider')
  }

  return context
}
