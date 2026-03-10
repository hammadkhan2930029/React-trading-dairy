import React from 'react'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout'
import { OverView } from '../backEndComponents/marketData/marketOverview/overview'

export const MarketOverView = () => {
  return (
    <div style={{overflow:'hidden'}}>
        <DrawerLayout>
            <OverView/>
        </DrawerLayout>
    </div>
  )
}
