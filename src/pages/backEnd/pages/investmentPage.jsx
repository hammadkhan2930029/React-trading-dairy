import React from 'react'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout'
import {Investment} from '../backEndComponents/investment/investment'

export const InvestmentPage = () => {
    return (
        <div style={{overflow:'hidden'}}>
            <DrawerLayout>
                <Investment/>
            </DrawerLayout>
        </div>
    )
}
