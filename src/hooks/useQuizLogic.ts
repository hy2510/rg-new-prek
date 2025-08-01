import { IQuizInfo } from '@interfaces/IStudyInfo'
import { useState, useCallback, useEffect, useMemo } from 'react'

// 퀴즈 콜백 함수들 타입
export interface QuizCallbacks {
  onCorrect?: () => void
  onIncorrect?: () => void
  onComplete?: () => void
  onClose?: () => void // 퀴즈 결과 화면에서 팝업 닫기
}

// 퀴즈 타이밍 상수
export const QUIZ_TIMING = {
  AUDIO_DELAY: 500, // 문제 시작 시 음성 재생 딜레이
  CORRECT_NEXT: 1500, // 정답 후 다음 문제로 이동 시간
  RESULT_AUDIO_DELAY: 500, // 결과 화면에서 음성 재생 딜레이
  // COMPLETE_DELAY: 3000, // 결과 표시 후 완료까지 시간
} as const

// 퀴즈 옵션
export interface QuizOptions {
  playQuestionAudio?: boolean // 문제 변경 시 음성 재생 여부
  playResultAudio?: boolean // 결과 화면에서 음성 재생 여부
  resultAudioContent?: string // 결과 음성 내용 (기본값: resultText)
}

type Quiz = {
  QuizId: string
  QuizNo: string
  Question: string
  CorrectText: string
  ExampleCount: number
  Options: string[]
  Images: string[]
  Sounds: string[]
}

// 커스텀 훅의 반환 타입
export interface UseQuizLogicReturn {
  isCompleted: boolean
  currentQuestionIndex: number
  currentQuiz: Quiz
  isLastQuestion: boolean
  resultText: string
  handleOptionClick: (selectedOption: string) => void
  getQuizTitle: (baseTitle: string) => string
  getCompleteTitle: (baseTitle: string) => string
}

/**
 * 퀴즈 공통 로직을 관리하는 커스텀 훅
 */
