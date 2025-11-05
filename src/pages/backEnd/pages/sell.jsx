import React from 'react'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout'
import { SellForm } from '../backEndComponents/sellForm/sellForm'

export const Sell = () => {
    return (
        <div style={{overflow:'hidden'}}>
            <DrawerLayout>
                <SellForm />
            </DrawerLayout>
        </div>
    )
}
