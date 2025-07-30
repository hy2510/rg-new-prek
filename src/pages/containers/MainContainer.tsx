import React, { useState, useEffect, useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { IStep, getStudyModule } from '@interfaces/IStep'
import { IMAGES, ImageManager } from '@utils/ImageManager'
import { ThemeType, ThemeNumber, SoundManager } from '@utils/SoundManager'
import { isIOS } from '@utils/isIOS'
import MainView from '@pages/MainView'
import SubViewContainer from './SubViewContainer'
import {
  CollectionBox,
  CollectionsShowcase,
} from '@components/common/Collections'
import StartButton from '@components/common/StartButton'
import DevButtons from '@components/common/DevButtons'
import CollectionItemPopup from '@components/common/CollectionItemPopup'

// 컬렉션 버튼 컴포넌트
interface CollectionsButtonProps {
  showCollections: boolean
  onToggle: () => void
}

const CollectionsButton = ({
  showCollections,
  onToggle,
}: CollectionsButtonProps) => {
  return (
    <CollectionsButtonContainer onClick={onToggle}>
      <img
        src={IMAGES.common.button.goToCollections}
        alt="컬렉션으로 이동"
        style={{ width: '80px', height: 'auto' }}
      />
    </CollectionsButtonContainer>
  )
}

// 화면 및 레이아웃 상수
const SCREEN_CONFIG = {
  BASE_WIDTH: 1280,
  BASE_HEIGHT: 720,
  STEP_COUNT: 6, // 0~5 (0은 영상, 1~5는 스텝)
} as const

// 애니메이션 및 타이밍 상수
const TIMING = {
  SCREEN_FADE: 400,
  SLIDE_TRANSITION: 500,
  FLOATING_DURATION: 3000,
} as const

type StudyType =
  | 'alphabet_1'
  | 'alphabet_2'
  | 'phonics1_1'
  | 'phonics1_2'
  | 'phonics2_1'
  | 'phonics2_2'
  | 'sightWords1_1'
  | 'sightWords1_2'
  | 'sightWords2_1'
  | 'sightWords2_2'

interface StepContentProps {
  stepNumber: number
  theme: ThemeType
  themeNumber: ThemeNumber
  isCompleted: boolean
  onStartStudy: () => void
  onReplay: () => void
  onNext: () => void
}

// 스텝 콘텐츠 컴포넌트 분리
const StepContent = ({
  stepNumber,
  theme,
  themeNumber,
  isCompleted,
  onStartStudy,
  onReplay,
  onNext,
}: StepContentProps) => {
  const getStepImage = useMemo(() => {
    const themeKey = `theme0${themeNumber}` as const
    const stepImages = IMAGES.theme[theme][themeKey].step

    switch (stepNumber) {
      case 0:
        return stepImages.stepMovie
      case 1:
        return stepImages.step1
      case 2:
        return stepImages.step2
      case 3:
        return stepImages.step3
      case 4:
        return stepImages.step4
      case 5:
        return stepImages.step5
      default:
        return stepImages.stepMovie
    }
  }, [stepNumber, theme, themeNumber])

  return (
    <StepWrapper $stepNumber={stepNumber}>
      <StepContentContainer>
        <div className="step-number">
          {stepNumber > 0 ? `Step ${stepNumber}` : 'Movie'}
          {isCompleted && (
            <img
              src={IMAGES.common.completeMarkCheck}
              alt="complete-mark-check"
              className="complete-mark-check"
            />
          )}
        </div>
        <StepImage
          src={getStepImage}
          alt={`step-${stepNumber}`}
          onClick={onStartStudy}
          $isCompleted={isCompleted}
        />
        {isCompleted && (
          <CompleteMarkContainer>
            <CompleteMarkCharacter
              src={IMAGES.theme[theme].quiz.character.completeCharacter}
              alt="complete-mark-character"
            />
            <CompleteMark
              src={IMAGES.common.completeMark}
              alt="complete-mark"
            />
            <ActionButtonsContainer>
              <ReplayButton onClick={onReplay}></ReplayButton>
              <NextButton onClick={onNext}></NextButton>
            </ActionButtonsContainer>
          </CompleteMarkContainer>
        )}
      </StepContentContainer>
    </StepWrapper>
  )
}

export default function MainContainer() {
  const [mainView, setMainView] = useState<IStep>('intro')
  const [scale, setScale] = useState(1)
  const [showScreenBlock, setShowScreenBlock] = useState(true)
  const [isScreenBlockFading, setIsScreenBlockFading] = useState(false)
  const [isSliding, setIsSliding] = useState(false)
  const [isShowStudyModule, setIsShowStudyModule] = useState(false)
  const [studyType, setStudyType] = useState<StudyType>('alphabet_1')
  const [theme, setTheme] = useState<ThemeType>('baro')
  const [themeNumber, setThemeNumber] = useState<ThemeNumber>(1)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [showCollectionItemPopup, setShowCollectionItemPopup] = useState(false)
  const [collectionPopupData, setCollectionPopupData] = useState<{
    character: 'baro' | 'chello' | 'millo'
    itemNumber: 1 | 2 | 3
    title?: string
  }>({
    character: 'baro',
    itemNumber: 2,
  })

  // 화면 크기에 따른 스케일 조정
  useEffect(() => {
    const updateScale = () => {
      const scaleX = window.innerWidth / SCREEN_CONFIG.BASE_WIDTH
      const scaleY = window.innerHeight / SCREEN_CONFIG.BASE_HEIGHT
      const isWideScreen =
        window.innerWidth / window.innerHeight >=
        SCREEN_CONFIG.BASE_WIDTH / SCREEN_CONFIG.BASE_HEIGHT
      setScale(isWideScreen ? scaleY : scaleX)
    }

    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  // 테마 변경 시 배경 음악 변경
  useEffect(() => {
    if (SoundManager.isAudioEnabled() && !showScreenBlock) {
      SoundManager.playBackgroundMusic(theme, themeNumber)
    }
  }, [theme, themeNumber, showScreenBlock])

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => SoundManager.cleanup()
  }, [])

  // 사용자 상호작용 시 오디오 활성화
  const handleUserInteraction = useCallback(() => {
    SoundManager.enableAudio()
    SoundManager.playBackgroundMusic(theme, themeNumber)
  }, [theme, themeNumber])

  // 화면 블록 페이드 아웃 처리
  const handleScreenBlockFadeOut = useCallback(() => {
    setIsScreenBlockFading(true)
    setTimeout(() => {
      setShowScreenBlock(false)
      setIsScreenBlockFading(false)
      handleUserInteraction()
    }, TIMING.SCREEN_FADE)
  }, [handleUserInteraction])

  // 학습 모듈 시작
  const handleStartStudy = useCallback(() => {
    SoundManager.playCommonSound('stepOpen')
    if (isIOS()) {
      SoundManager.reduceBackgroundMusicVolume()
      SoundManager.pauseBackgroundMusic()
    } else {
      SoundManager.reduceBackgroundMusicVolume()
    }
    setIsShowStudyModule(true)
  }, [])

  // 학습 모듈 닫기
  const handleCloseStudyModal = useCallback(() => {
    if (isIOS()) {
      SoundManager.resumeBackgroundMusic(theme, themeNumber)
    } else {
      SoundManager.restoreBackgroundMusicVolume()
    }
    setIsShowStudyModule(false)
  }, [theme, themeNumber])

  // 영상 완료 처리
  const handleMovieComplete = useCallback(() => {
    setCompletedSteps((prev) => new Set([...prev, 0]))
  }, [])

  // 퀴즈 완료 처리 (일반적인 스텝 완료)
  const handleStepComplete = useCallback(() => {
    console.log(`스텝 ${currentStep} 완료됨`)
    setCompletedSteps((prev) => new Set([...prev, currentStep]))
  }, [currentStep])

  // 스텝 다시 보기
  const handleReplay = useCallback(() => {
    setIsShowStudyModule(true)
  }, [])

  // 다음 스텝으로 이동
  const handleNextStep = useCallback(() => {
    if (currentStep < SCREEN_CONFIG.STEP_COUNT - 1) {
      setCurrentStep((prev) => prev + 1)
    } else if (currentStep === 5 && completedSteps.has(5)) {
      // Step5 완료 후 next 버튼을 누르면 컬렉션 아이템 팝업 표시
      setCollectionPopupData({
        character: theme,
        itemNumber: themeNumber as 1 | 2 | 3,
      })
      setShowCollectionItemPopup(true)
    }
  }, [currentStep, completedSteps, theme, themeNumber])

  // 컬렉션 아이템 팝업 닫기
  const handleCloseCollectionPopup = useCallback(() => {
    setShowCollectionItemPopup(false)
  }, [])

  // 컬렉션 아이템 획득 표시
  const showCollectionItem = useCallback(
    (
      character: 'baro' | 'chello' | 'millo',
      itemNumber: 1 | 2 | 3,
      title?: string,
    ) => {
      setCollectionPopupData({ character, itemNumber, title })
      setShowCollectionItemPopup(true)
    },
    [],
  )

  // 스텝 변경 처리
  const handleStepChange = useCallback(
    (stepNumber: number) => {
      if (stepNumber === currentStep) return

      setIsSliding(true)
      setCurrentStep(stepNumber)

      setTimeout(() => {
        setIsSliding(false)
      }, TIMING.SLIDE_TRANSITION)
    },
    [currentStep],
  )

  // 스텝 콘텐츠 렌더링
  const stepContents = useMemo(() => {
    return Array.from({ length: SCREEN_CONFIG.STEP_COUNT }, (_, i) => (
      <StepContent
        key={i}
        stepNumber={i}
        theme={theme}
        themeNumber={themeNumber}
        isCompleted={completedSteps.has(i)}
        onStartStudy={handleStartStudy}
        onReplay={handleReplay}
        onNext={handleNextStep}
      />
    ))
  }, [
    theme,
    themeNumber,
    completedSteps,
    handleStartStudy,
    handleReplay,
    handleNextStep,
  ])

  const currentStudyModule = useMemo(
    () => getStudyModule(studyType, currentStep),
    [studyType, currentStep],
  )

  const [showCollections, setShowCollections] = useState(false)

  return (
    <OuterWrapper>
      <ScaledContainer $scale={scale}>
        <DevButtons
          setTheme={setTheme}
          setThemeNumber={setThemeNumber}
          setStudyType={setStudyType}
        />

        {!isShowStudyModule && (
          <CollectionsButton
            showCollections={showCollections}
            onToggle={() => setShowCollections(!showCollections)}
          />
        )}

        {showCollections && (
          <CollectionsShowcase onClose={() => setShowCollections(false)} />
        )}

        {showCollectionItemPopup && (
          <CollectionItemPopup
            character={collectionPopupData.character}
            itemNumber={collectionPopupData.itemNumber}
            title={collectionPopupData.title}
            onClose={handleCloseCollectionPopup}
          />
        )}

        <MainView
          theme={theme}
          themeNumber={themeNumber}
          currentStep={currentStep}
          onStepChange={handleStepChange}
          isSliding={isSliding}
        />

        <StepContainer $currentStep={currentStep}>{stepContents}</StepContainer>

        {isShowStudyModule && (
          <SubViewContainer
            studyModule={currentStudyModule}
            handleCloseStudyModal={handleCloseStudyModal}
            theme={theme}
            themeNumber={themeNumber}
            onMovieComplete={handleMovieComplete}
            onStepComplete={handleStepComplete}
          />
        )}

        {showScreenBlock && (
          <ScreenBlock $isFading={isScreenBlockFading}>
            <CollectionsWrapper>
              <CollectionBox character={theme} text={theme.toUpperCase()} />
              <StartButton onClick={handleScreenBlockFadeOut} />
            </CollectionsWrapper>
          </ScreenBlock>
        )}
      </ScaledContainer>
    </OuterWrapper>
  )
}

const OuterWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const ScaledContainer = styled.div<{ $scale: number }>`
  position: relative;
  width: ${SCREEN_CONFIG.BASE_WIDTH}px;
  height: ${SCREEN_CONFIG.BASE_HEIGHT}px;
  transform: scale(${({ $scale }) => $scale});
  transform-origin: center;
  overflow: hidden;
`

const StepContainer = styled.div<{ $currentStep: number }>`
  position: relative;
  width: calc(${SCREEN_CONFIG.BASE_WIDTH}px * ${SCREEN_CONFIG.STEP_COUNT - 1});
  height: ${SCREEN_CONFIG.BASE_HEIGHT}px;
  transform: translateX(
    calc(-${SCREEN_CONFIG.BASE_WIDTH}px * ${({ $currentStep }) => $currentStep})
  );
  transition: transform ${TIMING.SLIDE_TRANSITION}ms ease-in-out;
`

const StepWrapper = styled.div<{ $stepNumber: number }>`
  position: absolute;
  top: 0;
  left: calc(
    ${SCREEN_CONFIG.BASE_WIDTH}px * ${({ $stepNumber }) => $stepNumber}
  );
  width: ${SCREEN_CONFIG.BASE_WIDTH}px;
  height: ${SCREEN_CONFIG.BASE_HEIGHT}px;
`

const StepContentContainer = styled.div`
  position: absolute;
  top: 80px;
  right: 100px;
  width: 450px;
  height: 360px;
  cursor: pointer;
  z-index: 10;
  animation: floating ${TIMING.FLOATING_DURATION}ms ease-in-out infinite;

  .step-number {
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    font-size: 24px;
    font-weight: bold;
    background-color: #1a1a1a;
    color: #fff;
    font-size: 1em;
    padding: 10px 20px;
    border-radius: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    .complete-mark-check {
      width: auto;
      height: 20px;
    }
  }

  @keyframes floating {
    0%,
    100% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(10px);
    }
  }
`

const StepImage = styled.img<{ $isCompleted: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: ${({ $isCompleted }) => ($isCompleted ? 'grayscale(50%)' : 'none')};
  opacity: ${({ $isCompleted }) => ($isCompleted ? 0.5 : 1)};
`

const CompleteMarkContainer = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 100px;
  -webkit-backdrop-filter: blur(1px);
  backdrop-filter: blur(1px);
`

const CompleteMarkCharacter = styled.img`
  position: absolute;
  left: 50%;
  bottom: 135px;
  transform: translateX(-50%);
  width: 180px;
  height: 180px;
  z-index: 2;
`

const CompleteMark = styled.img`
  position: absolute;
  left: 50%;
  bottom: 80px;
  transform: translateX(-50%);
  width: auto;
  height: 180px;
  z-index: 1;
`

const ActionButtonsContainer = styled.div`
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
`

const ReplayButton = styled.button`
  width: 120px;
  height: 80px;
  background-color: transparent;
  background-image: url(${IMAGES.common.button.tryAgain});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  border: none;
  cursor: pointer;
  transition: all 0.1s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`

const NextButton = styled.button`
  width: 180px;
  height: 80px;
  background-color: transparent;
  background-image: url(${IMAGES.common.button.next});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  transition: all 0.1s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`
const ScreenBlock = styled.div<{ $isFading: boolean }>`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  opacity: ${({ $isFading }) => ($isFading ? 0 : 1)};
  pointer-events: ${({ $isFading }) => ($isFading ? 'none' : 'auto')};
  transition: opacity ${TIMING.SCREEN_FADE}ms ease-in-out;

  &:hover {
    background-color: rgba(0, 0, 0, 0.4);
  }
`

const CollectionsWrapper = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;
`

const CollectionsButtonContainer = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`
