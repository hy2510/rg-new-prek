import { ThemeType } from '@interfaces/IThemeType'
import { Images } from '@utils/Assets'

import QuizContainer, { QuizBody } from '@components/common/QuizContainer'

type PictureMatchProps = {
  theme?: ThemeType
  themeNumber?: number
  onCorrect?: () => void
  onIncorrect?: () => void
}
export default function PictureMatch({
  theme = 'Baro',
  themeNumber = 1,
  onCorrect,
  onIncorrect,
}: PictureMatchProps) {
  return (
    <QuizContainer
      bgImage={Images.Theme[theme].Quiz.quizBg}
      quizTitle="Picture Match"
      theme={theme}
      themeNumber={themeNumber}
      showThemeInfo={true}
    >
      <QuizBody></QuizBody>
    </QuizContainer>
  )
}
