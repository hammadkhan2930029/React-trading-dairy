import React from 'react'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout'
import { OneTime } from '../backEndComponents/extraChargesForm/oneTime/oneTime'

export const OneTimeCharges = () => {
  return (
    <div style={{overflow:'hidden'}}>
        <DrawerLayout>
            <OneTime/>
        </DrawerLayout>
    </div>
  )
}
