# Quiz Logic Hooks

이 폴더는 퀴즈 모듈에서 공통으로 사용되는 로직을 관리하는 커스텀 훅들을 포함합니다.

## useQuizLogic

퀴즈의 공통 로직(상태 관리, 음성 재생, 진행률 관리 등)을 제공하는 커스텀 훅입니다.

### 기본 사용법

```typescript
import { useQuizLogic, QuizItem, QuizCallbacks } from '@hooks/useQuizLogic'

// 1. 퀴즈 데이터 정의
const quizData: QuizItem[] = [
  {
    question: 'A',
    options: ['a', 'b', 'c'],
    correctAnswer: 'a',
  },
  // ... 더 많은 문제들
]

// 2. 컴포넌트에서 사용
function MyQuiz({ onCorrect, onIncorrect, onComplete }: QuizCallbacks) {
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
      playQuestionAudio: true,
      playResultAudio: true,
      resultAudioContent: 'A', // 커스텀 결과 음성
    },
  )

  // 3. 조건부 렌더링
  if (isCompleted) {
    return <div>완료 화면</div>
  }

  return (
    <div>
      <h1>{getQuizTitle('My Quiz')}</h1>
      <div>{currentQuiz.question}</div>
      {currentQuiz.options.map((option) => (
        <button key={option} onClick={() => handleOptionClick(option)}>
          {option}
        </button>
      ))}
    </div>
  )
}
```

### 매개변수

#### quizData: QuizItem[]

퀴즈 문제 데이터 배열

```typescript
interface QuizItem {
  question: string // 문제 텍스트
  options: string[] // 선택지 배열
  correctAnswer: string // 정답
}
```

#### callbacks: QuizCallbacks

퀴즈 이벤트 콜백 함수들

```typescript
interface QuizCallbacks {
  onCorrect?: () => void // 정답 선택 시
  onIncorrect?: () => void // 오답 선택 시
  onComplete?: () => void // 퀴즈 완료 시
}
```

#### options: QuizOptions (선택사항)

퀴즈 동작 옵션들

```typescript
interface QuizOptions {
  playQuestionAudio?: boolean // 문제 음성 재생 (기본: true)
  playResultAudio?: boolean // 결과 음성 재생 (기본: true)
  resultAudioContent?: string // 커스텀 결과 음성 (기본: resultText)
  enableDevLogs?: boolean // 개발 로그 활성화 (기본: development 모드에서 true)
}
```

### 반환값

```typescript
interface UseQuizLogicReturn {
  // 상태
  currentQuestionIndex: number // 현재 문제 인덱스
  isCompleted: boolean // 퀴즈 완료 여부
  currentQuiz: QuizItem // 현재 문제 데이터
  isLastQuestion: boolean // 마지막 문제 여부
  resultText: string // 결과 텍스트 (모든 문제 조합)

  // 핸들러
  handleOptionClick: (selectedOption: string) => void

  // 유틸리티
  getQuizTitle: (baseTitle: string) => string // "Base Title (1/3)"
  getCompleteTitle: (baseTitle: string) => string // "Base Title - Complete!"
}
```

### 실제 사용 예시

#### MatchLetter1.tsx

```typescript
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
    playQuestionAudio: true,
    playResultAudio: true,
    resultAudioContent: 'A', // 특정 음성 재생
  },
)
```

#### ChooseLetterBySound.tsx

```typescript
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
    playQuestionAudio: true,
    playResultAudio: true,
    // resultAudioContent 생략 시 resultText 사용
  },
)
```

## 상수

### QUIZ_TIMING

퀴즈에서 사용되는 타이밍 상수들

```typescript
export const QUIZ_TIMING = {
  AUDIO_DELAY: 500, // 문제 시작 시 음성 재생 딜레이
  CORRECT_NEXT: 1500, // 정답 후 다음 문제로 이동 시간
  RESULT_AUDIO_DELAY: 500, // 결과 화면에서 음성 재생 딜레이
  COMPLETE_DELAY: 3000, // 결과 표시 후 완료까지 시간
} as const
```

## 관련 컴포넌트

### QuizResultScreen

결과 화면을 위한 공통 컴포넌트 (`@components/common/QuizResultScreen`)

```typescript
<QuizResultScreen
  title={getCompleteTitle('My Quiz')}
  resultText={resultText}
  theme={theme}
  themeNumber={themeNumber}
>
  <CustomResultContent />
</QuizResultScreen>
```

## 마이그레이션 가이드

### 기존 퀴즈 모듈을 useQuizLogic으로 변환하기

1. **공통 imports 추가**

```typescript
import { useQuizLogic, QuizItem, QuizCallbacks } from '@hooks/useQuizLogic'
import QuizResultScreen from '@components/common/QuizResultScreen'
```

2. **퀴즈 데이터 타입 변경**

```typescript
// 기존
const quizData = [...]

// 변경 후
const quizData: QuizItem[] = [...]
```

3. **Props 타입 변경**

```typescript
// 기존
type MyQuizProps = {
  onCorrect?: () => void
  onIncorrect?: () => void
  onComplete?: () => void
  theme?: ThemeType
  themeNumber?: ThemeNumber
}

// 변경 후
type MyQuizProps = QuizCallbacks & {
  theme?: ThemeType
  themeNumber?: ThemeNumber
}
```

4. **상태 및 로직을 useQuizLogic으로 교체**

```typescript
// 기존
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
const [isCompleted, setIsCompleted] = useState(false)
// ... 많은 useEffect와 로직들

// 변경 후
const {
  isCompleted,
  currentQuiz,
  resultText,
  handleOptionClick,
  getQuizTitle,
  getCompleteTitle,
} = useQuizLogic(quizData, { onCorrect, onIncorrect, onComplete })
```

5. **결과 화면을 QuizResultScreen으로 교체**

```typescript
// 기존
if (isCompleted) {
  return (
    <QuizContainer ...>
      <QuizBody>
        <div>결과 내용</div>
      </QuizBody>
    </QuizContainer>
  )
}

// 변경 후
if (isCompleted) {
  return (
    <QuizResultScreen
      title={getCompleteTitle('Quiz Name')}
      resultText={resultText}
      theme={theme}
      themeNumber={themeNumber}
    >
      <CustomResultContent />
    </QuizResultScreen>
  )
}
```

## 이점

- ✅ **코드 중복 제거**: 모든 퀴즈에서 반복되는 로직 제거
- ✅ **일관성**: 모든 퀴즈가 동일한 동작 패턴을 따름
- ✅ **유지보수성**: 공통 로직 수정 시 한 곳에서만 변경
- ✅ **타입 안전성**: TypeScript로 타입 보장
- ✅ **성능 최적화**: 메모이제이션 내장
- ✅ **확장성**: 새로운 퀴즈 모듈을 쉽게 추가 가능
