import React, { useEffect, useState } from 'react'

import LandingPage from '../component/frontPage.jsx';
import { Loader_f } from '../component/loader/loader.jsx';
import { DashBoard } from './pages/dashBoard.jsx';





export const Home = () => {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => {
      setLoading(false)

    }, 2000);

  }, [])
  return (
    <div>
      
      {/* {loading ? (

        <Loader_f />
      ) : (

        <DashBoard/>
      )} */}
      <LandingPage/>




    </div>
  )
}
