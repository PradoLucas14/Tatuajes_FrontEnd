import React from 'react'
import Banner from './homeComponents/Banner'
import About from './homeComponents/About'
import Artist from './homeComponents/Artist'
import BannerGalery from './homeComponents/BannerGalery'
import Contact from './homeComponents/Contact'
import Login from '../login/Login'

function Home() {
  return (
    <div>
      <Banner/>
      <About/>
      <Artist/>
      <BannerGalery/>
      <Contact/>
      <Login/>
    </div>
  )
}

export default Home
