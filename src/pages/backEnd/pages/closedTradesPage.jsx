import React from 'react'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout';
import { ClosedTrades } from '../backEndComponents/closedTradesList/closedTradeslist';

export const ClosedTradesPage = () => {
  return (
    <div style={{overflow:'hidden'}}>
        <DrawerLayout>
            <ClosedTrades/>
            
        </DrawerLayout>
    </div>
  )
}
