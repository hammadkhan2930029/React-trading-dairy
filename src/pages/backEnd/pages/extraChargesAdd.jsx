import React from 'react'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout'
import { ExtraChargesForm } from '../backEndComponents/extraChargesForm/extraChargesForm'

export const ExtraChargesAdd = () => {
  return (
    <div style={{overflow:'hidden'}}>
        <DrawerLayout>
            <ExtraChargesForm/>
        </DrawerLayout>
    </div>
  )
}
