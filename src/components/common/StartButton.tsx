import styled from 'styled-components'
import { Images } from '@utils/Assets'

interface StartButtonProps {
  onClick?: () => void
  className?: string
  size?: 'small' | 'medium' | 'large'
}

export default function StartButton({
  onClick,
  className,
  size = 'medium',
}: StartButtonProps) {
  return (
    <ButtonContainer onClick={onClick} className={className} size={size} />
  )
}

const ButtonContainer = styled.button<{ size: string }>`
  cursor: pointer;
  width: ${(props) => {
    switch (props.size) {
      case 'small':
        return '180px'
      case 'large':
        return '300px'
      default:
        return '240px'
    }
  }};
  height: ${(props) => {
    switch (props.size) {
      case 'small':
        return '60px'
      case 'large':
        return '100px'
      default:
        return '80px'
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease-in-out;
  background-image: url(${Images.Common.Button.btnStart});
  background-size: auto 100%;
  background-repeat: no-repeat;
  background-position: center;
  border: none;
  background-color: transparent;

  &:active {
    transform: scale(0.95);
  }

  &:hover {
    transform: scale(1.05);
  }
`
