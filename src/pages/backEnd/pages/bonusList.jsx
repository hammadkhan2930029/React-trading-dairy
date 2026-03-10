import React from 'react'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout'
import BonusList from '../backEndComponents/bonusList/bonusList'

export const BonusIndex = () => {
    return (
        <div style={{overflow:'hidden'}}>
            <DrawerLayout>
                <BonusList/>
            </DrawerLayout>
        </div>
    )
}
