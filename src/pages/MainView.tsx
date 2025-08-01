import { useEffect, useRef } from 'react'

import styled from 'styled-components'
import { Images } from '@utils/Assets'
import 'animate.css'

import { ThemeType } from '@interfaces/IThemeType'

type MainViewProps = {
  step?: number
  theme?: ThemeType
  themeNumber?: number
  currentStep?: number
  totalSteps?: number
  onStepChange?: (stepNumber: number) => void
  isSliding?: boolean
}

// 배경 애니메이션 설정 타입
type BackgroundAnimationConfig = {
  speed: number
  cycle: number
}

// 배경 애니메이션 설정
const BACKGROUND_ANIMATIONS: Record<string, BackgroundAnimationConfig> = {
  bg1: { speed: 0.01, cycle: 80 }, // 80초 주기
  bg2: { speed: 0.02, cycle: 60 }, // 60초 주기
  bg3: { speed: 0.08, cycle: 30 }, // 30초 주기
  bg4: { speed: 0.12, cycle: 10 }, // 10초 주기
  bg5: { speed: 0.1, cycle: 5 }, // 5초 주기
}

/**
 * 메인 뷰 컴포넌트 - 캐릭터, 스텝 인디케이터, 배경 애니메이션을 포함한 메인 화면
 */
