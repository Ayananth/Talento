import React from 'react'
import SearchBox from './components/SearchBox'
import { Navbar } from '../../auth/components/Navbar'


const Homepage = () => {
    console.log("home page is called")
  return (
    <div>
        <Navbar/>
      <div className='mt-10'>
        <SearchBox />
      </div>
    </div>
  )
}

export default Homepage
