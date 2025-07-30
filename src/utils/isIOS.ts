export function isIOS(): boolean {
  // 브라우저 환경이 아닌 경우 false 반환
  if (typeof window === 'undefined') {
    return false
  }

  // 기본적인 iOS 기기 체크 (iPhone, iPod, 구형 iPad)
  const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent)

  // 최신 iPad 감지 (iPadOS 13+에서는 데스크톱 Safari userAgent 사용)
  const isIPadOS =
    navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1

  // MSStream은 Internet Explorer 체크용
  const isNotIE = typeof (window as any).MSStream === 'undefined'

  return (isIOSDevice || isIPadOS) && isNotIE
}
