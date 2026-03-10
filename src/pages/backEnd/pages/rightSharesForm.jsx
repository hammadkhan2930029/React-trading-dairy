import React from 'react'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout'
import { RightSharesAddForm } from '../backEndComponents/rightSharesAddForm/rightSharesAddForm'

export const RightSharesForm = () => {
    return (
        <div style={{overflow:'hidden'}}>
            <DrawerLayout>
                <RightSharesAddForm/>
            </DrawerLayout>
        </div>
    )
}
