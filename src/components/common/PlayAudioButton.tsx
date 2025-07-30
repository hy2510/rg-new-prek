import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { SoundManager } from '@utils/SoundManager'
import { IMAGES } from '@utils/ImageManager'

interface PlayAudioButtonProps {
  isVisible?: boolean
  audioLetter?: string
  questionType?: keyof (typeof SoundManager)['QUESTION_SOUNDS_BASE']
  className?: string
}

export default function PlayAudioButton({
  isVisible = true,
  audioLetter = 'a',
  questionType,
  className,
}: PlayAudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  // SoundManager 재생 상태 구독
  useEffect(() => {
    const unsubscribe = SoundManager.addPlayingStateListener(setIsPlaying)
    return unsubscribe
  }, [])

  // props 변경 시 재생 상태 초기화
  useEffect(() => {
    setIsPlaying(false)
  }, [audioLetter, questionType])

  const handlePlayAudio = useCallback(() => {
    const finalQuestionType = questionType || 'default'
    SoundManager.playQuestionSound(finalQuestionType, audioLetter)
  }, [audioLetter, questionType])

  return (
    <PlayAudioButtonContainer
      className={className}
      $isVisible={isVisible}
      $isPlaying={isPlaying}
      onClick={handlePlayAudio}
      disabled={isPlaying}
    />
  )
}

const PlayAudioButtonContainer = styled.button<{
  $isVisible: boolean
  $isPlaying: boolean
}>`
  position: absolute;
  top: 100px;
  left: 115px;
  width: 80px;
  height: 80px;
  border: none;
  background: transparent;
  background-image: ${({ $isPlaying }) =>
    $isPlaying
      ? `url(${IMAGES.common.button.stopSoundButton})`
      : `url(${IMAGES.common.button.playSoundButton})`};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  cursor: ${({ $isPlaying }) => ($isPlaying ? 'not-allowed' : 'pointer')};
  z-index: 10;
  opacity: ${({ $isVisible, $isPlaying }) => {
    if (!$isVisible) return 0
    return $isPlaying ? 0.5 : 1
  }};
  transform: ${({ $isVisible }) =>
    $isVisible ? 'translateY(0)' : 'translateY(20px)'};
  transition: opacity 500ms ease-in-out, transform 500ms ease-in-out;
`
