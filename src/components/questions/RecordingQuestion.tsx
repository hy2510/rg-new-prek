import { IMAGES } from '@utils/ImageManager'
import styled from 'styled-components'

export default function RecordingQuestion({
  questionImage,
  question,
  recordQuestionType,
}: {
  questionImage?: string
  question?: string | string[]
  recordQuestionType?: 'word' | 'sentence'
}) {
  return (
    <>
      {recordQuestionType === 'word' ? (
        <RecordingQuestion1 word={question} />
      ) : (
        <RecordingQuestion2 imageSrc={questionImage} sentence={question} />
      )}
    </>
  )
}

// 타입1 (문자 타입)
interface RecordingQuestion1Props {
  word?: string | string[]
}

function RecordingQuestion1({ word = '' }: RecordingQuestion1Props) {
  return (
    <RecordingQuestionContainer1>
      <div className="letter-container">
        <div className="letter-text">
          <span>{word}</span>
        </div>
      </div>
    </RecordingQuestionContainer1>
  )
}

const RecordingQuestionContainer1 = styled.div`
  background-image: url(${IMAGES.theme.baro.quiz.options.resShelfLong});
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
      font-size: 5em;
      font-weight: bold;
      color: #1a1a1a;
      background-image: url(${IMAGES.common.questionBg.short});
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top: 15px;
    }
  }
`

// 타입2 (이미지와 문장 타입)
interface RecordingQuestion2Props {
  sentence?: string | string[]
  imageSrc?: string
  imageAlt?: string
}

function RecordingQuestion2({
  sentence = '',
  imageSrc = 'https://wcfresource.a1edu.com/newsystem/image/dodoabc/phonics1/words/can.png',
  imageAlt = '',
}: RecordingQuestion2Props) {
  return (
    <RecordingQuestionContainer2>
      <div className="quiz-image-container">
        <div className="quiz-image">
          <img src={imageSrc} alt={imageAlt} />
        </div>
      </div>
      <div className="sentence-container">
        <div className="sentence">
          <span>{sentence}</span>
        </div>
      </div>
    </RecordingQuestionContainer2>
  )
}

const RecordingQuestionContainer2 = styled.div`
  background-image: url(${IMAGES.theme.baro.quiz.options.resShelfLong});
  background-size: calc(100% - 40px);
  background-position: top calc(100% + 20px) center;
  background-repeat: no-repeat;
  width: 100%;
  height: 320px;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  align-items: start;

  .quiz-image-container {
    width: 450px;
    height: 280px;
    margin-left: auto;

    .quiz-image {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: auto;
        height: calc(100% - 40px);
        object-fit: contain;
        margin-bottom: 8px;
        border: 3px solid #fff;
        border-radius: 20px;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
        background-color: #1a1a1a;
      }
    }
  }

  .sentence-container {
    width: calc(100% - 40px);
    height: 100%;
    padding-left: 20px;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    animation: float 2s ease-in-out infinite;

    .sentence {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 5px;
      margin-top: 60px;
      color: #333;
      font-size: 2.2em;
      font-weight: bold;
      background-color: rgb(255, 255, 255);
      padding: 8px 24px;
      border-radius: 20px;
      position: relative;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.25);

      span {
        position: relative;
        z-index: 2;
      }

      &::after {
        content: '';
        display: block;
        width: 10px;
        height: 10px;
        background-color: rgb(255, 255, 255);
        position: absolute;
        top: calc(50% - 5px);
        left: -8px;
        border-top: 2.5px solid rgb(255, 255, 255, 0.85);
        border-right: 2.5px solid transparent;
        border-bottom: 2.5px solid transparent;
        border-left: 2.5px solid transparent;
        transform: rotate(45deg);
        z-index: 1;
      }
    }
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-5px);
    }
  }
`
