import styled, { keyframes } from 'styled-components'

interface LoadingScreenProps {
  progress: number
  isVisible: boolean
}

export default function LoadingScreen({
  progress,
  isVisible,
}: LoadingScreenProps) {
  if (!isVisible) return null

  return (
    <LoadingContainer>
      <LoadingContent>
        <LoadingSpinner />
        <LoadingTitle>Please wait...</LoadingTitle>
        {/* <ProgressBarContainer>
          <ProgressBar $progress={progress} />
          <ProgressText>{Math.round(progress)}%</ProgressText>
        </ProgressBarContainer> */}
        {/* <LoadingSubtitle>Please wait...</LoadingSubtitle> */}
      </LoadingContent>
    </LoadingContainer>
  )
}

const LoadingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #1a1a1a;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  font-family: 'SDRGGothicNeoRound', sans-serif;
`

const LoadingContent = styled.div`
  text-align: center;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const LoadingSpinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`

const LoadingTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`

const LoadingSubtitle = styled.p`
  font-size: 16px;
  margin: 0;
  opacity: 0.8;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`

const ProgressBarContainer = styled.div`
  width: 300px;
  position: relative;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  height: 12px;
  overflow: hidden;
`

const ProgressBar = styled.div<{ $progress: number }>`
  width: ${({ $progress }) => $progress}%;
  height: 100%;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 20px;
  transition: width 0.3s ease-in-out;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent
    );
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`

const ProgressText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 10px;
  font-weight: bold;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  z-index: 1;
`
