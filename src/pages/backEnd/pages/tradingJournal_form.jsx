import React from 'react'
import { JournalForm } from '../backEndComponents/Trading_journal/trading_journal_form/journalForm'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout'

export const TradingJournal_Form = () => {
    return (
        <div style={{ overflow: 'hidden' }}>
            <DrawerLayout>


                <JournalForm />
            </DrawerLayout>
        </div>
    )
}
