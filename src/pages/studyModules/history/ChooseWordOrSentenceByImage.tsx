import { Images } from '@utils/Assets'
import { ThemeType } from '@interfaces/IThemeType'
import QuizContainer, { QuizBody } from '@components/common/QuizContainer'
import WideImageAudioQuestion from '@components/questions/WideImageAudioQuestion'
import LongTextOptions from '@components/options/LongTextOptions'
import styled from 'styled-components'
import QuizResultScreen from '@components/common/QuizResultScreen'
import { useQuizLogic, QuizItem, QuizCallbacks } from '@hooks/useQuizLogic'
import PlayAudioButton from '@components/common/PlayAudioButton'

type ChooseWordOrSentenceByImageProps = QuizCallbacks & {
  theme?: ThemeType
  themeNumber?: number
}

// 퀴즈 데이터
const quizData: QuizItem[] = [
  {
    question: `What's your name?`,
    options: [`What's your name?`, `My Name is Gino.`],
    correctAnswer: `What's your name?`,
    questionImage:
      'https://wcfresource.a1edu.com/newsystem/image/dodoabc/sightword/words/whatsyourname.png',
    quizSound: 'whatsyourname',
    questionType: 'sightwordWords',
  },
]

const QUIZ_CONFIG = {
  BASE_TITLE: 'Choose Word Or Sentence By Image',
  COMPLETE_MESSAGE: 'Great Job!',
} as const

export default function ChooseWordOrSentenceByImage({
  onCorrect,
  onIncorrect,
  onComplete,
  onClose,
  theme = 'Baro',
  themeNumber = 1,
}: ChooseWordOrSentenceByImageProps) {
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
      quizTitle="Choose Word Or Sentence By Image"
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
        <ChooseWordOrSentenceByImageContainer>
          <WideImageAudioQuestion
            imageUrl={currentQuiz?.questionImage}
            containerBgImage={Images.Theme[theme].Quiz.resShelfShort}
          />
          <LongTextOptions
            options={currentQuiz?.options as string[]}
            onOptionClick={handleOptionClick}
          />
        </ChooseWordOrSentenceByImageContainer>
      </QuizBody>
    </QuizContainer>
  )
}

const ChooseWordOrSentenceByImageContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  align-items: center;
`
