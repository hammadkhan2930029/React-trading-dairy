import React from 'react'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout'
import DividenList from '../backEndComponents/dividenList/dividenList'

export const DividendList = () => {
  return (
    <div style={{overflow:'hidden'}}>
        <DrawerLayout>
            <DividenList/>
        </DrawerLayout>
    </div>
  )
}
