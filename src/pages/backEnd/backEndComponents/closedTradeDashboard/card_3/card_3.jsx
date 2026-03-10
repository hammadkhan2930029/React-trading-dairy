import React, { useEffect } from 'react';
import './card_3.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHighestROIClosedTrade, fetchLowestROIClosedTrade } from '../../../Redux/tradeSummarySlice';

const Card_3 = () => {
    const dispatch = useDispatch();
    const highestROIClosedTrade = useSelector((state) => state.tradeSummary.highestROIClosedTrade || []);
    const lowestROIClosedTrade = useSelector((state) => state.tradeSummary.lowestROIClosedTrade || []);

    useEffect(() => {
        dispatch(fetchHighestROIClosedTrade());
        dispatch(fetchLowestROIClosedTrade());
    }, [dispatch]);

    const renderTable = (data) => (
        <table className="roi-table">
            <thead>
                <tr>
                    <th>Stock</th>
                    <th>Days</th>
                    <th>ROI (%)</th>
                    <th>Investment</th>
                </tr>
            </thead>
            <tbody>
                {data.length === 0 ? (
                    <tr>
                        <td colSpan="4" style={{ textAlign: 'center' }}>No Data Found</td>
                    </tr>
                ) : (
                    data.map((item, index) => (
                        <tr key={item.id || index}>
                            <td>{item.stock_symbol}</td>
                            <td>{item.holding_days}</td>
                            <td>{item.roi}</td>
                            <td>{item.total_investment}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );

    return (
        <div className="Larg_card_3_ct">
            <div className="L_card_3_data_ct">
                <h3>Highest ROI</h3>
                {renderTable(highestROIClosedTrade)}
            </div>

            <div className="L_card_3_data_ct">
                <h3>Lowest ROI</h3>
                {renderTable(lowestROIClosedTrade)}
            </div>
        </div>
    );
};

export default Card_3;
