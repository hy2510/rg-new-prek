import QuizContainer, { QuizBody } from '@components/common/QuizContainer'
import { ThemeType } from '@interfaces/IThemeType'
import { Images } from '@utils/Assets'
import ImageShortTextGapFill from '@components/questions/ImageShortTextGapFill'
import ShortTextOptions from '@components/options/ShortTextOptions'
import PlayAudioButton from '@components/common/PlayAudioButton'
import { QuizItem, useQuizLogic, QuizCallbacks } from '@hooks/useQuizLogic'
import QuizResultScreen from '@components/common/QuizResultScreen'

type CompleteWordByPhonemeProps = QuizCallbacks & {
  theme?: ThemeType
  themeNumber?: number
}

const quizData: QuizItem[] = [
  {
    question: ['', 'an'],
    options: ['c', 'a', 'b'], // 정답 'c'가 첫 번째
    correctAnswer: 'c',
    quizSound: 'can',
    questionImage: 'can',
    questionType: 'phonics1Words',
  },
  {
    question: ['', 'an'],
    options: ['p', 'a', 'b'], // 정답 'p'가 첫 번째
    correctAnswer: 'p',
    quizSound: 'pan',
    questionImage: 'pan',
    questionType: 'phonics1Words',
  },
  {
    question: ['', 'an'],
    options: ['f', 'a', 'b'], // 정답 'f'가 첫 번째
    correctAnswer: 'f',
    quizSound: 'fan',
    questionImage: 'fan',
    questionType: 'phonics1Words',
  },
]

// 퀴즈 설정
const QUIZ_CONFIG = {
  BASE_TITLE: 'Complete Word By Phoneme',
  COMPLETE_MESSAGE: 'Great Job!',
} as const

export default function CompleteWordByPhoneme({
  onCorrect,
  onIncorrect,
  onComplete,
  onClose,
  theme = 'Baro',
  themeNumber = 1,
}: CompleteWordByPhonemeProps) {
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

  const imagePath =
    'https://wcfresource.a1edu.com/newsystem/image/dodoabc/phonics1/words/'

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
        <ImageShortTextGapFill
          word={currentQuiz.question}
          imageSrc={`${imagePath}${currentQuiz.questionImage}.png`}
          imageAlt="can"
        />
        <ShortTextOptions
          options={currentQuiz.options as string[]}
          onOptionClick={handleOptionClick}
          theme={theme}
        />
      </QuizBody>
    </QuizContainer>
  )
}
