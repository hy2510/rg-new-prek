import styled from 'styled-components'
import { Images } from '@utils/Assets'

import { ThemeType } from '@interfaces/IThemeType'

interface CollectionsShowcaseProps {
  onClose: () => void
}

export function CollectionsShowcase({ onClose }: CollectionsShowcaseProps) {
  return (
    <CollectionsShowcaseContainer>
      <div className="header">
        <div className="title">My Collections</div>
        <div className="close-button" onClick={onClose}>
          <img src={Images.Common.Button.btnCloseQuizModal} alt="close" />
        </div>
      </div>

      <div className="collection-boxes-container">
        <CollectionBox character="Baro" />
        <CollectionBox character="Chello" />
        <CollectionBox character="Millo" />
      </div>
    </CollectionsShowcaseContainer>
  )
}

interface CollectionBoxProps {
  character?: ThemeType
  text?: string
  className?: string
}

export function CollectionBox({
  character = 'Baro',
  className,
}: CollectionBoxProps) {
  const characterImage = Images.Common.Collections[`labelCharacter${character}`]

  // 현재 학습 예시
  const currentStudy = 'eb_pk_309'

  // 콜렉션 프로그레스 체크 예시.. (수정 필요)
  const passingRequirement = {
    baro: {
      [1]: { eb_pk_301: 'pass', eb_pk_302: 'pass', eb_pk_303: 'pass' },
      [2]: { eb_pk_304: 'pass', eb_pk_305: 'pass', eb_pk_306: 'pass' },
      [3]: { eb_pk_307: 'pass', eb_pk_308: 'pass', eb_pk_309: 'not yet' },
    },
    chello: {
      [1]: { eb_pk_310: 'not yet', eb_pk_311: 'not yet', eb_pk_312: 'not yet' },
      [2]: { eb_pk_313: 'not yet', eb_pk_314: 'not yet', eb_pk_315: 'not yet' },
      [3]: { eb_pk_316: 'not yet', eb_pk_317: 'not yet', eb_pk_318: 'not yet' },
    },
    millo: {
      [1]: { eb_pk_319: 'not yet', eb_pk_320: 'not yet', eb_pk_321: 'not yet' },
      [2]: { eb_pk_322: 'not yet', eb_pk_323: 'not yet', eb_pk_324: 'not yet' },
      [3]: { eb_pk_325: 'not yet', eb_pk_326: 'not yet', eb_pk_327: 'not yet' },
    },
  }

  return (
    <CollectionsContainer>
      <LabelContainer className={className}>
        <CharacterImage style={{ backgroundImage: `url(${characterImage})` }} />
        <RibbonText>{character.toUpperCase()}</RibbonText>
      </LabelContainer>
      <ItemsContainer>
        {Object.keys(
          passingRequirement[
            character.toLowerCase() as keyof typeof passingRequirement
          ],
        ).map((itemKey) => {
          const itemIndex = parseInt(itemKey) as 1 | 2 | 3
          const requirement = (passingRequirement as any)[
            character.toLowerCase()
          ][itemIndex]
          const passedCount = Object.values(requirement).filter(
            (value) => value === 'pass',
          ).length
          const totalCount = Object.keys(requirement).length
          const isCompleted = Object.values(requirement).every(
            (value) => value === 'pass',
          )
          const progressPercentage = Math.round(
            (passedCount / totalCount) * 100,
          )

          return (
            <ItemBox
              key={itemIndex}
              className={
                Object.keys(requirement).includes(currentStudy) ? 'current' : ''
              }
            >
              {isCompleted && <div className="pedestal-light"></div>}
              <div className="collection-item">
                {isCompleted ? (
                  <img
                    src={
                      (Images.Common.Collections as any)[
                        `badgeEnable${character}${itemIndex}`
                      ]
                    }
                    alt={character}
                  />
                ) : (
                  <img
                    src={
                      (Images.Common.Collections as any)[
                        `badgeDisable${character}${itemIndex}`
                      ]
                    }
                    alt={character}
                  />
                )}
              </div>
              <div className="pedestal"></div>

              {!isCompleted && (
                <div className="progress-bar">
                  <div
                    className="progress-bar-inner"
                    style={{ width: `${progressPercentage}%` }}
                  >
                    <div className="text">
                      {passedCount}/{totalCount}
                    </div>
                  </div>
                </div>
              )}
            </ItemBox>
          )
        })}
      </ItemsContainer>
    </CollectionsContainer>
  )
}

