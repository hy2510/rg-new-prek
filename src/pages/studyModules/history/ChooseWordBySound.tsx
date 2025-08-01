import { Images } from '@utils/Assets'
import { ThemeType } from '@interfaces/IThemeType'
import QuizContainer, { QuizBody } from '@components/common/QuizContainer'
import AudioOnlyQuestion from '@components/questions/AudioOnlyQuestion'
import ShortTextOptions from '@components/options/ShortTextOptions'
import QuizResultScreen from '@components/common/QuizResultScreen'
import { useQuizLogic, QuizItem, QuizCallbacks } from '@hooks/useQuizLogic'
import PlayAudioButton from '@components/common/PlayAudioButton'

type ChooseWordBySoundProps = QuizCallbacks & {
  theme?: ThemeType
  themeNumber?: number
}

// 퀴즈 데이터
const quizData: QuizItem[] = [
  {
    question: 'there',
    options: ['there', 'are', 'they'],
    correctAnswer: 'there',
    quizSound: 'there',
    questionType: 'sightwordWords',
  },
  {
    question: 'is',
    options: ['is', 'are', 'they'],
    correctAnswer: 'is',
    quizSound: 'is',
    questionType: 'sightwordWords',
  },
  {
    question: 'are',
    options: ['are', 'is', 'they'],
    correctAnswer: 'are',
    quizSound: 'are',
    questionType: 'sightwordWords',
  },
  {
    question: 'at',
    options: ['at', 'for', 'to'],
    correctAnswer: 'at',
    quizSound: 'at',
    questionType: 'sightwordWords',
  },
]

// 퀴즈 설정
const QUIZ_CONFIG = {
  BASE_TITLE: 'Choose Word By Sound',
  COMPLETE_MESSAGE: 'Great Job!',
} as const

export default function ChooseWordBySound({
  onCorrect,
  onIncorrect,
  onComplete,
  onClose,
  theme = 'Baro',
  themeNumber = 1,
}: ChooseWordBySoundProps) {
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
      bgImage={Images.Theme[theme].Quiz.quizBg}
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
        />
      </QuizBody>
    </QuizContainer>
  )
}
