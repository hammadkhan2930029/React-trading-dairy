import React from 'react';
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout';
import { BuyForm } from '../backEndComponents/buyForm/buyForm';


export const Buy = () => {
  return (
    <div style={{overflow:'hidden'}}>
        <DrawerLayout >
            <BuyForm/>
        </DrawerLayout>
    </div>
  )
}
