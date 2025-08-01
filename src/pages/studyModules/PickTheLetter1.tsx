import { ThemeType } from '@interfaces/IThemeType'
import { Images } from '@utils/Assets'

import { IQuizInfo } from '@interfaces/IStudyInfo'
import QuizContainer, { QuizBody } from '@components/common/QuizContainer'
import { QuizCallbacks, useQuizLogic } from '@hooks/useQuizLogic'
import PlayAudioButton from '@components/common/PlayAudioButton'
import AudioOnlyQuestion from '@components/questions/AudioOnlyQuestion'
import ShortTextOptions from '@components/options/ShortTextOptions'
import QuizResultScreen from '@components/common/QuizResultScreen'

// 퀴즈 설정
const QUIZ_CONFIG = {
  BASE_TITLE: 'Pick the Letter',
  COMPLETE_MESSAGE: 'Great Job!',
} as const

type PickTheLetter1Props = QuizCallbacks & {
  theme?: ThemeType
  themeNumber?: number
  quizData: IQuizInfo['quiz']
}
export default function PickTheLetter1({
  theme = 'Baro',
  themeNumber = 1,
  quizData,
  onCorrect,
  onIncorrect,
  onComplete,
  onClose,
}: PickTheLetter1Props) {
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
      quizTitle="Pick the Letter"
      theme={theme}
      themeNumber={themeNumber}
      showThemeInfo={true}
    >
      <PlayAudioButton isVisible={true} audioLetter={currentQuiz.Sounds[0]} />

      <QuizBody>
        <AudioOnlyQuestion />

        <ShortTextOptions
          options={currentQuiz.Options as string[]}
          onOptionClick={handleOptionClick}
          theme={theme}
        />
      </QuizBody>
    </QuizContainer>
  )
}
