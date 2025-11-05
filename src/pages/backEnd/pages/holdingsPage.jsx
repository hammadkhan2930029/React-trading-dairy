import React from 'react'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout'
import { Holdings } from '../backEndComponents/holdings/holdings'
export const HoldingsPage = () => {
  return (
    <div style={{overflow:'hidden'}}>
        <DrawerLayout>
            <Holdings/>
            
        </DrawerLayout>
    </div>
  )
}
