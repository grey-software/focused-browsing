import WebsiteController from '../website-controller'
import GoogleUtils from './google-utils'
export default class GoogleController extends WebsiteController {
  adIntervalId: number = 0
  adsContainerDisplayStyle: string = ''

  constructor() {
    super()
  }

  focus(): void {
    this.focusAds()
  }
  unfocus(): void {
    this.reset()
    this.showAds()
  }
  customFocus(): void {
    return
  }
  reset(): void {
    window.clearInterval(this.adIntervalId)
  }

  focusAds() {
    this.hideAds()
    if (this.adIntervalId) {
      window.clearInterval(this.adIntervalId)
    }
    // We set a longer timeout for ads to prevent the feed from infinitely loading new items
    this.adIntervalId = window.setInterval(() => {
      this.hideAds()
    }, 250)
  }

  hideAds() {
    if (GoogleUtils.isAdsContainerHidden()) {
      return
    }

    const adsContainer = GoogleUtils.getAdsContainer()
    if (adsContainer) {
      console.log('hiding ad success')
      this.adsContainerDisplayStyle = adsContainer.style.display
      adsContainer.style.display = 'none'
    }
  }

  showAds() {
    const adsContainer = GoogleUtils.getAdsContainer()
    if (adsContainer) {
      adsContainer.style.display = this.adsContainerDisplayStyle
    }
  }
}
