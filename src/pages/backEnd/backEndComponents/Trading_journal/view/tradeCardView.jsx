import React, { useEffect, useState, useMemo } from 'react';
import './tradeCardView.css';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { useDispatch, useSelector } from 'react-redux';
import {
    setJournal_from,
    selectCurrentJournalEntry, // This selects the single journal entry to display
    getTradingJournalById, // Import the thunk to fetch a single journal entry
} from '../../../Redux/tradingJournalSlice';
import { selectAllStocks, fetchStocks } from "../../../Redux/stockSlice"; // Import stock actions/selectors
import { useNavigate } from 'react-router-dom';

export const TradeCard = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();

    // Select the current journal entry that was fetched by getTradingJournalById
    const journal = useSelector(selectCurrentJournalEntry);

    // Select the selectedJournalId from Redux state. This ID tells TradeCard which journal to display.
    const selectedJournalId = useSelector(state => state.tradingJournal.selectJournalById);

    // Select loading state to provide feedback to the user
    const loading = useSelector(state => state.tradingJournal.loading);
    const error = useSelector(state => state.tradingJournal.error);

    // Fetch the journal data when selectedJournalId changes.
    // This is crucial for TradeCard to display the correct entry.
    useEffect(() => {
        if (selectedJournalId) {
            console.log("Dispatching journal fetch for ID:", selectedJournalId);
            dispatch(getTradingJournalById(selectedJournalId));
        } else {
            console.warn("No selectedJournalId");
        }
    }, [dispatch, selectedJournalId]);
    // Fetch all stocks (if not already fetched globally)
    useEffect(() => {
        dispatch(fetchStocks());
    }, [dispatch]);

    const allStocks = useSelector(selectAllStocks);

    const stockIdToNameMap = useMemo(() => {
        const map = {};
        allStocks.forEach(stock => {
            map[stock.id] = stock.name;
        });
        return map;
    }, [allStocks]);

    const getStockName = (stockId) => {
        // Assuming journal.stock might be an ID. Adjust if it's already the stock name.
        return stockIdToNameMap[stockId] || `ID: ${stockId} (Unknown)`;
    };

    // --- Conditional Rendering for Loading, Error, and No Data ---
    if (loading === 'pending' && !journal) {
        return <div className="loading-state">Loading journal entry...</div>;
    }

    if (error) {
        return <div className="error-state">Error: {error}</div>;
    }

    if (!journal) {
        // This handles cases where no journal is selected or if the fetch resulted in no data
        return <div className="no-data-state">No journal entry selected or found.</div>;
    }

    // --- Render the Trade Card with dynamic data ---
    return (
        <div className="trade-card-table_main">
            <div className='back_btn' onClick={() => navigate(-1)}>
                <NavigateBeforeIcon />
                <span>Back</span>
            </div>

            <div className="trade-card-table">
                <table className='trdingCard_table'>
                    <thead className='t_head'>
                        <tr>
                            <th>Label</th>
                            <th>Value</th>
                            <th> </th>
                        </tr>
                    </thead>
                    <tbody className='t_body'>
                        <tr>
                            <td>Scrip :</td>
                            {/* Assuming journal.stock holds the stock ID */}
                            <td>{getStockName(journal.stock)}</td>
                            <td ></td>
                        </tr>
                        <tr>
                            <td>Date :</td>
                            <td>{journal.entry_date || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td>Market Conditions :</td>
                            <td>{journal.market_conditions || 'N/A'}</td>
                           
                        </tr>
                        <tr>
                            <td className="red-text">Entry Reasons :</td>
                            <td>{journal.entry_reasons || 'N/A'}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td className="blue-text">Source of Trade :</td>
                            {/* Ensure 'source_of_trade' matches your API response property */}
                            <td>{journal.source_of_trade || 'N/A'}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Trade Type :</td>
                            <td>{journal.trade_type || "N/A"}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Entry Price :</td>
                            <td>{journal.entry_price || 'N/A'}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>No of Shares :</td>
                            <td>{journal.no_of_shares || 'N/A'}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Average Price :</td>
                            <td>{journal.average_price || 'N/A'}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Total Investment</td>
                             <td>
                                Total {journal.no_of_shares || 0} Shares @ {journal.average_price || 0} =
                                <span className="red">
                                    {(journal.no_of_shares * journal.average_price || 0).toLocaleString()}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td>Exit :</td>
                            <td>Date: {journal.exit_date || 'N/A'} | Price: {journal.exit_price || 'N/A'}</td>
                            <td>
                                Sold @ {journal.exit_price || 0} =
                                <span className="green">
                                    {(journal.no_of_shares * journal.exit_price || 0).toLocaleString()}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td>Profit / Loss :</td>
                            <td>
                                <span className={journal.profit_loss !== undefined && journal.profit_loss >= 0 ? "profit" : "loss"}>
                                    {journal.profit_loss !== undefined ? journal.profit_loss : 'N/A'} ({journal.profit_loss !== undefined ? (journal.profit_loss >= 0 ? "Profit" : "Loss") : ''})
                                </span>
                            </td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Total Duration :</td>
                            <td>{journal.total_duration || 'N/A'} days</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Scrip Behaviour :</td>
                            <td>{journal.scrip_behaviour || 'N/A'}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td className="red-text">Reasons for Exit :</td>
                            {/* Ensure 'reason_of_exit' matches your API response property */}
                            <td>{journal.reasons_of_exit || 'N/A'}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td className="blue-text">Lesson Learnt :</td>
                            <td>{journal.lesson_learnt || 'N/A'}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>IF ? :</td>
                            {/* Ensure 'iff' matches your API response property (e.g., if or iff) */}
                            <td>{journal.iff || 'N/A'}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Status</td>
                            <td>{journal.status || 'N/A'}</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};