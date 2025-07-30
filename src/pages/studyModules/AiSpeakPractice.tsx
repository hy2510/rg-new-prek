import { useState, useEffect, useCallback } from 'react'
import { ThemeType, ThemeNumber, SoundManager } from '@utils/SoundManager'
import QuizContainer, { QuizBody } from '@components/common/QuizContainer'
import { IMAGES } from '@utils/ImageManager'
import RecordingQuestion from '@components/questions/RecordingQuestion'
import RecordButton from '@components/options/RecordButton'
import QuizResultScreen from '@components/common/QuizResultScreen'
import { useQuizLogic, QuizItem, QuizCallbacks } from '@hooks/useQuizLogic'
import PlayAudioButton from '@components/common/PlayAudioButton'

type AiSpeakPracticeProps = QuizCallbacks & {
  theme?: ThemeType
  themeNumber?: ThemeNumber
  onClose?: () => void
}

// 녹음 길이 (초)
const recTime = 3

// 퀴즈 데이터
const quizData: QuizItem[] = [
  {
    question: 'I',
    questionImage:
      'https://wcfresource.a1edu.com/newsystem/image/dodoabc/sightword/words/lookatthesky.png',
    options: ['I'],
    correctAnswer: 'I',
    quizSound: 'i',
    questionType: 'sightwordWords',
    recordQuestionType: 'word',
  },
  {
    question: 'Look at the sky.',
    questionImage:
      'https://wcfresource.a1edu.com/newsystem/image/dodoabc/sightword/words/lookatthesky.png',
    options: ['Look at the sky.'],
    correctAnswer: 'Look at the sky.',
    quizSound: 'lookatthesky',
    questionType: 'sightwordWords',
    recordQuestionType: 'sentence',
  },
]

// 퀴즈 설정
const QUIZ_CONFIG = {
  BASE_TITLE: 'Ai Speak Practice',
  COMPLETE_MESSAGE: 'Great Job!',
} as const

export default function AiSpeakPractice({
  onCorrect,
  onIncorrect,
  onComplete,
  onClose,
  theme = 'baro',
  themeNumber = 1,
}: AiSpeakPracticeProps) {
  // 컴포넌트 마운트 시 배경음악 정지
  useEffect(() => {
    SoundManager.stopAllBackgroundMusic()

    // 컴포넌트 언마운트 시 배경음악 처음부터 재생
    return () => {
      SoundManager.restartBackgroundMusic(theme, themeNumber)
    }
  }, [theme, themeNumber])

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

  // 녹음 상태 관리
  const [isRecording, setIsRecording] = useState(false)
  const [progress, setProgress] = useState(0)

  const startRecording = useCallback(() => {
    setIsRecording(true)
    setProgress(0)
  }, [])

  const stopRecording = useCallback(() => {
    setIsRecording(false)
    setProgress(0)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRecording) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 10 / recTime
          if (newProgress >= 100) {
            setIsRecording(false)
            return 100
          }
          return newProgress
        })
      }, 100)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isRecording])

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

  // 일반 화면 렌더링
  return (
    <QuizContainer
      bgImage={IMAGES.theme[theme].quiz.background.quizBg}
      quizTitle="Ai Speak Practice"
      theme={theme}
      themeNumber={themeNumber}
      showThemeInfo={true}
    >
      <PlayAudioButton
        isVisible={true}
        questionType={currentQuiz.questionType}
        audioLetter={currentQuiz.quizSound}
      />
      <QuizBody>
        <RecordingQuestion
          questionImage={currentQuiz.questionImage}
          question={currentQuiz.question as string}
          recordQuestionType={currentQuiz.recordQuestionType}
        />
        <RecordButton
          progress={progress}
          isRecording={isRecording}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
        />
        {/* 다음 장면을 보기 위한 임시 버튼 */}
        <button
          onClick={() => handleOptionClick(currentQuiz.question as string)}
        >
          next
        </button>
      </QuizBody>
    </QuizContainer>
  )
}
