/**
 * useQuizLogic을 사용하여 새로운 퀴즈 모듈을 만드는 최신 예시입니다.
 *
 * 주요 특징:
 * - 타입 안전성 보장
 * - 최신 QuizResultScreen 컴포넌트 사용
 * - 개선된 오디오 재생 기능
 * - 팝업 자동 닫힘 방지
 * - 일관된 코드 패턴
 *
 * 실제 구현시에는 이 파일을 참고하여 새로운 퀴즈 모듈을 만드세요.
 */

import { ThemeType } from '@interfaces/IThemeType'
import QuizContainer, { QuizBody } from '@components/common/QuizContainer'
import { Images } from '@utils/Assets'
import ShortTextOptions from '@components/options/ShortTextOptions'
import ShortTextWithAudioQuestion from '@components/questions/ShortTextWithAudioQuestion'
import QuizResultScreen from '@components/common/QuizResultScreen'
import { useQuizLogic, QuizItem, QuizCallbacks } from '@hooks/useQuizLogic'
import PlayAudioButton from '@components/common/PlayAudioButton'

// === 1. Props 타입 정의 ===
type ExampleQuizProps = QuizCallbacks & {
  theme?: ThemeType
  themeNumber?: number
  audioLetter?: string // SubViewContainer에서 전달되는 오디오 파라미터
}

// === 2. 퀴즈 데이터 정의 ===
const quizData: QuizItem[] = [
  {
    question: 'Choose the correct lowercase letter for: A',
    options: ['a', 'b', 'c'], // 항상 string[] 타입으로 정의
    correctAnswer: 'a',
    quizSound: 'alphabet/letter/a',
    questionType: 'alphabetLetter',
  },
  {
    question: 'Choose the correct lowercase letter for: B',
    options: ['a', 'b', 'c'],
    correctAnswer: 'b',
    quizSound: 'alphabet/letter/b',
    questionType: 'alphabetLetter',
  },
  {
    question: 'Choose the correct lowercase letter for: C',
    options: ['a', 'b', 'c'],
    correctAnswer: 'c',
    quizSound: 'alphabet/letter/c',
    questionType: 'alphabetLetter',
  },
]

// === 3. 퀴즈 설정 상수 ===
const QUIZ_CONFIG = {
  BASE_TITLE: 'Example Quiz Module',
  COMPLETE_MESSAGE: 'Excellent Work!',
  // 결과 음성을 커스터마이징하려면:
  RESULT_AUDIO: 'abc', // 결과 화면에서 재생할 특정 음성
} as const

// === 4. 메인 컴포넌트 ===
export default function ExampleQuiz({
  onCorrect,
  onIncorrect,
  onComplete,
  theme = 'Baro',
  themeNumber = 1,
  audioLetter,
}: ExampleQuizProps) {
  // === 5. useQuizLogic 훅 사용 ===
  const {
    isCompleted,
    currentQuiz,
    resultText,
    handleOptionClick,
    getQuizTitle,
    getCompleteTitle,
  } = useQuizLogic(
    quizData,
    { onCorrect, onIncorrect, onComplete },
    {
      playQuestionAudio: true, // 문제 변경 시 음성 자동 재생
      playResultAudio: true, // 결과 화면에서 음성 재생
      resultAudioContent: QUIZ_CONFIG.RESULT_AUDIO, // 커스텀 결과 음성
    },
  )

  // === 6. 결과 화면 렌더링 ===
  if (isCompleted) {
    return (
      <QuizResultScreen
        title={getCompleteTitle(QUIZ_CONFIG.BASE_TITLE)}
        theme={theme}
        themeNumber={themeNumber}
      >
        {/* 커스텀 결과 내용 */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#4CAF50',
              marginBottom: '20px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            🎉 {QUIZ_CONFIG.COMPLETE_MESSAGE} 🎉
          </div>
          <div
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              letterSpacing: '8px',
              color: '#2196F3',
              textTransform: 'uppercase',
            }}
          >
            {resultText}
          </div>
          <div
            style={{
              fontSize: '24px',
              marginTop: '20px',
              color: '#666',
            }}
          >
            퀴즈를 완료했습니다! 🌟
          </div>
        </div>
      </QuizResultScreen>
    )
  }

  // === 7. 일반 퀴즈 화면 렌더링 ===
  return (
    <QuizContainer
      bgImage={Images.Theme[theme].Quiz.quizBg}
      quizTitle={getQuizTitle(QUIZ_CONFIG.BASE_TITLE)}
      theme={theme}
      themeNumber={themeNumber}
      showThemeInfo={true}
    >
      {/* 오디오 재생 버튼 */}
      <PlayAudioButton
        isVisible={true}
        audioLetter={currentQuiz.quizSound}
        questionType={currentQuiz.questionType}
      />

      <QuizBody>
        {/* 문제 표시 영역 */}
        <ShortTextWithAudioQuestion text={currentQuiz.question as string} />

        {/* 선택지 영역 - 타입 안전성 보장 */}
        <ShortTextOptions
          options={currentQuiz.options as string[]}
          onOptionClick={handleOptionClick}
        />
      </QuizBody>
    </QuizContainer>
  )
}

/**
 * === 다른 퀴즈 모듈 구현 패턴 ===
 *
 * 모든 퀴즈 모듈은 동일한 패턴을 따릅니다:
 *
 * 1. 타입 정의:
 *    - QuizCallbacks & { theme?, themeNumber?, audioLetter? }
 *
 * 2. 데이터 구조:
 *    - QuizItem[] 형태로 문제 정의
 *    - question, options, correctAnswer, quizSound, questionType
 *
 * 3. 훅 사용:
 *    - useQuizLogic으로 상태 관리
 *    - 옵션 설정으로 동작 커스터마이징
 *
 * 4. 렌더링 패턴:
 *    - 조건부 렌더링 (isCompleted 체크)
 *    - QuizResultScreen으로 결과 표시
 *    - QuizContainer + QuizBody로 일반 화면 구성
 *
 * 5. 오디오 처리:
 *    - PlayAudioButton으로 수동 재생
 *    - useQuizLogic 옵션으로 자동 재생 제어
 *
 * === 주요 개선 사항 ===
 *
 * - ✅ 타입 안전성: string[] 명시적 타입 지정
 * - ✅ 오류 처리: 개선된 오디오 재생 시스템
 * - ✅ 사용자 경험: 팝업 자동 닫힘 방지
 * - ✅ 개발 경험: 명확한 로깅과 디버깅
 * - ✅ 코드 품질: 일관된 패턴과 구조
 * - ✅ 접근성: 향상된 UI/UX 컴포넌트
 */
