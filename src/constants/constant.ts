const BASE_PATH_API = 'api/study/pre-k'

export const INFO_PATH = `${BASE_PATH_API}/info`
export const MOVIE_PATH = `${BASE_PATH_API}/movie-info`
export const QUIZ_PATH = `${BASE_PATH_API}/dodo-quiz`

// 애니메이션 및 타이밍 상수
export const TIMING = {
  MAIN_CONTAINER: {
    SCREEN_FADE: 400,
    SLIDE_TRANSITION: 500,
    FLOATING_DURATION: 3000,
  },
  SUB_VIEW: {
    FADE_IN_DELAY: 100,
    FADE_OUT_DURATION: 800,
    CORRECTION_DISPLAY: 1000,
    TRANSITION_DURATION: 500,
  },
  CORRECTION_MARK: {
    HIDE_DELAY: 1000,
    OPACITY_TRANSITION: 300,
    ANIMATION_DURATION: 600,
  },
  CARD_MATCHING: {
    SHOW_DURATION: 3000,
    FLIP_DELAY: 1000,
    MATCH_DELAY: 500,
    COMPLETE_DELAY: 3000,
  },
}

// 화면 및 레이아웃 상수
export const SCREEN_CONFIG = {
  BASE_WIDTH: 1280,
  BASE_HEIGHT: 720,
  STEP_COUNT: 6, // 0~5 (0은 영상, 1~5는 스텝)
}

// 타이밍 및 볼륨 상수
export const MOVIE_CONFIG = {
  TIMING: {
    FADE_OUT_DURATION: 500,
    AUTO_CLOSE_DELAY: 500,
  },
}

export const UI_POSITIONS = {
  CLOSE_BUTTON: {
    MOVIE: { top: 0, right: 0 },
    QUIZ: { top: 64, right: 82 },
  },
}
