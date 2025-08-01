import { useState, useCallback, useEffect, useMemo } from 'react'
import { TIMING } from '@constants/constant'

import { QuizCallbacks } from './useQuizLogic'

// 타입 정의
export interface CardItem {
  id: string
  uppercase: string
  lowercase: string
  isFlipped: boolean
  isMatched: boolean
}

export interface CardMatchingOptions {
  showDuration?: number
}

export type GamePhase = 'showing' | 'playing' | 'completed'

export interface UseCardMatchingLogicReturn {
  cards: CardItem[]
  selectedCards: CardItem[]
  gamePhase: GamePhase
  matchedPairs: number
  totalPairs: number
  isCompleted: boolean
  handleCardClick: (cardId: string) => void
}

/**
 * 카드 매칭 게임 로직을 관리하는 커스텀 훅
 */
export function useCardMatchingLogic(
  cardPairs: { uppercase: string; lowercase: string }[],
  callbacks: QuizCallbacks,
  options: CardMatchingOptions = {},
): UseCardMatchingLogicReturn {
  const { showDuration = TIMING.CARD_MATCHING.SHOW_DURATION } = options
  const { onCorrect, onIncorrect, onComplete } = callbacks

  // 카드 데이터 초기화
  const initialCards = useMemo(() => {
    const allCards: CardItem[] = []

    cardPairs.forEach((pair, index) => {
      // 앞면 카드 (대문자)
      allCards.push({
        id: `front-${index}`,
        uppercase: pair.uppercase,
        lowercase: pair.lowercase,
        isFlipped: true,
        isMatched: false,
      })

      // 뒷면 카드 (소문자)
      allCards.push({
        id: `back-${index}`,
        uppercase: pair.uppercase,
        lowercase: pair.lowercase,
        isFlipped: true,
        isMatched: false,
      })
    })

    // Fisher-Yates 셔플
    for (let i = allCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[allCards[i], allCards[j]] = [allCards[j], allCards[i]]
    }

    return allCards
  }, [cardPairs])

  // 상태 관리
  const [cards, setCards] = useState<CardItem[]>(initialCards)
  const [selectedCards, setSelectedCards] = useState<CardItem[]>([])
  const [gamePhase, setGamePhase] = useState<GamePhase>('showing')
  const [matchedPairs, setMatchedPairs] = useState(0)

  const totalPairs = cardPairs.length
  const isCompleted = matchedPairs === totalPairs

  // 매칭 진행 상황 로그
  useEffect(() => {
    console.log(`매칭된 쌍: ${matchedPairs}/${totalPairs}`)
    if (isCompleted) {
      console.log('🎉 모든 쌍이 매칭되었습니다!')
    }
  }, [matchedPairs, totalPairs, isCompleted])

  // 초기 카드 보여주기 후 뒤집기
  useEffect(() => {
    if (gamePhase === 'showing') {
      const timer = setTimeout(() => {
        setCards((prev) => prev.map((card) => ({ ...card, isFlipped: false })))
        setGamePhase('playing')
        console.log('카드 게임 시작: 모든 카드를 뒤집었습니다')
      }, showDuration)

      return () => clearTimeout(timer)
    }
  }, [gamePhase, showDuration])

  // 게임 완료 처리
  useEffect(() => {
    if (isCompleted) {
      console.log('🎯 게임 완료 감지! onComplete 호출 예정:', {
        matchedPairs,
        totalPairs,
        delay: TIMING.CARD_MATCHING.COMPLETE_DELAY,
      })

      const timer = setTimeout(() => {
        console.log('🎉 onComplete() 호출!')
        onComplete?.()
      }, TIMING.CARD_MATCHING.COMPLETE_DELAY)

      return () => clearTimeout(timer)
    }
  }, [isCompleted, onComplete, matchedPairs, totalPairs])

  // 카드 매칭 로직
  const checkMatch = useCallback(
    (card1: CardItem, card2: CardItem): boolean => {
      const isFrontBack =
        card1.id.startsWith('front-') && card2.id.startsWith('back-')
      const isBackFront =
        card1.id.startsWith('back-') && card2.id.startsWith('front-')

      return (
        (isFrontBack || isBackFront) &&
        card1.uppercase === card2.uppercase &&
        card1.lowercase === card2.lowercase
      )
    },
    [],
  )

  // 카드 클릭 핸들러
  const handleCardClick = useCallback(
    (cardId: string) => {
      if (gamePhase !== 'playing') return

      const clickedCard = cards.find((card) => card.id === cardId)
      if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return

      if (selectedCards.length === 0) {
        // 첫 번째 카드 선택
        setCards((prev) =>
          prev.map((card) =>
            card.id === cardId ? { ...card, isFlipped: true } : card,
          ),
        )
        setSelectedCards([clickedCard])
      } else if (selectedCards.length === 1) {
        // 두 번째 카드 선택
        setCards((prev) =>
          prev.map((card) =>
            card.id === cardId ? { ...card, isFlipped: true } : card,
          ),
        )

        const firstCard = selectedCards[0]
        const secondCard = clickedCard

        // 매칭 확인
        setTimeout(() => {
          const isMatch = checkMatch(firstCard, secondCard)

          if (isMatch) {
            // 매칭 성공
            console.log('✅ 카드 매칭 성공!', {
              firstCard: firstCard.uppercase + firstCard.lowercase,
              secondCard: secondCard.uppercase + secondCard.lowercase,
              currentMatched: matchedPairs,
              willBe: matchedPairs + 1,
              totalPairs,
            })

            setCards((prev) =>
              prev.map((card) =>
                card.id === firstCard.id || card.id === secondCard.id
                  ? { ...card, isMatched: true }
                  : card,
              ),
            )
            setMatchedPairs((prev) => {
              const newCount = prev + 1
              console.log(`🔢 matchedPairs 업데이트: ${prev} → ${newCount}`)
              return newCount
            })
            onCorrect?.()
          } else {
            // 매칭 실패 - 카드 다시 뒤집기
            setCards((prev) =>
              prev.map((card) =>
                card.id === firstCard.id || card.id === secondCard.id
                  ? { ...card, isFlipped: false }
                  : card,
              ),
            )
            onIncorrect?.()
          }

          setSelectedCards([])
        }, TIMING.CARD_MATCHING.MATCH_DELAY)
      }
    },
    [cards, selectedCards, gamePhase, onCorrect, onIncorrect, checkMatch],
  )

  return {
    cards,
    selectedCards,
    gamePhase,
    matchedPairs,
    totalPairs,
    isCompleted,
    handleCardClick,
  }
}
