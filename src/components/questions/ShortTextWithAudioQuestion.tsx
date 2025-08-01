import { Images } from '@utils/Assets'
import styled from 'styled-components'

interface ShortTextWithAudioQuestionProps {
  text?: string
  className?: string
}

export default function ShortTextWithAudioQuestion({
  text = 'A',
  className,
}: ShortTextWithAudioQuestionProps) {
  return (
    <ShortTextWithAudioQuestionContainer className={className}>
      <div className="letter-container">
        <div className="letter-text">
          <span>{text}</span>
        </div>
      </div>
    </ShortTextWithAudioQuestionContainer>
  )
}

const ShortTextWithAudioQuestionContainer = styled.div`
  background-image: url(${Images.Theme.Baro.Quiz.resShelfLong});
  background-size: calc(100% - 40px);
  background-position: top calc(100% + 20px) center;
  background-repeat: no-repeat;
  width: 100%;
  height: 320px;
  display: flex;
  justify-content: center;
  align-items: start;

  .letter-container {
    width: 450px;
    height: 280px;

    .letter-text {
      font-size: 10em;
      font-weight: bold;
      color: #1a1a1a;
      background-image: url(${Images.Common.QuestionBg.questionBgShort});
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`
