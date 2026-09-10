const imagePromises = new Map()

// Detect connection speed on page load
const getConnectionType = () => {
  if (typeof navigator !== 'undefined' && navigator.connection) {
    const { effectiveType } = navigator.connection
    return effectiveType // '4g', '3g', '2g', 'slow-2g'
  }
  return '4g' // Default to fast
}

export function preloadImage(url, priority = 'low') {
  if (!url || imagePromises.has(url)) return imagePromises.get(url) || Promise.resolve()

  const promise = new Promise((resolve) => {
    const image = new Image()
    image.onload = resolve
    image.onerror = resolve
    
    // Set loading priority for faster images
    if (priority === 'high') {
      image.fetchPriority = 'high'
    }
    
    image.src = url
  })

  imagePromises.set(url, promise)
  return promise
}

export function preloadImages(urls, priority = 'low') {
  return Promise.allSettled([...new Set(urls.filter(Boolean))].map(url => preloadImage(url, priority)))
}

// Clear cache on demand (useful for memory management on mobile)
export function clearImageCache() {
  imagePromises.clear()
}
