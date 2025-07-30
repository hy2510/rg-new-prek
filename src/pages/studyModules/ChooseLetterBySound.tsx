import { ThemeType, ThemeNumber } from '@utils/SoundManager'
import QuizContainer, { QuizBody } from '@components/common/QuizContainer'
import { IMAGES } from '@utils/ImageManager'
import AudioOnlyQuestion from '@components/questions/AudioOnlyQuestion'
import ShortTextOptions from '@components/options/ShortTextOptions'
import PlayAudioButton from '@components/common/PlayAudioButton'
import { useQuizLogic, QuizItem, QuizCallbacks } from '@hooks/useQuizLogic'
import QuizResultScreen from '@components/common/QuizResultScreen'

type ChooseLetterBySoundProps = QuizCallbacks & {
  theme?: ThemeType
  themeNumber?: ThemeNumber
  audioLetter?: string
}

// 퀴즈 데이터
const quizData: QuizItem[] = [
  {
    question: 'a',
    options: ['A', 'B', 'C'],
    correctAnswer: 'A',
    quizSound: 'biga',
    questionType: 'alphabetLetter',
  },
  {
    question: 'a',
    options: ['a', 'b', 'c'],
    correctAnswer: 'a',
    quizSound: 'smalla',
    questionType: 'alphabetLetter',
  },
  {
    question: 'a',
    options: ['Aa', 'Bb', 'Cc'],
    correctAnswer: 'Aa',
    quizSound: 'a',
    questionType: 'alphabetLetter',
  },
]

// 퀴즈 설정
const QUIZ_CONFIG = {
  BASE_TITLE: 'Choose Letter By Sound',
  COMPLETE_MESSAGE: 'Great Job!',
} as const

export default function ChooseLetterBySound({
  onCorrect,
  onIncorrect,
  onComplete,
  onClose,
  theme = 'baro',
  themeNumber = 1,
}: ChooseLetterBySoundProps) {
  const {
    isCompleted,
    currentQuiz,
    handleOptionClick,
    getQuizTitle,
    getCompleteTitle,
  } = useQuizLogic(
    quizData,
    { onCorrect, onIncorrect, onComplete },
    {
      playQuestionAudio: true,
      playResultAudio: true,
    },
  )

  // 결과 화면 렌더링
  if (isCompleted) {
    return (
      <QuizResultScreen
        title={getCompleteTitle(QUIZ_CONFIG.BASE_TITLE)}
        theme={theme}
        themeNumber={themeNumber}
        onClose={onClose}
      />
    )
  }

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
        <AudioOnlyQuestion />
        <ShortTextOptions
          options={currentQuiz.options as string[]}
          onOptionClick={handleOptionClick}
          theme={theme}
        />
      </QuizBody>
    </QuizContainer>
  )
}
