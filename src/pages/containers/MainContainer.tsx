import { useState, useEffect, useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { useAppContext } from '@contexts/AppContext'
import { getQuizData } from '@services/api'

import { getStudyModule } from '@interfaces/IStep'
import { ThemeType } from '@interfaces/IThemeType'
import { SCREEN_CONFIG, TIMING } from '@constants/constant'

import { useSoundContext } from '@contexts/SoundContext'

import { isIOS } from 'react-device-detect'

import ScaledContainer from '@pages/containers/ScaledContainer'
import SubViewContainer from '@pages/containers/SubViewContainer'
import StepContainer from '@pages/containers/StepContainer'

import CollectionButton from '@components/common/CollectionButton'
import MainView from '@pages/MainView'
import {
  CollectionBox,
  CollectionsShowcase,
} from '@components/common/Collections'
import StartButton from '@components/common/StartButton'
import CollectionItemPopup from '@components/common/CollectionItemPopup'
import { IQuizInfo } from '@interfaces/IStudyInfo'

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

export default function MainContainer() {
  const { studyInfo } = useAppContext()
  const { audioList, playSound, pauseSound, resumeSound } = useSoundContext()

  const [scale, setScale] = useState(1)
  const [showScreenBlock, setShowScreenBlock] = useState(true)
  const [isScreenBlockFading, setIsScreenBlockFading] = useState(false)
  const [isSliding, setIsSliding] = useState(false)
  const [isShowStudyModule, setIsShowStudyModule] = useState(false)
  const [showCollections, setShowCollections] = useState(false)

  const [studyType, setStudyType] = useState<StudyType>('alphabet_1')
  const [theme, setTheme] = useState<ThemeType>('Baro')
  const [themeNumber, setThemeNumber] = useState<number>(1)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const [quizData, setQuizData] = useState<IQuizInfo['quiz']>([])

  const [showCollectionItemPopup, setShowCollectionItemPopup] = useState(false)
  const [collectionPopupData, setCollectionPopupData] = useState<{
    character: ThemeType
    itemNumber: 1 | 2 | 3
    title?: string
  }>({
    character: 'Baro',
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

  useEffect(() => {
    const getQuiz = async () => {
      const quizData = await getQuizData(
        studyInfo.StudyId,
        studyInfo.StudentHistoryId,
        currentStep,
        'A',
      )

      setQuizData([...quizData.quiz])
    }

    getQuiz()
  }, [currentStep])

  // 테마 변경 시 배경 음악 변경
  useEffect(() => {
    if (!showScreenBlock) {
      playSound(audioList.bgm, 0, 0.5)
    }
  }, [theme, themeNumber, showScreenBlock])

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      audioList.bgm.current?.pause()
    }
  }, [])

  // 사용자 상호작용 시 오디오 활성화
  const handleUserInteraction = useCallback(() => {
    playSound(audioList.bgm, 0, 0.5)
  }, [theme, themeNumber])

  // 화면 블록 페이드 아웃 처리
  const handleScreenBlockFadeOut = useCallback(() => {
    setIsScreenBlockFading(true)

    setTimeout(() => {
      setShowScreenBlock(false)
      setIsScreenBlockFading(false)
      handleUserInteraction()
    }, TIMING.MAIN_CONTAINER.SCREEN_FADE)
  }, [handleUserInteraction])

  // 학습 모듈 시작
  const handleStartStudy = useCallback(() => {
    playSound(audioList.stepOpen, 0, 1)
    pauseSound(audioList.bgm)

    setIsShowStudyModule(true)
  }, [])

  // 학습 모듈 닫기
  const handleCloseStudyModal = useCallback(() => {
    resumeSound(audioList.bgm)

    setIsShowStudyModule(false)
  }, [theme, themeNumber])

  /**
   * 스텝 다시 보기
   */
  const handleReplay = useCallback(() => {
    playSound(audioList.stepOpen, 0, 1)
    pauseSound(audioList.bgm)
    setIsShowStudyModule(true)
  }, [])

  /**
   * 영상 완료 처리
   */
  const handleMovieComplete = useCallback(() => {
    setCompletedSteps((prev) => {
      if (!prev.includes(0)) {
        return [...prev, 0]
      }
      return prev
    })
  }, [])

  /**
   * 퀴즈 완료 처리 (일반적인 스텝 완료)
   */
  const handleStepComplete = useCallback(() => {
    console.log(`스텝 ${currentStep} 완료됨`)
    setCompletedSteps((prev) => {
      if (!prev.includes(currentStep)) {
        return [...prev, currentStep]
      }
      return prev
    })
  }, [currentStep])

  /**
   * 다음 스텝으로 이동
   */
  const handleNextStep = useCallback(() => {
    if (currentStep < SCREEN_CONFIG.STEP_COUNT - 1) {
      setCurrentStep((prev) => prev + 1)
    } else if (currentStep === 5 && completedSteps.includes(5)) {
      // Step5 완료 후 next 버튼을 누르면 컬렉션 아이템 팝업 표시
      setCollectionPopupData({
        character: theme,
        itemNumber: themeNumber as 1 | 2 | 3,
      })
      setShowCollectionItemPopup(true)
    }
  }, [currentStep, completedSteps, theme, themeNumber])

  /**
   * 컬렉션 아이템 팝업 닫기
   */
  const handleCloseCollectionPopup = useCallback(() => {
    setShowCollectionItemPopup(false)
  }, [])

  /**
   * 컬렉션 아이템 획득 표시
   */
  const showCollectionItem = useCallback(
    (character: ThemeType, itemNumber: 1 | 2 | 3, title?: string) => {
      setCollectionPopupData({ character, itemNumber, title })
      setShowCollectionItemPopup(true)
    },
    [],
  )

  /**
   * 스텝 변경 처리
   */
  const handleStepChange = useCallback(
    (stepNumber: number) => {
      if (stepNumber === currentStep) return

      setIsSliding(true)
      setCurrentStep(stepNumber)

      setTimeout(() => {
        setIsSliding(false)
      }, TIMING.MAIN_CONTAINER.SLIDE_TRANSITION)
    },
    [currentStep],
  )

  /**
   * 현재 학습 모듈 조회
   */
  const currentStudyModule = useMemo(
    () => getStudyModule(studyType, currentStep),
    [studyType, currentStep],
  )

  return (
    <OuterWrapper>
      <ScaledContainer scale={scale}>
        {!isShowStudyModule && (
          <CollectionButton
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

        <StepContainer
          theme={theme}
          themeNumber={themeNumber}
          stepNumber={currentStep}
          completedSteps={completedSteps}
          handleStartStudy={handleStartStudy}
          handleReplay={handleReplay}
          handleNextStep={handleNextStep}
        />

        {isShowStudyModule && (
          <SubViewContainer
            quizData={quizData}
            studyModule={currentStudyModule}
            theme={theme}
            themeNumber={themeNumber}
            handleCloseStudyModal={handleCloseStudyModal}
            onMovieComplete={handleMovieComplete}
            onStepComplete={handleStepComplete}
          />
        )}

        {showScreenBlock && (
          <ScreenBlock isFading={isScreenBlockFading}>
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

const ScreenBlock = styled.div<{ isFading: boolean }>`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  opacity: ${({ isFading }) => (isFading ? 0 : 1)};
  pointer-events: ${({ isFading }) => (isFading ? 'none' : 'auto')};
  transition: opacity ${TIMING.MAIN_CONTAINER.SCREEN_FADE}ms ease-in-out;

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
