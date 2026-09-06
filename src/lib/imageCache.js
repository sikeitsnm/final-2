const imagePromises = new Map()

export function preloadImage(url) {
  if (!url || imagePromises.has(url)) return imagePromises.get(url) || Promise.resolve()

  const promise = new Promise((resolve) => {
    const image = new Image()
    image.onload = resolve
    image.onerror = resolve
    image.src = url
  })

  imagePromises.set(url, promise)
  return promise
}

export function preloadImages(urls) {
  return Promise.allSettled([...new Set(urls.filter(Boolean))].map(preloadImage))
}
