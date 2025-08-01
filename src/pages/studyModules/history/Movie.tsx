import { useState, useEffect, useCallback } from 'react'

import styled from 'styled-components'

import { useAppContext } from '@contexts/AppContext'
import { getMovieData } from '@services/api'

import { ThemeType } from '@interfaces/IThemeType'
import { IMovieInfo } from '@interfaces/IStudyInfo'
import { MOVIE_CONFIG } from '@constants/constant'

interface MovieProps {
  theme?: ThemeType
  themeNumber?: number
  closeTrigger?: number
  onClose?: () => void
  onComplete?: () => void
}

export default function Movie({
  theme = 'Baro',
  themeNumber = 1,
  closeTrigger,
  onClose,
  onComplete,
}: MovieProps) {
  const { studyInfo } = useAppContext()

  const [isClosing, setIsClosing] = useState(false)
  const [videoData, setVideoData] = useState<IMovieInfo>({
    AnimationPath: '',
    AnimationPoster: '',
  })
  const [isLoading, setIsLoading] = useState(true)

  // 비디오 로딩 및 배경음 관리
  useEffect(() => {
    let isMounted = true

    const getMovie = async () => {
      const data = await getMovieData(
        studyInfo.StudyId,
        studyInfo.StudentHistoryId,
      )

      setVideoData(data)
      setIsLoading(false)
    }

    getMovie()

    return () => {
      isMounted = false
    }
  }, [theme, themeNumber])

  // closeTrigger 변경 시 페이드아웃 처리
  useEffect(() => {
    if (closeTrigger && closeTrigger > 0) {
      handleCloseWithFade()
    }
  }, [closeTrigger])

  // 페이드아웃 및 닫기 처리
  const handleCloseWithFade = useCallback(() => {
    setIsClosing(true)
    setTimeout(() => {
      onClose?.()
    }, MOVIE_CONFIG.TIMING.FADE_OUT_DURATION)
  }, [onClose])

  // 비디오 종료 처리
  const handleVideoEnded = useCallback(() => {
    // 완료 콜백 호출
    onComplete?.()

    // 자동 닫기
    if (onClose) {
      setTimeout(() => {
        handleCloseWithFade()
      }, MOVIE_CONFIG.TIMING.AUTO_CLOSE_DELAY)
    }
  }, [onComplete, onClose, handleCloseWithFade])

  // 로딩 화면
  if (isLoading) {
    return (
      <MovieWrapper isClosing={isClosing}>
        <LoadingContainer>
          <LoadingText>Loading...</LoadingText>
        </LoadingContainer>
      </MovieWrapper>
    )
  }

  return (
    <MovieWrapper isClosing={isClosing}>
      <VideoPlayer
        src={videoData.AnimationPath}
        poster={videoData.AnimationPoster}
        controls
        controlsList="nodownload"
        disablePictureInPicture
        autoPlay
        onEnded={handleVideoEnded}
        onError={() => {
          if (process.env.NODE_ENV === 'development') {
            console.error('비디오 재생 오류 발생')
          }
        }}
      />
    </MovieWrapper>
  )
}

const CompleteMarkCharacter = styled.img`
  position: absolute;
  top: 120px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
`

const MovieWrapper = styled.div<{ isClosing: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 15px;
  overflow: hidden;
  opacity: ${({ isClosing }) => (isClosing ? 0 : 1)};
  transition: opacity ${MOVIE_CONFIG.TIMING.FADE_OUT_DURATION}ms ease-in-out;
`

const VideoPlayer = styled.video`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const LoadingContainer = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.8);
`

const LoadingText = styled.div`
  color: white;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
`
