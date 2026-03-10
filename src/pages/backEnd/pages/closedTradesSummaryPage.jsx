import React from 'react'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout';
import { ClosedTradesSummary } from '../backEndComponents/closedTradesSummary/closedTradesSummary';

export const ClosedTradesSummaryPage = () => {
  return (
    <div style={{overflow:'hidden'}}>
        <DrawerLayout>
            <ClosedTradesSummary/>
            
        </DrawerLayout>
    </div>
  )
}
