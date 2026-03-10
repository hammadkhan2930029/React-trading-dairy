import React from 'react'
import { JournalIndex } from '../backEndComponents/Trading_journal/index/journal_index'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout'

export const TradingJournalPage = () => {
  return (
    <div style={{overflow:'hidden'}}>
        <DrawerLayout>

        <JournalIndex/>
        </DrawerLayout>
    </div>
  )
}
