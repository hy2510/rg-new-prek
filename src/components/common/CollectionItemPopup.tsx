import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { IMAGES } from '@utils/ImageManager'

interface CollectionItemPopupProps {
  character: 'baro' | 'chello' | 'millo'
  itemNumber: 1 | 2 | 3
  title?: string
  onClose: () => void
  autoCloseDelay?: number // 자동 닫기 지연 시간 (ms)
}

const COLLECTION_ITEM_NAMES = {
  baro: {
    1: '골든 스컬',
    2: '황금 나침반',
    3: '신비한 망원경',
  },
  chello: {
    1: '마법의 현',
    2: '황금 활',
    3: '음악의 크리스탈',
  },
  millo: {
    1: '별빛 지팡이',
    2: '우주의 오브',
    3: '시간의 모래시계',
  },
} as const

export default function CollectionItemPopup({
  character,
  itemNumber,
  title,
  onClose,
  autoCloseDelay = 3000,
}: CollectionItemPopupProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isFading, setIsFading] = useState(false)

  const itemName = title || COLLECTION_ITEM_NAMES[character][itemNumber]

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose()
    }, autoCloseDelay)

    return () => clearTimeout(timer)
  }, [autoCloseDelay])

  const handleClose = () => {
    setIsFading(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose()
    }, 400) // 페이드 아웃 지속시간
  }

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  if (!isVisible) return null

  return (
    <PopupContainer $isFading={isFading} onClick={handleBackgroundClick}>
      <PopupContent onClick={(e) => e.stopPropagation()}>
        <BadgeImage
          src={IMAGES.common.collections.badge.enable[character][itemNumber]}
          alt={`${character} item ${itemNumber}`}
        />
        <ItemTitle>{itemName} 획득!</ItemTitle>
        <CloseButton onClick={handleClose}>
          <img src={IMAGES.common.button.closeQuizModal} alt="close" />
        </CloseButton>
      </PopupContent>
    </PopupContainer>
  )
}

const PopupContainer = styled.div<{ $isFading: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  background-image: url(${IMAGES.common.collections.resCollectItemBg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: ${({ $isFading }) => ($isFading ? 0 : 1)};
  transition: opacity 400ms ease-out;
  cursor: pointer;
`

const PopupContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  position: relative;
  cursor: default;
  animation: popup-entrance 0.6s ease-out;

  @keyframes popup-entrance {
    0% {
      transform: scale(0.8) translateY(20px);
      opacity: 0;
    }
    100% {
      transform: scale(1) translateY(0);
      opacity: 1;
    }
  }
`

const BadgeImage = styled.img`
  width: auto;
  height: 200px;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3));
  animation: gentle-bounce 2s ease-in-out infinite;

  @keyframes gentle-bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`

const ItemTitle = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  text-align: center;
  margin-top: 20px;
`

const CloseButton = styled.button`
  position: absolute;
  top: -60px;
  right: -60px;
  width: 60px;
  height: 60px;
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  img {
    width: 100%;
    height: 100%;
  }
`
