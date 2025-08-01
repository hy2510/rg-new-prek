import React, { Suspense, useEffect, useRef, useState } from 'react'

import AppContextProvider, { useAppContext } from '@contexts/AppContext'
import { SoundProvider } from '@contexts/SoundContext'

import { AssetsManager } from '@utils/AssetsManager'
import { ThemeType } from '@interfaces/IThemeType'

import LoadingScreen from '@components/common/LoadingScreen'

const MainContainer = React.lazy(
  () => import('@pages/containers/MainContainer'),
)

function AppContent() {
  const {
    isLoading,
    loadingProgress,
    setLoading,
    setLoadingProgress,
    updateLoadingProgress,
  } = useAppContext()

  // DB에서 받아올 theme 정보 상태
  const [themeInfo, setThemeInfo] = useState<{
    theme: ThemeType
    themeNumber: number
  }>({ theme: 'Baro', themeNumber: 1 })

  // 한 번만 실행되도록 보장하는 ref
  const hasExecutedRef = useRef(false)

  useEffect(() => {
    // 이미 실행되었다면 즉시 리턴
    if (hasExecutedRef.current) {
      return
    }
    hasExecutedRef.current = true

    const preloadResources = async () => {
      try {
        console.log('안전한 프리로딩 시작...')
        setLoadingProgress(0)

        // DB에서 theme 정보 가져오기 (예시)
        const fetchThemeInfo = async () => {
          try {
            // 실제 DB 호출 로직으로 교체
            // const response = await fetch('/api/theme-info')
            // const data = await response.json()
            // setThemeInfo({ theme: data.theme, themeNumber: data.themeNumber })

            // 임시로 하드코딩된 값 사용
            setThemeInfo({ theme: 'Baro', themeNumber: 1 })
          } catch (error) {
            console.error('Theme 정보 가져오기 실패:', error)
            // 기본값 사용
            setThemeInfo({ theme: 'Baro', themeNumber: 1 })
          }
        }

        await fetchThemeInfo()

        // 이미지 프리로딩 (100% 할당)
        await AssetsManager.preloadCommonImages((loaded, total) => {
          const imageProgress = (loaded / total) * 100
          setLoadingProgress(imageProgress)
          if (process.env.NODE_ENV === 'development') {
            console.log(
              `이미지 로딩: ${loaded}/${total} (${Math.round(imageProgress)}%)`,
            )
          }
        })

        console.log('이미지 프리로딩 완료! 2초 후 로딩 스크린이 사라집니다.')

        // 이미지 로딩 완료 후 2초 대기한 후 로딩 스크린 해제
        setTimeout(() => {
          setLoading(false)
          console.log('로딩 스크린 해제됨')

          // 백그라운드에서 사운드 프리로딩 시작 (한 번만 실행)
          if (!AssetsManager.isCurrentlyPreloading()) {
            AssetsManager.preloadCommonSounds((loaded, total) => {
              if (process.env.NODE_ENV === 'development') {
                console.log(`백그라운드 사운드 로딩: ${loaded}/${total}`)
              }
            })
              .then(() => {
                console.log('사운드 프리로딩 완료!')
              })
              .catch((error) => {
                console.error('사운드 프리로딩 오류:', error)
              })
          }
        }, 2000)
      } catch (error) {
        console.error('이미지 프리로딩 중 오류 발생:', error)
        // 오류가 발생해도 2초 후 앱을 실행
        setTimeout(() => {
          setLoading(false)
        }, 2000)
      }
    }

    preloadResources()
  }, [setLoading, setLoadingProgress])

  return (
    <>
      <LoadingScreen progress={loadingProgress} isVisible={isLoading} />

      <SoundProvider
        initialTheme={themeInfo.theme}
        initialThemeNumber={themeInfo.themeNumber}
      >
        <Suspense fallback={''}>{!isLoading && <MainContainer />}</Suspense>
      </SoundProvider>
    </>
  )
}

export default function App() {
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  )
}
