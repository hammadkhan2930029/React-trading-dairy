import React from 'react'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout'
import {Withdrawal} from '../backEndComponents/withdrawal/withdrawal'

export const WithdrawalPage = () => {
    return (
        <div style={{overflow:'hidden'}}>
            <DrawerLayout>
                <Withdrawal/>
            </DrawerLayout>
        </div>
    )
}
