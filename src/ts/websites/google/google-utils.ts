function getAdsContainer(): HTMLElement | null {
  return document.getElementById('tvcap')
}

function isAdsContainerHidden(): boolean {
  const adsContainer = getAdsContainer()
  return adsContainer ? adsContainer.style.display === 'none' : false
}

export default {
  getAdsContainer,
  isAdsContainerHidden,
}
