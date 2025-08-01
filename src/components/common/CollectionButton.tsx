import styled from 'styled-components'
import { Images } from '@utils/Assets'

// 컬렉션 버튼 컴포넌트
interface CollectionButtonProps {
  showCollections: boolean
  onToggle: () => void
}

export default function CollectionButton({
  showCollections,
  onToggle,
}: CollectionButtonProps) {
  return (
    <CollectionButtonWrapper onClick={onToggle}>
      <img
        src={Images.Common.Button.btnGoToCollections}
        alt="컬렉션으로 이동"
        style={{ width: '80px', height: 'auto' }}
      />
    </CollectionButtonWrapper>
  )
}

const CollectionButtonWrapper = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`
