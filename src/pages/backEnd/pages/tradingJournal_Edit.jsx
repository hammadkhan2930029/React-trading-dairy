import React from 'react'
import { Edit_JournalForm } from '../backEndComponents/Trading_journal/Edit_journal_form/editJournalForm'
import DrawerLayout from '../backEndComponents/HomeComponents/drawerLayout'

export const TradingJournal_Edit = () => {
    return (
        <div style={{ overflow: 'hidden' }}>
            <DrawerLayout>

                <Edit_JournalForm />
            </DrawerLayout>
        </div>
    )
}
