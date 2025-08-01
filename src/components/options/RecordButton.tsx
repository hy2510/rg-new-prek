import { Images } from '@utils/Assets'
import styled from 'styled-components'

interface RecordButtonProps {
  progress?: number // 0-100 사이의 값
  isRecording?: boolean
  onStartRecording?: () => void
  onStopRecording?: () => void
}

export default function RecordButton({
  progress = 0,
  isRecording = false,
  onStartRecording,
  onStopRecording,
}: RecordButtonProps) {
  const handleRecordClick = () => {
    if (isRecording) {
      onStopRecording?.()
    } else {
      onStartRecording?.()
    }
  }

  return (
    <RecordButtonContainer>
      {isRecording ? (
        <RecordRecButton
          progress={progress}
          onClick={handleRecordClick}
          isRecording={isRecording}
        />
      ) : (
        <RecordReadyButton onClick={handleRecordClick} />
      )}

      {/* 녹음이 끝나고 나타나는 버튼들 */}
      <div style={{ display: 'none' }}>
        <RecordPlayButton />
        <RecordNextButton />
      </div>
    </RecordButtonContainer>
  )
}

const RecordButtonContainer = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  justify-content: center;
`

const RecordReadyButton = styled.div`
  width: 100px;
  height: 100px;
  background-image: url(${Images.Common.Button.btnRecordReady});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transition: transform 0.1s ease-in-out;
  cursor: pointer;

  &:active {
    transform: scale(0.9);
  }
`

const RecordRecButton = styled.div<{ progress: number; isRecording: boolean }>`
  width: 100px;
  height: 100px;
  background-image: url(${Images.Common.Button.btnRecordRec});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transition: transform 0.1s ease-in-out;
  position: relative;
  z-index: 1;

  &:active {
    transform: scale(0.9);
  }

  /* 도넛 프로그레스 바 */
  &::before {
    content: '';
    position: absolute;
    top: -7.5%;
    left: -7.5%;
    width: 115%;
    height: 115%;
    border-radius: 50%;
    z-index: -1;
    background: conic-gradient(
      #b73133 0deg ${({ progress }) => progress * 3.6}deg,
      rgba(255, 255, 255, 0.3) ${({ progress }) => progress * 3.6}deg 360deg
    );
    mask: radial-gradient(circle, transparent 48px, black 48px);
    -webkit-mask: radial-gradient(circle, transparent 48px, black 48px);
    transition: all 0.3s ease-in-out;
  }

  &::after {
    content: '';
    position: absolute;
    top: -10%;
    left: -10%;
    width: 120%;
    height: 120%;
    background-color: rgba(170, 0, 0, 0.85);
    border-radius: 50%;
    animation: ${({ isRecording }) =>
      isRecording ? 'ping 1.5s ease-in-out infinite both' : 'none'};
    opacity: ${({ isRecording }) => (isRecording ? 1 : 0)};

    @keyframes ping {
      0% {
        -webkit-transform: scale(0.2);
        transform: scale(0.2);
        opacity: 0.8;
      }
      80% {
        -webkit-transform: scale(1.2);
        transform: scale(1.2);
        opacity: 0;
      }
      100% {
        -webkit-transform: scale(2.2);
        transform: scale(2.2);
        opacity: 0;
      }
    }
  }
`

const RecordPlayButton = styled.div`
  width: 100px;
  height: 100px;
  background-image: url(${Images.Common.Button.btnRecordPlay});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transition: transform 0.1s ease-in-out;

  &:active {
    transform: scale(0.9);
  }
`

const RecordNextButton = styled.div`
  width: 100px;
  height: 100px;
  background-image: url(${Images.Common.Button.btnRecordNext});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transition: transform 0.1s ease-in-out;

  &:active {
    transform: scale(0.9);
  }
`
