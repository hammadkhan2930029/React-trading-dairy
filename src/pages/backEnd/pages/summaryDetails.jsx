import React from 'react'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout'
import SummaryDetailsPage from '../backEndComponents/marketData/marketSummaryIndex/summaryDetails/summaryDetailsPage'

export const SummaryDetailsPg = () => {
  return (
    <div style={{overflow:'hidden'}}>
        <DrawerLayout>
            <SummaryDetailsPage/>
        </DrawerLayout>
    </div>
  )
}
