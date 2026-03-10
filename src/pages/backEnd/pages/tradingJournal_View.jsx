import React from 'react'
import { TradeCard } from '../backEndComponents/Trading_journal/view/tradeCardView'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout'

export const TradingJournal_View = () => {
  return (
    <div style={{overflow:'hidden'}}>
        <DrawerLayout>


        <TradeCard/>
        </DrawerLayout>
    </div>
  )
}
