// 비디오 설정 관리 (보안 강화)
export class VideoConfig {
  private static readonly VIDEO_URLS = {
    default:
      'https://moviebook.a1edu.com/newsystem/moviebook/dodoabc/ebpk301.mp4',
    // 추가 비디오 URL들을 여기에 추가할 수 있습니다
  }

  /**
   * 환경 변수에서 비디오 URL 가져오기
   * 환경 변수가 없으면 기본값 사용
   */
  static getVideoUrl(): string {
    // 환경 변수 우선 확인
    const envUrl = import.meta.env.VITE_VIDEO_URL
    if (envUrl) {
      return envUrl
    }

    // 기본 URL 반환
    return this.VIDEO_URLS.default
  }

  /**
   * Fetch를 사용하여 비디오를 Blob으로 로드하고 Blob URL 생성
   * 실제 URL을 숨기고 더 안전한 방식으로 비디오 제공
   */
  static async createBlobVideoUrl(): Promise<string> {
    try {
      const videoUrl = this.getVideoUrl()

      // Fetch를 사용하여 비디오 데이터 가져오기
      const response = await fetch(videoUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'video/mp4',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // 응답을 Blob으로 변환
      const blob = await response.blob()

      // Blob URL 생성
      const blobUrl = URL.createObjectURL(blob)

      console.log('Blob URL created successfully')
      return blobUrl
    } catch (error) {
      console.error('Failed to create blob URL:', error)
      // 실패 시 원본 URL 반환
      return this.getVideoUrl()
    }
  }

  /**
   * Blob URL 정리 (메모리 누수 방지)
   */
  static revokeBlobUrl(blobUrl: string): void {
    if (blobUrl.startsWith('blob:')) {
      URL.revokeObjectURL(blobUrl)
    }
  }

  /**
   * 비디오 URL 유효성 검사
   */
  static isValidVideoUrl(url: string): boolean {
    try {
      const urlObj = new URL(url)
      return urlObj.protocol === 'https:' || urlObj.protocol === 'http:'
    } catch {
      return false
    }
  }
}
