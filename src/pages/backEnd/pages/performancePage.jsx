import React from 'react'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout'
import {PerformanceDashboard} from '../backEndComponents/performanceDashboard/performanceDashboard'

export const PerformancePage = () => {
  return (
    <div style={{overflow:'hidden'}}>
        <DrawerLayout>
            <PerformanceDashboard/>
        </DrawerLayout>
    </div>
  )
}
