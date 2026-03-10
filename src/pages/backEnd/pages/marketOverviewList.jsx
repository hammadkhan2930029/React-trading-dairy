import React from 'react'
import { OverviewIndex } from '../backEndComponents/marketData/marketOverviewList/overviewIndex'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout'

export const MarketOverviewList = () => {
    return (
        <div style={{overflow:'hidden'}}>
            <DrawerLayout>
                <OverviewIndex />
            </DrawerLayout>
        </div>
    )
}
