import React, { Suspense, useEffect } from 'react'
import AppContextProvider from '@contexts/AppContext'

import '@stylesheets/App.scss'

// import * as Assets from '@utils/Assets'

// const preloadImages = () => {
//   const imageUrls = Object.values(Assets)

//   imageUrls.forEach((url) => {
//     const img = new Image()
//     img.src = url
//   })
// }

const MainContainer = React.lazy(
  () => import('@pages/containers/MainContainer'),
)

export default function App() {
  // useEffect(() => {
  //   preloadImages()
  // }, [])

  return (
    <AppContextProvider>
      <Suspense fallback={''}>
        <MainContainer />
      </Suspense>
    </AppContextProvider>
  )
}
