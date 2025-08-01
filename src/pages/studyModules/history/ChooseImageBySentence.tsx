import { Images } from '@utils/Assets'
import { ThemeType } from '@interfaces/IThemeType'
import QuizContainer, { QuizBody } from '@components/common/QuizContainer'
import SentenceListeningQuestion from '@components/questions/SentenceListeningQuestion'
import LargeImageOptions from '@components/options/LargeImageOptions'
import QuizResultScreen from '@components/common/QuizResultScreen'
import { useQuizLogic, QuizItem, QuizCallbacks } from '@hooks/useQuizLogic'
import PlayAudioButton from '@components/common/PlayAudioButton'

type ChooseImageBySentenceProps = QuizCallbacks & {
  theme?: ThemeType
  themeNumber?: number
}

// 퀴즈 데이터
const quizData: QuizItem[] = [
  {
    question: 'Hello, I am Dodo.',
    options: [
      'https://wcfresource.a1edu.com/newsystem/image/dodoabc/sightword/words/helloiamdodo.png',
      'https://wcfresource.a1edu.com/newsystem/image/dodoabc/sightword/words/thisismynewfriend.png',
    ],
    correctAnswer: 'Hello, I am Dodo.',
    quizSound: 'helloiamdodo',
    questionType: 'sightwordWords',
  },
]

// 퀴즈 설정
const QUIZ_CONFIG = {
  BASE_TITLE: 'Choose Image By Sentence',
  COMPLETE_MESSAGE: 'Great Job!',
} as const

export default function ChooseImageBySentence({
  onCorrect,
  onIncorrect,
  onComplete,
  onClose,
  theme = 'Baro',
  themeNumber = 1,
}: ChooseImageBySentenceProps) {
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

  // 일반 퀴즈 화면 렌더링
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
        <SentenceListeningQuestion text={currentQuiz.question as string} />
        <LargeImageOptions
          options={currentQuiz.options as string[]}
          onOptionClick={handleOptionClick}
        />
      </QuizBody>
    </QuizContainer>
  )
}
