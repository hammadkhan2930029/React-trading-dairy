import React from 'react'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout'
import { EditeProfile } from '../backEndComponents/profile/editeProfile/editeProfile'

export const Editprofile = () => {
  return (
    <div style={{overflow:'hidden'}}>
        <DrawerLayout>
            <EditeProfile/>
        </DrawerLayout>
    </div>
  )
}
