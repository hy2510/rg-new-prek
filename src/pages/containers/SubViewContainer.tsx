import { useMemo, useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'

import { IStudyModules } from '@interfaces/IStep'
import { ThemeType, ThemeNumber } from '@utils/SoundManager'
import { IMAGES } from '@utils/ImageManager'

import AiSpeakPractice from '@pages/studyModules/AiSpeakPractice'
import ChooseImageByLetter from '@pages/studyModules/ChooseImageByLetter'
import ChooseImageBySentence from '@pages/studyModules/ChooseImageBySentence'
import ChooseLetterBySound from '@pages/studyModules/ChooseLetterBySound'
import ChooseWordBySound from '@pages/studyModules/ChooseWordBySound'
import ChooseWordOrSentenceByImage from '@pages/studyModules/ChooseWordOrSentenceByImage'
import CompleteWordByPhoneme from '@pages/studyModules/CompleteWordByPhoneme'
import MatchImageAndWord from '@pages/studyModules/MatchImageAndWord'
import MatchLetter1 from '@pages/studyModules/MatchLetter1'
import MatchLetter2 from '@pages/studyModules/MatchLetter2'
import MatchWordAndImage from '@pages/studyModules/MatchWordAndImage'
import Movie from '@pages/studyModules/Movie'
import OrderPhrasesByImage from '@pages/studyModules/OrderPhrasesByImage'
import TraceLetter from '@pages/studyModules/TraceLetter'
import TypeWordBySound from '@pages/studyModules/TypeWordBySound'
import CorrectionMark from '@components/common/CorrectionMark'

type ISubContainerProps = {
  studyModule?: IStudyModules
  handleCloseStudyModal: () => void
  theme?: ThemeType
  themeNumber?: ThemeNumber
  onMovieComplete?: () => void
  onStepComplete?: () => void
  audioLetter?: string
}

// 타이밍 및 애니메이션 상수
const TIMING = {
  FADE_IN_DELAY: 100, // 페이드 인 지연
  FADE_OUT_DURATION: 800, // 페이드 아웃 지속 시간
  CORRECTION_DISPLAY: 1000, // 정답/오답 표시 시간
  TRANSITION_DURATION: 500, // 기본 전환 시간
} as const

// UI 위치 상수
const UI_POSITIONS = {
  CLOSE_BUTTON: {
    MOVIE: { top: 0, right: 0 },
    QUIZ: { top: 64, right: 82 },
  },
} as const

export default function SubViewContainer({
  studyModule = 'Movie',
  handleCloseStudyModal,
  theme = 'baro',
  themeNumber = 1,
  onMovieComplete,
  onStepComplete,
  audioLetter,
}: ISubContainerProps) {
  const [showCorrect, setShowCorrect] = useState(false)
  const [showIncorrect, setShowIncorrect] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [closeTrigger, setCloseTrigger] = useState(0)
  const [isFadingOut, setIsFadingOut] = useState(false)

  // 페이드 아웃 애니메이션 완료 후 실제 팝업 닫기
  useEffect(() => {
    if (isFadingOut) {
      const timer = setTimeout(() => {
        handleCloseStudyModal()
      }, TIMING.FADE_OUT_DURATION)

      return () => clearTimeout(timer)
    }
  }, [isFadingOut, handleCloseStudyModal])

  // studyModule 변경 시 fade-in 애니메이션 효과
  useEffect(() => {
    setIsVisible(false)
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, TIMING.FADE_IN_DELAY)
    return () => clearTimeout(timer)
  }, [studyModule])

  // 정답/오답 표시 공통 함수
  const createCorrectionHandler = useCallback(
    (type: 'correct' | 'incorrect') => {
      return () => {
        if (type === 'correct') {
          setShowCorrect(true)
          setTimeout(() => {
            setShowCorrect(false)
          }, TIMING.CORRECTION_DISPLAY)
        } else {
          setShowIncorrect(true)
          setTimeout(() => {
            setShowIncorrect(false)
          }, TIMING.CORRECTION_DISPLAY)
        }
      }
    },
    [],
  )

  const handleShowCorrect = useMemo(
    () => createCorrectionHandler('correct'),
    [createCorrectionHandler],
  )
  const handleShowIncorrect = useMemo(
    () => createCorrectionHandler('incorrect'),
    [createCorrectionHandler],
  )

  const handleCloseWithFade = useCallback(() => {
    if (studyModule === 'Movie') {
      setCloseTrigger((prev) => prev + 1)
    } else {
      handleCloseStudyModal()
    }
  }, [studyModule, handleCloseStudyModal])

  const handleQuizComplete = useCallback(() => {
    // 스텝 완료 처리만 수행
    onStepComplete?.()
    // 팝업 자동 닫힘 제거 - 사용자가 직접 닫기 버튼을 눌러야 함
    // setIsFadingOut(true)
  }, [onStepComplete])

  // 학습 모듈 라우터
  const PageRouter = useMemo(() => {
    const commonProps = { theme, themeNumber }
    const correctionProps = {
      onCorrect: handleShowCorrect,
      onIncorrect: handleShowIncorrect,
      ...commonProps,
    }

    const quizProps = {
      ...correctionProps,
      onComplete: handleQuizComplete,
      onClose: handleCloseStudyModal, // 퀴즈 결과 화면에서 팝업 닫기
      audioLetter, // audioLetter를 각 모듈에 전달
    }

    return {
      Movie: (
        <Movie
          onClose={handleCloseStudyModal}
          closeTrigger={closeTrigger}
          onComplete={onMovieComplete}
          theme={theme}
          themeNumber={themeNumber}
        />
      ),
      AiSpeakPractice: <AiSpeakPractice {...quizProps} />,
      ChooseImageByLetter: <ChooseImageByLetter {...quizProps} />,
      ChooseImageBySentence: <ChooseImageBySentence {...quizProps} />,
      ChooseLetterBySound: <ChooseLetterBySound {...quizProps} />,
      ChooseWordBySound: <ChooseWordBySound {...quizProps} />,
      ChooseWordOrSentenceByImage: (
        <ChooseWordOrSentenceByImage {...quizProps} />
      ),
      CompleteWordByPhoneme: <CompleteWordByPhoneme {...quizProps} />,
      MatchImageAndWord: <MatchImageAndWord {...quizProps} />,
      MatchLetter1: <MatchLetter1 {...quizProps} />,
      MatchLetter2: <MatchLetter2 {...quizProps} />,
      MatchWordAndImage: <MatchWordAndImage {...quizProps} />,
      OrderPhrasesByImage: <OrderPhrasesByImage {...quizProps} />,
      TraceLetter: <TraceLetter />,
      TypeWordBySound: <TypeWordBySound {...quizProps} />,
    } satisfies Record<IStudyModules, JSX.Element>
  }, [
    theme,
    themeNumber,
    handleShowCorrect,
    handleShowIncorrect,
    handleQuizComplete,
    handleCloseStudyModal,
    closeTrigger,
    onMovieComplete,
    audioLetter,
  ])

  const isMovieMode = studyModule === 'Movie'

  return (
    <>
      <Wrapper $isFadingOut={isFadingOut}>
        <Content $isVisible={isVisible}>{PageRouter[studyModule]}</Content>
        <CloseButton
          $isVisible={isVisible}
          $isMovie={isMovieMode}
          onClick={handleCloseWithFade}
        />
      </Wrapper>

      <CorrectionMark type="correct" theme={theme} isVisible={showCorrect} />

      <CorrectionMark
        type="incorrect"
        theme={theme}
        isVisible={showIncorrect}
      />
    </>
  )
}

