import { useMemo, useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'

import { Images } from '@utils/Assets'

import { IStudyModules } from '@interfaces/IStep'
import { ThemeType } from '@interfaces/IThemeType'
import { TIMING, UI_POSITIONS } from '@constants/constant'
import { IQuizInfo } from '@interfaces/IStudyInfo'

import CorrectionMark from '@components/common/CorrectionMark'

import Movie from '@pages/studyModules/history/Movie'
import ABCPictureMatch from '@pages/studyModules/ABCPictureMatch'
import ABCTracing from '@pages/studyModules/ABCTracing'
import CompleteTheWord from '@pages/studyModules/CompleteTheWord'
import FillTheWord1 from '@pages/studyModules/FillTheWord1'
import FillTheWord2 from '@pages/studyModules/FillTheWord2'
import FindTheMatch from '@pages/studyModules/FindTheMatch'
import LetterPairs from '@pages/studyModules/LetterPairs'
import ListenAndMatch from '@pages/studyModules/ListenAndMatch'
import MakeSentence from '@pages/studyModules/MakeSentence'
import MatchTheMeaning1 from '@pages/studyModules/MatchTheMeaning1'
import MatchTheMeaning2 from '@pages/studyModules/MatchTheMeaning2'
import MatchTheSound1 from '@pages/studyModules/MatchTheSound1'
import MatchTheSound2 from '@pages/studyModules/MatchTheSound2'
import PickTheLetter1 from '@pages/studyModules/PickTheLetter1'
import PickTheLetter2 from '@pages/studyModules/PickTheLetter2'
import PickTheSound from '@pages/studyModules/PickTheSound'
import PictureMatch from '@pages/studyModules/PictureMatch'
import RhymeMatch1 from '@pages/studyModules/RhymeMatch1'
import RhymeMatch2 from '@pages/studyModules/RhymeMatch2'
import SpeakAndCheck from '@pages/studyModules/SpeakAndCheck'

import WordMatch from '@pages/studyModules/WordMatch'

type ISubContainerProps = {
  quizData: IQuizInfo['quiz']
  studyModule?: IStudyModules
  theme?: ThemeType
  themeNumber?: number
  audioLetter?: string
  handleCloseStudyModal: () => void
  onMovieComplete?: () => void
  onStepComplete?: () => void
}

export default function SubViewContainer({
  quizData,
  studyModule = 'Movie',
  theme = 'Baro',
  themeNumber = 1,
  audioLetter,
  handleCloseStudyModal,
  onMovieComplete,
  onStepComplete,
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
      }, TIMING.SUB_VIEW.FADE_OUT_DURATION)

      return () => clearTimeout(timer)
    }
  }, [isFadingOut, handleCloseStudyModal])

  // studyModule 변경 시 fade-in 애니메이션 효과
  useEffect(() => {
    console.log('studyModule', studyModule)
    setIsVisible(false)

    const timer = setTimeout(() => {
      setIsVisible(true)
    }, TIMING.SUB_VIEW.FADE_IN_DELAY)
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
          }, TIMING.SUB_VIEW.CORRECTION_DISPLAY)
        } else {
          setShowIncorrect(true)

          setTimeout(() => {
            setShowIncorrect(false)
          }, TIMING.SUB_VIEW.CORRECTION_DISPLAY)
        }
      }
    },
    [],
  )

  /**
   * 정답/오답 표시
   */
  const handleShowCorrect = useMemo(
    () => createCorrectionHandler('correct'),
    [createCorrectionHandler],
  )
  const handleShowIncorrect = useMemo(
    () => createCorrectionHandler('incorrect'),
    [createCorrectionHandler],
  )

  /**
   * 닫기
   */
  const handleCloseWithFade = useCallback(() => {
    if (studyModule === 'Movie') {
      setCloseTrigger((prev) => prev + 1)
    } else {
      handleCloseStudyModal()
    }
  }, [studyModule, handleCloseStudyModal])

  /**
   * 퀴즈 완료 시 호출되는 함수
   */
  const handleQuizComplete = useCallback(() => {
    onStepComplete?.()
  }, [onStepComplete])

  // 학습 모듈 라우터
  const PageRouter = useMemo(() => {
    const commonProps = { theme, themeNumber, quizData }
    const correctionProps = {
      onCorrect: handleShowCorrect,
      onIncorrect: handleShowIncorrect,
    }

    const quizProps = {
      ...commonProps,
      audioLetter, // audioLetter를 각 모듈에 전달
      ...correctionProps,
      onComplete: handleQuizComplete,
      onClose: handleCloseStudyModal, // 퀴즈 결과 화면에서 팝업 닫기
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
      ABCPictureMatch: <ABCPictureMatch {...quizProps} />,
      ABCTracing: <ABCTracing {...quizProps} />,
      CompleteTheWord: <CompleteTheWord {...quizProps} />,
      FillTheWord1: <FillTheWord1 {...quizProps} />,
      FillTheWord2: <FillTheWord2 {...quizProps} />,
      FindTheMatch: <FindTheMatch {...quizProps} />,
      LetterPairs: <LetterPairs {...quizProps} />,
      ListenAndMatch: <ListenAndMatch {...quizProps} />,
      MakeSentence: <MakeSentence {...quizProps} />,
      MatchTheMeaning1: <MatchTheMeaning1 {...quizProps} />,
      MatchTheMeaning2: <MatchTheMeaning2 {...quizProps} />,
      MatchTheSound1: <MatchTheSound1 {...quizProps} />,
      MatchTheSound2: <MatchTheSound2 {...quizProps} />,
      PictureMatch: <PictureMatch {...quizProps} />,
      PickTheLetter1: <PickTheLetter1 {...quizProps} />,
      PickTheLetter2: <PickTheLetter2 {...quizProps} />,
      PickTheSound: <PickTheSound {...quizProps} />,
      RhymeMatch1: <RhymeMatch1 {...quizProps} />,
      RhymeMatch2: <RhymeMatch2 {...quizProps} />,
      SpeakAndCheck: <SpeakAndCheck {...quizProps} />,
      WordMatch: <WordMatch {...quizProps} />,
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
      <Wrapper isFadingOut={isFadingOut}>
        <Content isVisible={isVisible}>{PageRouter[studyModule]}</Content>
        <CloseButton
          isVisible={isVisible}
          isMovie={isMovieMode}
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

const Wrapper = styled.div<{ isFadingOut: boolean }>`
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.75);
  box-sizing: border-box;
  opacity: ${({ isFadingOut }) => (isFadingOut ? 0 : 1)};
  transition: opacity ${TIMING.SUB_VIEW.FADE_OUT_DURATION}ms ease-in-out;
`

const Content = styled.div<{ isVisible: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 5px;
  box-sizing: border-box;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transform: ${({ isVisible }) =>
    isVisible ? 'translateY(0)' : 'translateY(20px)'};
  transition: opacity ${TIMING.SUB_VIEW.TRANSITION_DURATION}ms ease-in-out,
    transform ${TIMING.SUB_VIEW.TRANSITION_DURATION}ms ease-in-out;
`

const CloseButton = styled.button<{ isVisible: boolean; isMovie?: boolean }>`
  position: absolute;
  top: ${({ isMovie }) =>
    isMovie
      ? UI_POSITIONS.CLOSE_BUTTON.MOVIE.top
      : UI_POSITIONS.CLOSE_BUTTON.QUIZ.top}px;
  right: ${({ isMovie }) =>
    isMovie
      ? UI_POSITIONS.CLOSE_BUTTON.MOVIE.right
      : UI_POSITIONS.CLOSE_BUTTON.QUIZ.right}px;
  width: 60px;
  height: 60px;
  border: none;
  background: transparent;
  background-image: url(${Images.Common.Button.btnCloseQuizModal});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
  z-index: 10;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transform: ${({ isVisible }) =>
    isVisible ? 'translateY(0)' : 'translateY(20px)'};
  transition: opacity ${TIMING.SUB_VIEW.TRANSITION_DURATION}ms ease-in-out,
    transform ${TIMING.SUB_VIEW.TRANSITION_DURATION}ms ease-in-out;

  &:hover {
    transform: ${({ isVisible }) =>
      isVisible ? 'translateY(0) scale(1.1)' : 'translateY(20px)'};
  }
`
