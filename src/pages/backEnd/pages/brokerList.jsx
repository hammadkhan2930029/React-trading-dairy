import React from 'react'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout'
import BrokerList from '../backEndComponents/brokerForm/brokerList/brokerList'

export const BrokerListPage = () => {
  return (
    <div style={{overflow:'hidden'}}>
        <DrawerLayout>
            <BrokerList/>

        </DrawerLayout>
    </div>
  )
}