const Wrapper = styled.div<{ $isFadingOut: boolean }>`
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.75);
  box-sizing: border-box;
  opacity: ${({ $isFadingOut }) => ($isFadingOut ? 0 : 1)};
  transition: opacity ${TIMING.FADE_OUT_DURATION}ms ease-in-out;
`

const Content = styled.div<{ $isVisible: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 5px;
  box-sizing: border-box;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transform: ${({ $isVisible }) =>
    $isVisible ? 'translateY(0)' : 'translateY(20px)'};
  transition: opacity ${TIMING.TRANSITION_DURATION}ms ease-in-out,
    transform ${TIMING.TRANSITION_DURATION}ms ease-in-out;
`

const CloseButton = styled.button<{ $isVisible: boolean; $isMovie?: boolean }>`
  position: absolute;
  top: ${({ $isMovie }) =>
    $isMovie
      ? UI_POSITIONS.CLOSE_BUTTON.MOVIE.top
      : UI_POSITIONS.CLOSE_BUTTON.QUIZ.top}px;
  right: ${({ $isMovie }) =>
    $isMovie
      ? UI_POSITIONS.CLOSE_BUTTON.MOVIE.right
      : UI_POSITIONS.CLOSE_BUTTON.QUIZ.right}px;
  width: 60px;
  height: 60px;
  border: none;
  background: transparent;
  background-image: url(${IMAGES.common.button.closeQuizModal});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
  z-index: 10;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transform: ${({ $isVisible }) =>
    $isVisible ? 'translateY(0)' : 'translateY(20px)'};
  transition: opacity ${TIMING.TRANSITION_DURATION}ms ease-in-out,
    transform ${TIMING.TRANSITION_DURATION}ms ease-in-out;

  &:hover {
    transform: ${({ $isVisible }) =>
      $isVisible ? 'translateY(0) scale(1.1)' : 'translateY(20px)'};
  }
`
