import styled from 'styled-components'
import { IMAGES } from '@utils/ImageManager'
import { useRef, useState, useEffect } from 'react'
import { SoundManager } from '@utils/SoundManager'

export default function AudioOnlyQuestion() {
  const objectRef = useRef<HTMLObjectElement>(null)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)

  // SoundManager의 재생 상태 변경을 감지하는 리스너 등록
  useEffect(() => {
    const unsubscribe = SoundManager.addPlayingStateListener((playing) => {
      setIsPlayingAudio(playing)
    })

    // 컴포넌트 언마운트 시 리스너 해제
    return unsubscribe
  }, [])

  return (
    <AudioOnlyQuestionContainer>
      <div className="btn-play-sound" style={{ cursor: 'pointer' }}>
        {isPlayingAudio && (
          <object
            ref={objectRef}
            data={IMAGES.common.button.radioCastPlay}
            type="image/svg+xml"
            width="100%"
            className="object-position"
            style={{ zIndex: 10 }}
          />
        )}
        <object
          ref={objectRef}
          data={IMAGES.common.button.radioCastStop}
          type="image/svg+xml"
          width="100%"
          className="object-position"
        />
      </div>
    </AudioOnlyQuestionContainer>
  )
}

const AudioOnlyQuestionContainer = styled.div`
  width: 100%;
  height: 320px;
  display: flex;
  justify-content: center;
  align-items: start;
  position: relative;

  .btn-play-sound {
    width: calc(100% - 40px);
    height: 280px;
  }

  .object-position {
    position: absolute;
    top: 0;
    left: 0;
  }
`
