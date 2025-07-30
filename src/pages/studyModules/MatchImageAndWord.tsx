import { ThemeType, ThemeNumber } from '@utils/SoundManager'
import QuizContainer, { QuizBody } from '@components/common/QuizContainer'
import { IMAGES } from '@utils/ImageManager'
import ImageWithAudioQuestion from '@components/questions/ImageWithAudioQuestion'
import ShortTextOptions from '@components/options/ShortTextOptions'
import { QuizItem, useQuizLogic, QuizCallbacks } from '@hooks/useQuizLogic'
import QuizResultScreen from '@components/common/QuizResultScreen'
import PlayAudioButton from '@components/common/PlayAudioButton'

type MatchImageAndWordProps = QuizCallbacks & {
  theme?: ThemeType
  themeNumber?: ThemeNumber
}

// 퀴즈 데이터
const quizData: QuizItem[] = [
  {
    question: 'can',
    options: ['can', 'banana', 'cherry'],
    correctAnswer: 'can',
    quizSound: 'can',
    questionType: 'phonics1Words',
  },
  {
    question: 'apple',
    options: ['apple', 'banana', 'cherry'],
    correctAnswer: 'apple',
    quizSound: 'apple',
    questionType: 'phonics1Words',
  },
]

// 퀴즈 설정
const QUIZ_CONFIG = {
  BASE_TITLE: 'Match Image And Word',
  COMPLETE_MESSAGE: 'Great Job!',
} as const

export default function MatchImageAndWord({
  onCorrect,
  onIncorrect,
  onComplete,
  onClose,
  theme = 'baro',
  themeNumber = 1,
}: MatchImageAndWordProps) {
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
        <ImageWithAudioQuestion
          imageSrc={`${imagePath}${currentQuiz.correctAnswer}.png`}
        />
        <ShortTextOptions
          options={currentQuiz.options as string[]}
          onOptionClick={handleOptionClick}
        />
      </QuizBody>
    </QuizContainer>
  )
}
