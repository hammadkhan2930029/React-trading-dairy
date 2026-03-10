import React from 'react'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout'
import ExtraChargesList from '../backEndComponents/extraChargesList/extraChargesList'

export const ExtraCharges = () => {
  return (
    <div style={{overflow:'hidden'}}>
        <DrawerLayout>
            <ExtraChargesList/>
        </DrawerLayout>
    </div>
  )
}
