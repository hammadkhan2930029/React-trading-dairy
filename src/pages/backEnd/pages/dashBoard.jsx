import React from 'react'
import { DashboardView } from '../backEndComponents/dashboardView/dashboardView'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout'

export const DashBoard = () => {
    return (
        <div style={{overflow:'hidden'}}>
            <DrawerLayout>

                <DashboardView />
            </DrawerLayout>
        </div>
    )
}
