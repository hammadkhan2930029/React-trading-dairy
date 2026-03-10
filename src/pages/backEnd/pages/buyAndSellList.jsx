import React from 'react'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout';
import CrudOperation from '../backEndComponents/CrudSystem/crudOperation';

export const BuyAndSellList = () => {
  return (
    <div style={{overflow:'hidden'}}>
        <DrawerLayout>
            <CrudOperation/>
        </DrawerLayout>
    </div>
  )
}
