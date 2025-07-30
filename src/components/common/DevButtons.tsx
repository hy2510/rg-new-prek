import React from 'react'
import { SoundManager, ThemeType, ThemeNumber } from '@utils/SoundManager'
import { ImageManager } from '@utils/ImageManager'

type StudyType =
  | 'alphabet_1'
  | 'alphabet_2'
  | 'phonics1_1'
  | 'phonics1_2'
  | 'phonics2_1'
  | 'phonics2_2'
  | 'sightWords1_1'
  | 'sightWords1_2'
  | 'sightWords2_1'
  | 'sightWords2_2'

interface DevButtonsProps {
  setTheme: (theme: ThemeType) => void
  setThemeNumber: (themeNumber: ThemeNumber) => void
  setStudyType: (studyType: StudyType) => void
}

export default function DevButtons({
  setTheme,
  setThemeNumber,
  setStudyType,
}: DevButtonsProps) {
  // 안전한 테마 변경 핸들러 (프리로딩 포함)
  const handleThemeChange = (newTheme: ThemeType) => {
    setTheme(newTheme)

    // 새 테마가 프리로드되지 않았다면 백그라운드에서 프리로드
    // 현재 테마 번호는 1로 가정 (가장 많이 사용되는 기본값)
    if (!ImageManager.isThemePreloaded(newTheme, 1)) {
      ImageManager.preloadThemeImages(newTheme, 1)
        .then(() => {
          console.log(`테마 ${newTheme}-1 프리로딩 완료 (DevButtons)`)
        })
        .catch((error) => {
          console.warn(`테마 ${newTheme}-1 프리로딩 오류:`, error)
        })
    }
  }

  const handleThemeNumberChange = (newThemeNumber: ThemeNumber) => {
    setThemeNumber(newThemeNumber)

    // 새 테마 번호가 프리로드되지 않았다면 백그라운드에서 프리로드
    // 현재 테마는 baro로 가정 (기본값)
    if (!ImageManager.isThemePreloaded('baro', newThemeNumber)) {
      ImageManager.preloadThemeImages('baro', newThemeNumber)
        .then(() => {
          console.log(`테마 baro-${newThemeNumber} 프리로딩 완료 (DevButtons)`)
        })
        .catch((error) => {
          console.warn(`테마 baro-${newThemeNumber} 프리로딩 오류:`, error)
        })
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div>
        <button onClick={() => SoundManager.toggleBackgroundMusic()}>
          {SoundManager.isBackgroundMusicPlaying()
            ? '배경음 정지'
            : '배경음 재생'}
        </button>
      </div>
      <div>
        <button onClick={() => handleThemeChange('baro')}>baro</button>
        <button onClick={() => handleThemeChange('chello')}>chello</button>
        <button onClick={() => handleThemeChange('millo')}>millo</button>
      </div>
      <div>
        <button onClick={() => handleThemeNumberChange(1)}>테마 1</button>
        <button onClick={() => handleThemeNumberChange(2)}>테마 2</button>
        <button onClick={() => handleThemeNumberChange(3)}>테마 3</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={() => setStudyType('alphabet_1')}>alphabet_1</button>
        <button onClick={() => setStudyType('alphabet_2')}>alphabet_2</button>
        <button onClick={() => setStudyType('phonics1_1')}>phonics1_1</button>
        <button onClick={() => setStudyType('phonics1_2')}>phonics1_2</button>
        <button onClick={() => setStudyType('phonics2_1')}>phonics2_1</button>
        <button onClick={() => setStudyType('phonics2_2')}>phonics2_2</button>
        <button onClick={() => setStudyType('sightWords1_1')}>
          sightWords1_1
        </button>
        <button onClick={() => setStudyType('sightWords1_2')}>
          sightWords1_2
        </button>
        <button onClick={() => setStudyType('sightWords2_1')}>
          sightWords2_1
        </button>
        <button onClick={() => setStudyType('sightWords2_2')}>
          sightWords2_2
        </button>
      </div>
    </div>
  )
}
