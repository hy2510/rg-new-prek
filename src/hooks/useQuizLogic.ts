import { useState, useCallback, useEffect, useMemo } from 'react'
import { SoundManager } from '@utils/SoundManager'

// 퀴즈 데이터 타입
export interface QuizItem {
  questionImage?: string
  question: string | string[]
  options: string | string[]
  correctAnswer: string | string[]
  quizSound?: string
  questionType?: keyof (typeof SoundManager)['QUESTION_SOUNDS_BASE']
  recordQuestionType?: 'word' | 'sentence'
}

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
  enableDevLogs?: boolean // 개발 로그 활성화 여부
}

// 커스텀 훅의 반환 타입
export interface UseQuizLogicReturn {
  currentQuestionIndex: number
  isCompleted: boolean
  currentQuiz: QuizItem
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
  quizData: QuizItem[],
  callbacks: QuizCallbacks,
  options: QuizOptions = {},
): UseQuizLogicReturn {
  const {
    playQuestionAudio = true,
    playResultAudio = true,
    resultAudioContent,
    enableDevLogs = process.env.NODE_ENV === 'development',
  } = options

  const { onCorrect, onIncorrect, onComplete } = callbacks

  // 상태 관리
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false)

  // 메모이제이션된 값들
  const currentQuiz = useMemo(() => {
    const quiz = quizData[currentQuestionIndex]
    if (process.env.NODE_ENV === 'development' && !quiz) {
      console.warn(
        `⚠️ currentQuiz가 undefined입니다. 인덱스: ${currentQuestionIndex}, 배열 길이: ${quizData.length}`,
      )
    }
    return quiz
  }, [quizData, currentQuestionIndex])

  const isLastQuestion = useMemo(
    () => currentQuestionIndex === quizData.length - 1,
    [currentQuestionIndex, quizData.length],
  )

  const resultText = useMemo(
    () => quizData.map((quiz) => quiz.question).join(''),
    [quizData],
  )

  // 문제 변경 시 상태 초기화 및 음원 재생
  useEffect(() => {
    if (!currentQuiz || isCompleted) return

    // 새 문제로 전환 시 처리 상태 초기화
    setIsProcessingAnswer(false)

    if (!playQuestionAudio) return

    const timer = setTimeout(() => {
      if (currentQuiz.quizSound && currentQuiz.questionType) {
        SoundManager.playQuestionSound(
          currentQuiz.questionType,
          currentQuiz.quizSound,
        )
      }

      if (enableDevLogs) {
        console.log(`재생 중인 파일명: ${currentQuiz.quizSound}`)
      }
    }, QUIZ_TIMING.AUDIO_DELAY)

    return () => clearTimeout(timer)
  }, [
    currentQuestionIndex,
    currentQuiz,
    isCompleted,
    playQuestionAudio,
    enableDevLogs,
  ])

  // 결과 화면에서 음원 재생
  useEffect(() => {
    if (!isCompleted || !playResultAudio) return

    const timer = setTimeout(() => {
      const audioContent = resultAudioContent || resultText
      SoundManager.playQuestionSound('default', audioContent)

      if (enableDevLogs) {
        console.log(`결과 화면 음성 재생: ${audioContent}`)
      }
    }, QUIZ_TIMING.RESULT_AUDIO_DELAY)

    return () => clearTimeout(timer)
  }, [
    isCompleted,
    playResultAudio,
    resultAudioContent,
    resultText,
    enableDevLogs,
  ])

  // 옵션 클릭 핸들러
  const handleOptionClick = useCallback(
    (selectedOption: string) => {
      if (isCompleted || isProcessingAnswer) {
        if (enableDevLogs) {
          console.log('🚫 handleOptionClick 무시됨:', {
            isCompleted,
            isProcessingAnswer,
            selectedOption,
          })
        }
        return
      }

      if (enableDevLogs) {
        console.log('🎯 handleOptionClick 시작:', selectedOption)
      }

      setIsProcessingAnswer(true)

      // 퀴즈 타입별 정답 검증 로직
      const isOrderPhrasesQuiz =
        Array.isArray(currentQuiz.question) &&
        Array.isArray(currentQuiz.options) &&
        currentQuiz.question.some((item) => item === '') &&
        currentQuiz.options.length >= 2 && // OrderPhrases는 2개 이상의 단어 조각
        typeof currentQuiz.options[0] === 'string' &&
        currentQuiz.options[0].length > 1 && // 단일 글자가 아닌 단어들
        (currentQuiz.question.length >= 3 || // 문장이 3개 이상의 부분으로 구성 또는
          currentQuiz.question.some((item) => item.length > 2)) // 고정 텍스트가 2글자 이상

      const isCompleteWordQuiz =
        Array.isArray(currentQuiz.question) &&
        Array.isArray(currentQuiz.options) &&
        currentQuiz.question.some((item) => item === '') &&
        currentQuiz.options.length <= 3 && // CompleteWord는 보통 2-3개의 글자 선택지
        typeof currentQuiz.options[0] === 'string' &&
        currentQuiz.options[0].length === 1 // CompleteWord의 options는 단일 글자

      const isTypingQuiz =
        typeof currentQuiz.question === 'string' &&
        Array.isArray(currentQuiz.options) &&
        currentQuiz.options.length === 0 &&
        currentQuiz.correctAnswer === currentQuiz.question // 타이핑 퀴즈는 question과 correctAnswer가 동일

      let isCorrect: boolean

      if (enableDevLogs) {
        console.log('🔍 퀴즈 타입 감지:', {
          question: currentQuiz.question,
          options: currentQuiz.options,
          isOrderPhrasesQuiz,
          isCompleteWordQuiz,
          isTypingQuiz,
        })
      }

      if (isOrderPhrasesQuiz) {
        // OrderPhrasesByImage: options 순서와 비교
        const correctOrder = (currentQuiz.options as string[]).join(' ')
        isCorrect = selectedOption === correctOrder
        if (enableDevLogs) {
          console.log(
            `OrderPhrases 퀴즈 정답 검증: "${selectedOption}" vs "${correctOrder}" (options 순서) = ${isCorrect}`,
          )
        }
      } else if (isCompleteWordQuiz) {
        // CompleteWordByPhoneme: correctAnswer와 비교
        isCorrect = selectedOption === currentQuiz.correctAnswer
        if (enableDevLogs) {
          console.log(
            `CompleteWord 퀴즈 정답 검증: "${selectedOption}" vs "${currentQuiz.correctAnswer}" = ${isCorrect}`,
          )
        }
      } else if (isTypingQuiz) {
        // TypeWordBySound: 완성된 단어가 정답과 일치하는지 확인
        isCorrect = selectedOption === currentQuiz.correctAnswer
        if (enableDevLogs) {
          console.log(
            `Typing 퀴즈 정답 검증: "${selectedOption}" vs "${currentQuiz.correctAnswer}" = ${isCorrect}`,
          )
          console.log('타이핑 퀴즈 상세 정보:', {
            question: currentQuiz.question,
            selectedOption,
            correctAnswer: currentQuiz.correctAnswer,
            isTypingQuizDetected: isTypingQuiz,
          })
        }
      } else {
        // 기존 퀴즈들의 정답 비교 로직 (options[0]과 비교)
        isCorrect = selectedOption === currentQuiz.options[0]
        if (enableDevLogs) {
          console.log(
            `일반 퀴즈 정답 검증: "${selectedOption}" vs "${currentQuiz.options[0]}" = ${isCorrect}`,
          )
        }
      }

      if (isCorrect) {
        onCorrect?.()

        if (enableDevLogs) {
          console.log(`정답! 선택: ${selectedOption}`)
        }

        if (enableDevLogs) {
          console.log(
            `현재 문제 인덱스: ${currentQuestionIndex}, 전체 문제 수: ${quizData.length}, 마지막 문제 여부: ${isLastQuestion}`,
          )
        }

        if (isLastQuestion) {
          setTimeout(() => {
            setIsCompleted(true)
            setIsProcessingAnswer(false)
            if (enableDevLogs) {
              console.log('퀴즈 완료!')
            }
          }, QUIZ_TIMING.CORRECT_NEXT)
        } else {
          setTimeout(() => {
            setCurrentQuestionIndex((prev) => {
              const nextIndex = prev + 1
              if (enableDevLogs) {
                console.log(`다음 문제로 이동: ${nextIndex} (현재: ${prev})`)
              }
              return nextIndex
            })
            setIsProcessingAnswer(false)
          }, QUIZ_TIMING.CORRECT_NEXT)
        }
      } else {
        onIncorrect?.()
        setIsProcessingAnswer(false) // 오답 시 즉시 처리 상태 해제

        if (enableDevLogs) {
          console.log(
            `오답! 선택: ${selectedOption}, 정답: ${currentQuiz.correctAnswer}`,
          )
        }

        // 틀렸을 때 문제 음성 자동 재생
        if (currentQuiz.quizSound && currentQuiz.questionType) {
          setTimeout(() => {
            SoundManager.playQuestionSound(
              currentQuiz.questionType!,
              currentQuiz.quizSound!,
            )

            if (enableDevLogs) {
              console.log(`오답 후 음성 재생: ${currentQuiz.quizSound}`)
            }
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
      enableDevLogs,
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

    if (enableDevLogs) {
      console.log('퀴즈 완료! onComplete 호출됨')
    }
  }, [isCompleted, onComplete, enableDevLogs])

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
