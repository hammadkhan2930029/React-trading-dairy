import React from 'react'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout';
import { DevelopersComponent } from '../backEndComponents/developer/developer';

export const DevelopersPage = () => {
  return (
    <div style={{overflow:'hidden'}}>
        <DrawerLayout>
            <DevelopersComponent/>
            
        </DrawerLayout>
    </div>
  )
}
