import React from 'react'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout'
import UserImports from '../backEndComponents/userImports/userImports'

export const ImportPage = () => {
    return (
        <div style={{overflow:'hidden'}}>
            <DrawerLayout>
                <UserImports/>
            </DrawerLayout>
        </div>
    )
}
