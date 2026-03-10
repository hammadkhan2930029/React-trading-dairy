import React from 'react'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout'
import { Monthly } from '../backEndComponents/extraChargesForm/monthly/monthly'

export const MonthlyCharges = () => {
  return (
    <div style={{overflow:'hidden'}}>
        <DrawerLayout>
            <Monthly/>
        </DrawerLayout>
    </div>
  )
}
