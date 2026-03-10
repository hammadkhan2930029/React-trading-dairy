import React from 'react'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout'
import { Summary } from '../backEndComponents/marketData/marketSummary/summary'

export const MarketSummary = () => {
  return (
    <div style={{overflow:'hidden'}}>
        <DrawerLayout>
            <Summary/>
        </DrawerLayout>
    </div>
  )
}