export function useQuizLogic(
  quizData: IQuizInfo['quiz'],
  callbacks: QuizCallbacks,
  options: QuizOptions = {},
): UseQuizLogicReturn {
  const {
    playQuestionAudio = true,
    playResultAudio = true,
    resultAudioContent,
  } = options

  const { onCorrect, onIncorrect, onComplete } = callbacks

  // 상태 관리
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false)

  // 유틸리티 함수
  const createDynamicArray = (data: any, prefix: string, count: number) => {
    const array = []
    for (let i = 1; i <= count; i++) {
      const item = data[`${prefix}${i}`]
      if (item) array.push(item)
    }
    return array
  }

  // 메모이제이션된 값들
  const currentQuiz = useMemo(() => {
    const currentQuizData = quizData[currentQuestionIndex]

    const quiz = {
      QuizId: currentQuizData.QuizId,
      QuizNo: currentQuizData.QuizNo,
      Question: currentQuizData.Question,
      CorrectText: currentQuizData.CorrectText,
      ExampleCount: currentQuizData.ExampleCount,
      Options: createDynamicArray(
        currentQuizData,
        'Example',
        currentQuizData.ExampleCount,
      ),
      Images: createDynamicArray(
        currentQuizData,
        'Image',
        currentQuizData.ExampleCount,
      ),
      Sounds: createDynamicArray(
        currentQuizData,
        'Sound',
        currentQuizData.ExampleCount,
      ),
    }

    return quiz
  }, [quizData, currentQuestionIndex])

  const isLastQuestion = useMemo(
    () => currentQuestionIndex === quizData.length - 1,
    [currentQuestionIndex, quizData.length],
  )

  const resultText = useMemo(
    () => quizData.map((quiz) => quiz.CorrectText).join(''),
    [quizData],
  )

  // 문제 변경 시 상태 초기화 및 음원 재생
  useEffect(() => {
    if (!currentQuiz || isCompleted) return

    // 새 문제로 전환 시 처리 상태 초기화
    setIsProcessingAnswer(false)

    if (!playQuestionAudio) return

    const timer = setTimeout(() => {
      if (currentQuiz.Sounds[0]) {
        // SoundManager.playQuestionSound(
        //   currentQuiz.questionType,
        //   currentQuiz.quizSound,
        // )
      }
    }, QUIZ_TIMING.AUDIO_DELAY)

    return () => clearTimeout(timer)
  }, [currentQuestionIndex, currentQuiz, isCompleted, playQuestionAudio])

  // 결과 화면에서 음원 재생
  useEffect(() => {
    if (!isCompleted || !playResultAudio) return

    const timer = setTimeout(() => {
      const audioContent = resultAudioContent || resultText
      // SoundManager.playQuestionSound('default', audioContent)
    }, QUIZ_TIMING.RESULT_AUDIO_DELAY)

    return () => clearTimeout(timer)
  }, [isCompleted, playResultAudio, resultAudioContent, resultText])

  // 옵션 클릭 핸들러
  const handleOptionClick = useCallback(
    (selectedOption: string) => {
      if (isCompleted || isProcessingAnswer) {
        return
      }

      setIsProcessingAnswer(true)

      // 퀴즈 타입별 정답 검증 로직
      const isOrderPhrasesQuiz =
        Array.isArray(currentQuiz.Question) &&
        Array.isArray(currentQuiz.Options) &&
        currentQuiz.Question.some((item) => item === '') &&
        currentQuiz.Options.length >= 2 && // OrderPhrases는 2개 이상의 단어 조각
        typeof currentQuiz.Options[0] === 'string' &&
        currentQuiz.Options[0].length > 1 && // 단일 글자가 아닌 단어들
        (currentQuiz.Question.length >= 3 || // 문장이 3개 이상의 부분으로 구성 또는
          currentQuiz.Question.some((item) => item.length > 2)) // 고정 텍스트가 2글자 이상

      const isCompleteWordQuiz =
        Array.isArray(currentQuiz.Question) &&
        Array.isArray(currentQuiz.Options) &&
        currentQuiz.Question.some((item) => item === '') &&
        currentQuiz.Options.length <= 3 && // CompleteWord는 보통 2-3개의 글자 선택지
        typeof currentQuiz.Options[0] === 'string' &&
        currentQuiz.Options[0].length === 1 // CompleteWord의 options는 단일 글자

      const isTypingQuiz =
        typeof currentQuiz.Question === 'string' &&
        Array.isArray(currentQuiz.Options) &&
        currentQuiz.Options.length === 0 &&
        currentQuiz.CorrectText === currentQuiz.Question // 타이핑 퀴즈는 question과 correctAnswer가 동일

      let isCorrect: boolean

      if (isOrderPhrasesQuiz) {
        // OrderPhrasesByImage: options 순서와 비교
        const correctOrder = (currentQuiz.Options as string[]).join(' ')
        isCorrect = selectedOption === correctOrder
      } else if (isCompleteWordQuiz) {
        // CompleteWordByPhoneme: correctAnswer와 비교
        isCorrect = selectedOption === currentQuiz.CorrectText
      } else if (isTypingQuiz) {
        // TypeWordBySound: 완성된 단어가 정답과 일치하는지 확인
        isCorrect = selectedOption === currentQuiz.CorrectText
      } else {
        // 기존 퀴즈들의 정답 비교 로직 (options[0]과 비교)
        isCorrect = selectedOption === currentQuiz.Options[0]
      }

      if (isCorrect) {
        onCorrect?.()

        if (isLastQuestion) {
          setTimeout(() => {
            setIsCompleted(true)
            setIsProcessingAnswer(false)
          }, QUIZ_TIMING.CORRECT_NEXT)
        } else {
          setTimeout(() => {
            setCurrentQuestionIndex((prev) => {
              const nextIndex = prev + 1

              return nextIndex
            })
            setIsProcessingAnswer(false)
          }, QUIZ_TIMING.CORRECT_NEXT)
        }
      } else {
        onIncorrect?.()
        setIsProcessingAnswer(false) // 오답 시 즉시 처리 상태 해제

        // 틀렸을 때 문제 음성 자동 재생
        if (currentQuiz.Sounds[0]) {
          setTimeout(() => {
            // SoundManager.playQuestionSound(
            //   currentQuiz.questionType!,
            //   currentQuiz.quizSound!,
            // )
          }, 1500) // 오답 처리 후 약간의 딜레이
        }
      }
    },
    [
      isCompleted,
      isProcessingAnswer,
      currentQuiz,
      isLastQuestion,
      currentQuestionIndex,
      onCorrect,
      onIncorrect,
      quizData.length,
    ],
  )

  // 퀴즈 완료 시 onComplete 호출후 일정 시간 뒤에 종료 처리 (팝업 자동 닫힘)
  // useEffect(() => {
  //   if (!isCompleted) return

  //   const timer = setTimeout(() => {
  //     onComplete?.()

  //     if (enableDevLogs) {
  //       console.log('onComplete 호출됨')
  //     }
  //   }, QUIZ_TIMING.COMPLETE_DELAY)

  //   return () => clearTimeout(timer)
  // }, [isCompleted, onComplete, enableDevLogs])

  // 퀴즈 완료 시 onComplete 호출
  useEffect(() => {
    if (!isCompleted) return

    // 완료 처리만 수행, 팝업 닫힘은 별도 처리
    onComplete?.()
  }, [isCompleted, onComplete])

  // 제목 생성 유틸리티 함수들
  const getQuizTitle = useCallback(
    (baseTitle: string) => {
      if (isCompleted) {
        return `${baseTitle} - Complete!`
      }
      return `${baseTitle} (${currentQuestionIndex + 1}/${quizData.length})`
    },
    [isCompleted, currentQuestionIndex, quizData.length],
  )

  const getCompleteTitle = useCallback(
    (baseTitle: string) => `${baseTitle} - Complete!`,
    [],
  )

  return {
    currentQuestionIndex,
    isCompleted,
    currentQuiz,
    isLastQuestion,
    resultText,
    handleOptionClick,
    getQuizTitle,
    getCompleteTitle,
  }
}
