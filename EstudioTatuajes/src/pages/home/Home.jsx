import React from 'react'
import Banner from './homeComponents/Banner'
import About from './homeComponents/About'
import Artist from './homeComponents/Artist'
import BannerGalery from './homeComponents/BannerGalery'

function Home() {
  return (
    <div>
      <Banner/>
      <About/>
      <Artist/>
      <BannerGalery/>
    </div>
  )
}

export default Home