const CollectionsShowcaseContainer = styled.div`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  background-color: #544122;
  z-index: 9999;
  overflow-y: auto;
  overflow-x: hidden;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    width: calc(100% - 40px);
    height: 80px;

    .title {
      font-size: 24px;
      font-weight: bold;
      color: #fff;
    }

    .close-button {
      cursor: pointer;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .collection-boxes-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 60px 20px;
    padding: 40px 20px;
    width: calc(100% - 40px);
    overflow-y: auto;
  }
`

const CollectionsContainer = styled.div`
  width: 600px;
  height: 228px;
  background-image: url(${Images.Common.Collections.collectionShowcase});
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
`

const LabelContainer = styled.div`
  position: absolute;
  top: -40px;
  left: -10px;
  width: 96px;
  height: 94px;
  z-index: 3;
`

const ItemsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  height: 100%;
`

const ItemBox = styled.div`
  width: 120px;
  height: 120px;
  position: relative;

  &.current {
    animation: heartbeat 2s ease-in-out infinite;
  }

  @keyframes heartbeat {
    from {
      -webkit-transform: scale(1);
      transform: scale(1);
      -webkit-transform-origin: center center;
      transform-origin: center center;
      -webkit-animation-timing-function: ease-out;
      animation-timing-function: ease-out;
    }
    10% {
      -webkit-transform: scale(0.91);
      transform: scale(0.91);
      -webkit-animation-timing-function: ease-in;
      animation-timing-function: ease-in;
    }
    17% {
      -webkit-transform: scale(0.98);
      transform: scale(0.98);
      -webkit-animation-timing-function: ease-out;
      animation-timing-function: ease-out;
    }
    33% {
      -webkit-transform: scale(0.87);
      transform: scale(0.87);
      -webkit-animation-timing-function: ease-in;
      animation-timing-function: ease-in;
    }
    45% {
      -webkit-transform: scale(1);
      transform: scale(1);
      -webkit-animation-timing-function: ease-out;
      animation-timing-function: ease-out;
    }
  }

  .pedestal-light {
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 80px;
    background-image: url(${Images.Common.Collections.collectionPedestalLight});
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
    z-index: 1;
  }

  .collection-item {
    position: absolute;
    left: 50%;
    bottom: 25px;
    transform: translateX(-50%);
    width: 100px;
    height: 100px;
    z-index: 2;

    img {
      width: 100%;
    }
  }

  .progress-bar {
    position: absolute;
    bottom: 12px;
    left: 0;
    width: calc(100% - 4px);
    height: 10px;
    border-radius: 100px;
    overflow: hidden;
    background-color: #fff;
    border: 2px solid #543115;
    background: linear-gradient(180deg, #38200d 0%, #543115 100%);
    z-index: 3;

    .progress-bar-inner {
      height: 100%;
      color: #fff;
      border-radius: 20px;
      background: linear-gradient(180deg, #d24031 45%, #8e0d00 100%);
      text-align: center;

      .text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 0.5em;
      }
    }
  }

  .pedestal {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 44px;
    background-image: url(${Images.Common.Collections.collectionPedestal});
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
    z-index: 1;
  }
`

const CharacterImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 96px;
  height: 94px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  z-index: 2;
`

const RibbonText = styled.div`
  position: absolute;
  top: calc(50% - 30px);
  left: 0;
  width: 200px;
  height: 60px;
  padding-left: 110px;
  font-size: 1em;
  font-weight: 600;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: start;
  background-image: url(${Images.Common.Collections.labelRibbon});
  background-size: auto 60px;
  background-repeat: no-repeat;
  background-position: center right;
  z-index: 1;
`
