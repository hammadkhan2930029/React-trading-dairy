import React from 'react'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout'
import RightSharesIndex from '../backEndComponents/rightSharesIndex/rightSharesIndex'

export const RightSharesList = () => {
    return (
        <div style={{overflow:'hidden'}}>
            <DrawerLayout>
                <RightSharesIndex/>
            </DrawerLayout>
        </div>
    )
}
