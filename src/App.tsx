import React, { Suspense, useEffect, useRef } from 'react'
import AppContextProvider, { useAppContext } from '@contexts/AppContext'
import LoadingScreen from '@components/common/LoadingScreen'
import { ImageManager } from '@utils/ImageManager'
import { SoundManager } from '@utils/SoundManager'

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

        // 이미지 프리로딩 (100% 할당)
        await ImageManager.preloadImages((loaded, total) => {
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
          if (!SoundManager.isCurrentlyPreloading()) {
            SoundManager.preloadSounds((loaded, total) => {
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
      {!isLoading && (
        <Suspense fallback={''}>
          <MainContainer />
        </Suspense>
      )}
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
