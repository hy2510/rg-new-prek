import { useState } from 'react'

import { IStep } from '@interfaces/IStep'
import MainView from '@pages/MainView'
import SubViewContainer from './SubViewContainer'

export default function MainContainer() {
  const [mainView, setMainView] = useState<IStep>('intro')
  const [isShowStudyModule, setIsShowStudyModule] = useState(false)

  const handleStartStudy = () => {
    setIsShowStudyModule(true)
  }

  const handleCloseStudyModal = () => {
    setIsShowStudyModule(false)
  }

  return (
    <>
      {/* 메인 뷰 페이지 - 인트로, 스텝, 리워드 등 */}
      <MainView />

      <button
        style={{
          position: 'absolute',
          top: '170px',
          right: '210px',
          width: '300px',
          height: '330px',
        }}
        onClick={handleStartStudy}
      >
        시작
      </button>

      {/* 서브 뷰 페이지 - 스텝에 따른 모달로 띄워지는 학습 */}
      {isShowStudyModule && (
        <SubViewContainer
          studyModule={'AiSpeakPractice'}
          handleCloseStudyModal={handleCloseStudyModal}
        />
      )}
    </>
  )
}
