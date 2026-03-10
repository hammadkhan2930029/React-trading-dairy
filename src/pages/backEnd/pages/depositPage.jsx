import React from 'react'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout'
import {Deposit} from '../backEndComponents/deposit/deposit'

export const DepositPage = () => {
    return (
        <div style={{overflow:'hidden'}}>
            <DrawerLayout>
                <Deposit/>
            </DrawerLayout>
        </div>
  )
}
