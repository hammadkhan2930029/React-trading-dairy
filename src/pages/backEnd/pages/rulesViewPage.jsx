import React from 'react'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout'
import { RulesView } from '../backEndComponents/RulesView/rulesView'

export const RulesViewPage = () => {
  return (
    <div style={{overflow:'hidden'}}>
        <DrawerLayout>
            <RulesView/>
        
        </DrawerLayout>
    </div>
  )
}