export default function MainView({
  step,
  theme = 'Baro',
  themeNumber = 1,
  currentStep = 0,
  totalSteps = 5,
  onStepChange,
  isSliding = false,
}: MainViewProps) {
  // 배경 애니메이션을 위한 ref들
  const backgroundRefs = {
    bg1: useRef<HTMLDivElement>(null),
    bg2: useRef<HTMLDivElement>(null),
    bg3: useRef<HTMLDivElement>(null),
    bg4: useRef<HTMLDivElement>(null),
    bg5: useRef<HTMLDivElement>(null),
  }

  // 사용자 상호작용 시 오디오 활성화 및 배경음악 재생
  const handleUserInteraction = () => {
    // SoundManager.enableAudio()
    // SoundManager.playBackgroundMusic(theme, themeNumber)
  }

  // 스텝 변경 시 호출되는 함수
  const handleStepChange = (stepNumber: number) => {
    onStepChange?.(stepNumber)
  }

  // 배경 이미지들의 자동 스크롤 애니메이션 설정
  useEffect(() => {
    let animationId: number
    let lastTimestamp: number

    const animateBackground = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp

      const deltaTime = timestamp - lastTimestamp
      lastTimestamp = timestamp

      // 각 배경 이미지에 대해 애니메이션 적용
      Object.entries(backgroundRefs).forEach(([key, ref]) => {
        if (ref.current) {
          const config = BACKGROUND_ANIMATIONS[key]
          const currentPosition = parseFloat(
            ref.current.style.backgroundPositionX || '0',
          )
          const newPosition = currentPosition - config.speed * deltaTime
          const finalPosition = newPosition % 1350
          ref.current.style.backgroundPosition = `${finalPosition}px 0`
        }
      })

      animationId = requestAnimationFrame(animateBackground)
    }

    animationId = requestAnimationFrame(animateBackground)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  // 테마별 배경 이미지 경로 생성
  const getBackgroundImage = (
    bgName: 'bg01' | 'bg02' | 'bg03' | 'bg04' | 'bg05',
  ) => {
    const themeAssets = (Images.Theme as any)[theme][`Theme0${themeNumber}`]
    return themeAssets[bgName]
  }

  // 테마별 캐릭터 이미지 경로 생성
  const getCharacterImage = () => {
    const themeAssets = (Images.Theme as any)[theme][`Theme0${themeNumber}`]
    return themeAssets[theme.toLowerCase()]
  }

  // 스텝 상태에 따른 CSS 클래스명 결정
  const getStepItemClass = (stepNumber: number) => {
    if (stepNumber === 0) return 'step-indicator-item step-movie-mark'
    if (stepNumber < currentStep)
      return 'step-indicator-item step-completed-mark'
    if (stepNumber === currentStep)
      return 'step-indicator-item step-current-mark'
    return 'step-indicator-item'
  }

  // 스텝 인디케이터 아이템들을 렌더링
  const renderStepItems = () => {
    const items = []

    // 첫 번째 아이템은 항상 movie mark
    items.push(
      <div
        key="movie"
        className="step-indicator-item step-movie-mark"
        onClick={() => handleStepChange(0)}
      />,
    )

    // 나머지 스텝들 (1~totalSteps)
    for (let i = 1; i <= totalSteps; i++) {
      const className = getStepItemClass(i)
      const content = i <= currentStep ? '' : i.toString()

      items.push(
        <div key={i} className={className} onClick={() => handleStepChange(i)}>
          {content}
        </div>,
      )
    }

    return items
  }

  return (
    <>
      <Character onClick={handleUserInteraction}>
        <object
          data={getCharacterImage()}
          type="image/svg+xml"
          width="100%"
          height="100%"
        />
      </Character>

      <StepIndicatorContainer>
        <div className="step-indicator-item-container">{renderStepItems()}</div>
      </StepIndicatorContainer>

      <BackgroundContainer>
        <BackgroundImage
          ref={backgroundRefs.bg1}
          bgImage={getBackgroundImage('bg01')}
          position="top"
          height="250px"
          zIndex={1}
        />
        <BackgroundImage
          ref={backgroundRefs.bg2}
          bgImage={getBackgroundImage('bg02')}
          position="top"
          height="250px"
          zIndex={1}
        />
        <BackgroundImage
          ref={backgroundRefs.bg3}
          bgImage={getBackgroundImage('bg03')}
          position="bottom"
          height="470px"
          bottom="0"
          zIndex={3}
        />
        <BackgroundImage
          ref={backgroundRefs.bg4}
          bgImage={getBackgroundImage('bg04')}
          position="bottom"
          height="269px"
          bottom="20px"
          zIndex={4}
        />
        <BackgroundImage
          ref={backgroundRefs.bg5}
          bgImage={getBackgroundImage('bg05')}
          position="bottom"
          height="213px"
          bottom="-20px"
          zIndex={5}
        />
      </BackgroundContainer>
    </>
  )
}

// 스타일 컴포넌트들
const StepIndicatorContainer = styled.div`
  position: absolute;
  left: 0;
  bottom: 30px;
  width: 100%;
  height: 30px;
  z-index: 1;

  .step-indicator-item-container {
    display: flex;
    gap: 50px;
    justify-content: center;
    align-items: center;
    position: relative;
    width: fit-content;
    margin: auto;

    &::before {
      content: '';
      position: absolute;
      top: 10px;
      left: 10px;
      width: calc(100% - 20px);
      height: 10px;
      background: linear-gradient(
        to bottom,
        #ffffff 0%,
        #ffffff 50%,
        #ececec 50%,
        #ececec 100%
      );
      border: 1px solid #878787;
      z-index: -1;
      opacity: 0.5;
    }

    .step-indicator-item {
      width: 30px;
      height: 30px;
      background-image: url(${Images.Common.StepIndicator.stepNumberBg});
      background-size: 100% 100%;
      background-repeat: no-repeat;
      color: #303030;
      font-family: 'SDRG Gothic Neo Round';
      font-size: 0.85em;
      font-weight: bold;
      text-align: center;
      line-height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top: 2px;
      cursor: pointer;
      transition: transform 0.2s ease;

      &.step-movie-mark {
        background-image: url(${Images.Common.StepIndicator.stepMovieMark});
      }

      &.step-current-mark {
        background-image: url(${Images.Common.StepIndicator.stepCurrentMark});
      }

      &.step-completed-mark {
        background-image: url(${Images.Common.StepIndicator.stepCompletedMark});
      }
    }
  }
`

const Character = styled.div`
  position: absolute;
  top: 100px;
  left: 100px;
  width: 550px;
  height: 500px;
  z-index: 2;
`

const BackgroundContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
`

const BackgroundImage = styled.div<{
  bgImage: string
  position: 'top' | 'bottom'
  height: string
  bottom?: string
  zIndex: number
}>`
  position: absolute;
  left: 0;
  width: 100%;
  height: ${(props) => props.height};
  background-image: url(${(props) => props.bgImage});
  background-repeat: repeat-x;
  background-size: 1350px ${(props) => props.height};
  z-index: ${(props) => props.zIndex};

  ${(props) =>
    props.position === 'top'
      ? `
        top: 0;
        background-position: 0 0;
      `
      : `
        bottom: ${props.bottom || '0'};
      `}
`
