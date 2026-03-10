import React from 'react'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout'
import { SplitAddForm } from '../backEndComponents/splitAddForm/splitAddForm'

export const SplitForm = () => {
    return (
        <div style={{overflow:'hidden'}}>
            <DrawerLayout>
                <SplitAddForm/>
            </DrawerLayout>
        </div>
    )
}
