import React from 'react'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout';
import BrokerForm from '../backEndComponents/brokerForm/brokerForm';

export const Broker = () => {
  return (
    <div style={{overflow:'hidden'}}>
    <DrawerLayout>
        <BrokerForm/>
    </DrawerLayout>
    
    </div>
  )
}
