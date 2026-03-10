import React from 'react'
import { ClosedTradeDashboard } from '../backEndComponents/closedTradeDashboard/closedTradeDashboard'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout'

export const ClosedTradeDashboardView = () => {
    return (
        <div style={{overflow:'hidden'}}>
            <DrawerLayout>
                <ClosedTradeDashboard />
            </DrawerLayout>
        </div>
    )
}
