import { ThemeType, ThemeNumber } from '@utils/SoundManager'
import QuizContainer, { QuizBody } from '@components/common/QuizContainer'
import { IMAGES } from '@utils/ImageManager'
import ShortTextWithAudioQuestion from '@components/questions/ShortTextWithAudioQuestion'
import ShortTextOptions from '@components/options/ShortTextOptions'
import QuizResultScreen from '@components/common/QuizResultScreen'
import PlayAudioButton from '@components/common/PlayAudioButton'
import { useQuizLogic, QuizItem, QuizCallbacks } from '@hooks/useQuizLogic'
import { useState } from 'react'

type MatchLetter1Props = QuizCallbacks & {
  theme?: ThemeType
  themeNumber?: ThemeNumber
  audioLetter?: string
}

// 퀴즈 데이터
const quizData: QuizItem[] = [
  {
    question: 'A',
    options: ['a', 'b', 'c'],
    correctAnswer: 'a',
    quizSound: 'a',
    questionType: 'alphabetLetter',
  },
  {
    question: 'a',
    options: ['A', 'B', 'C'],
    correctAnswer: 'A',
    quizSound: 'a',
    questionType: 'alphabetLetter',
  },
]

// 퀴즈 설정
const QUIZ_CONFIG = {
  BASE_TITLE: 'Match Letter 1',
  RESULT_AUDIO: 'alphabet/letter/a', // 결과 화면에서 재생할 특정 음성
} as const

export default function MatchLetter1({
  onCorrect,
  onIncorrect,
  onComplete,
  onClose,
  theme = 'baro',
  themeNumber = 1,
}: MatchLetter1Props) {
  const {
    isCompleted,
    currentQuiz,
    resultText,
    handleOptionClick,
    getQuizTitle,
    getCompleteTitle,
  } = useQuizLogic(
    quizData,
    { onCorrect, onIncorrect, onComplete },
    {
      playQuestionAudio: true,
      playResultAudio: true,
      resultAudioContent: QUIZ_CONFIG.RESULT_AUDIO,
    },
  )

  // 결과 화면 렌더링
  if (isCompleted) {
    return (
      <QuizResultScreen
        title={getCompleteTitle(QUIZ_CONFIG.BASE_TITLE)}
        resultText={resultText}
        theme={theme}
        themeNumber={themeNumber}
        onClose={onClose}
        showCharacter={false}
        showRibbon={false}
      >
        <ShortTextWithAudioQuestion text={resultText} />
      </QuizResultScreen>
    )
  }

  // 일반 퀴즈 화면 렌더링
  return (
    <QuizContainer
      bgImage={IMAGES.theme[theme].quiz.background.quizBg}
      quizTitle={getQuizTitle(QUIZ_CONFIG.BASE_TITLE)}
      theme={theme}
      themeNumber={themeNumber}
      showThemeInfo={true}
    >
      <PlayAudioButton
        isVisible={true}
        audioLetter={currentQuiz.quizSound}
        questionType={currentQuiz.questionType}
      />
      <QuizBody>
        <ShortTextWithAudioQuestion text={currentQuiz.question as string} />
        <ShortTextOptions
          options={currentQuiz.options as string[]}
          onOptionClick={handleOptionClick}
        />
      </QuizBody>
    </QuizContainer>
  )
}
