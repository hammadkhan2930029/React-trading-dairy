import React from 'react'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout'
import { ProfilePage } from '../backEndComponents/profile/profile'


export const Profile = () => {
    return (
        <div style={{overflow:'hidden'}}>
            <DrawerLayout>
                <ProfilePage/>
            </DrawerLayout>
        </div>
    )
}
