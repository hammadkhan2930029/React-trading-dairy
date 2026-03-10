import React from 'react'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout'
import { BonusAddForm } from '../backEndComponents/BonusAddForm/bonusAddForm'

export const BonusForm = () => {
    return (
        <div style={{overflow:'hidden'}}>
            <DrawerLayout>
                <BonusAddForm/>
            </DrawerLayout>
        </div>
    )
}
