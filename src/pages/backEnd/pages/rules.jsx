import React from 'react'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout'
import { RuleForm } from '../backEndComponents/profile/Rules/rules'

export const Rules = () => {
  return (
    <div style={{overflow:'hidden'}}>
        <DrawerLayout>
            <RuleForm/>
        </DrawerLayout>
    </div>
  )
}
