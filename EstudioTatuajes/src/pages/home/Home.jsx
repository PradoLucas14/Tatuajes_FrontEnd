import React from 'react'
import Banner from './homeComponents/Banner'
import About from './homeComponents/About'
import Artist from './homeComponents/Artist'
import BannerGalery from './homeComponents/BannerGalery'
import Contact from './homeComponents/Contact'

function Home() {
  return (
    <div>
      <Banner/>
      <About/>
      <Artist/>
      <BannerGalery/>
      <Contact/>
    </div>
  )
}

export default Home
