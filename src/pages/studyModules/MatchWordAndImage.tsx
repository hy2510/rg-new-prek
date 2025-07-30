import { ThemeType, ThemeNumber } from '@utils/SoundManager'
import QuizContainer, { QuizBody } from '@components/common/QuizContainer'
import { IMAGES } from '@utils/ImageManager'
import ShortTextWithAudioQuestion from '@components/questions/ShortTextWithAudioQuestion'
import SmallImageOptions from '@components/options/SmallImageOptions'
import QuizResultScreen from '@components/common/QuizResultScreen'
import { useQuizLogic, QuizItem, QuizCallbacks } from '@hooks/useQuizLogic'
import PlayAudioButton from '@components/common/PlayAudioButton'

type MatchWordAndImageProps = QuizCallbacks & {
  theme?: ThemeType
  themeNumber?: ThemeNumber
}

// 퀴즈 데이터
const quizData: QuizItem[] = [
  {
    question: 'Aa',
    options: [
      'https://wcfresource.a1edu.com/newsystem/image/dodoabc/alphabet/words/apple.png',
      'https://wcfresource.a1edu.com/newsystem/image/dodoabc/alphabet/words/mouse.png',
      'https://wcfresource.a1edu.com/newsystem/image/dodoabc/alphabet/words/seal.png',
    ],
    correctAnswer:
      'https://wcfresource.a1edu.com/newsystem/image/dodoabc/alphabet/words/apple.png',
    quizSound: 'apple',
    questionType: 'alphabetWords',
  },
  {
    question: 'Aa',
    options: [
      'https://wcfresource.a1edu.com/newsystem/image/dodoabc/alphabet/words/alligator.png',
      'https://wcfresource.a1edu.com/newsystem/image/dodoabc/alphabet/words/open.png',
      'https://wcfresource.a1edu.com/newsystem/image/dodoabc/alphabet/words/mix.png',
    ],
    correctAnswer:
      'https://wcfresource.a1edu.com/newsystem/image/dodoabc/alphabet/words/alligator.png',
    quizSound: 'alligator',
    questionType: 'alphabetWords',
  },
  {
    question: 'Aa',
    options: [
      'https://wcfresource.a1edu.com/newsystem/image/dodoabc/alphabet/words/ant.png',
      'https://wcfresource.a1edu.com/newsystem/image/dodoabc/alphabet/words/mouse.png',
      'https://wcfresource.a1edu.com/newsystem/image/dodoabc/alphabet/words/iguana.png',
    ],
    correctAnswer:
      'https://wcfresource.a1edu.com/newsystem/image/dodoabc/alphabet/words/ant.png',
    quizSound: 'ant',
    questionType: 'alphabetWords',
  },
]

// 퀴즈 설정
const QUIZ_CONFIG = {
  BASE_TITLE: 'Match Word And Image',
  COMPLETE_MESSAGE: 'Great Job!',
} as const

export default function MatchWordAndImage({
  onCorrect,
  onIncorrect,
  onComplete,
  onClose,
  theme = 'baro',
  themeNumber = 1,
}: MatchWordAndImageProps) {
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
        <ShortTextWithAudioQuestion text={currentQuiz.question as string} />
        <SmallImageOptions
          options={currentQuiz.options as string[]}
          onOptionClick={handleOptionClick}
        />
      </QuizBody>
    </QuizContainer>
  )
}
