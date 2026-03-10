import React from 'react'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout'
import SummaryIndex from '../backEndComponents/marketData/marketSummaryIndex/summaryIndex'

export const MarketSummaryList = () => {
  return (
    <div style={{overflow:'hidden'}}>
        <DrawerLayout>
            <SummaryIndex/>
        </DrawerLayout>
    </div>
  )
}
