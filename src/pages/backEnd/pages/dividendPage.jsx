import React from 'react'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout'
import { Dividend } from '../backEndComponents/Dividen/dividen'

export const DividendPage = () => {
  return (
    <div style={{overflow:'hidden'}}>
        <DrawerLayout>
            <Dividend/>
        </DrawerLayout>
    </div>
  )
}
