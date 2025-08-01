import { useCallback, useEffect, useState } from 'react'

import styled from 'styled-components'
import { Images } from '@utils/Assets'
import { useSounds } from '@hooks/useSounds'

interface PlayAudioButtonProps {
  isVisible?: boolean
  audioLetter?: string
  questionType?: string
  className?: string
}

export default function PlayAudioButton({
  isVisible = true,
  audioLetter = 'a',
  questionType,
  className,
}: PlayAudioButtonProps) {
  const { playAudioLetter, isAudioLetterPlaying } = useSounds()
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    playAudioLetter(audioLetter)
  }, [])

  // isAudioLetterPlaying 상태를 isPlaying에 반영
  useEffect(() => {
    setIsPlaying(isAudioLetterPlaying)
  }, [isAudioLetterPlaying])

  // props 변경 시 재생 상태 초기화
  useEffect(() => {
    setIsPlaying(false)
  }, [audioLetter, questionType])

  const handlePlayAudio = useCallback(() => {
    console.log('PlayAudioButton 클릭됨:', audioLetter)
    playAudioLetter(audioLetter)
  }, [audioLetter, playAudioLetter])

  return (
    <PlayAudioButtonContainer
      className={className}
      isVisible={isVisible}
      isPlaying={isPlaying}
      onClick={handlePlayAudio}
      disabled={isPlaying}
    />
  )
}

const PlayAudioButtonContainer = styled.button<{
  isVisible: boolean
  isPlaying: boolean
}>`
  position: absolute;
  top: 100px;
  left: 115px;
  width: 80px;
  height: 80px;
  border: none;
  background: transparent;
  background-image: ${({ isPlaying }) =>
    isPlaying
      ? `url(${Images.Common.Button.btnStopSound})`
      : `url(${Images.Common.Button.btnPlaySound})`};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  cursor: ${({ isPlaying }) => (isPlaying ? 'not-allowed' : 'pointer')};
  z-index: 10;
  opacity: ${({ isVisible, isPlaying }) => {
    if (!isVisible) return 0
    return isPlaying ? 0.5 : 1
  }};
  transform: ${({ isVisible }) =>
    isVisible ? 'translateY(0)' : 'translateY(20px)'};
  transition: opacity 500ms ease-in-out, transform 500ms ease-in-out;
`
