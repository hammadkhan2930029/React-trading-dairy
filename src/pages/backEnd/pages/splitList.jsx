import React from 'react'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout'
import SplitIndex from '../backEndComponents/splitIndex/splitIndex'

export const SplitList = () => {
    return (
        <div style={{overflow:'hidden'}}>
            <DrawerLayout>
                <SplitIndex/>
            </DrawerLayout>
        </div>
    )
}
