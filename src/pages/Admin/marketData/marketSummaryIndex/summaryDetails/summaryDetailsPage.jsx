import React, { useEffect, useState } from 'react';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import './summaryDetailsPage.css';
import { motion, useInView } from "framer-motion";
import { TablePagination } from '@mui/material';
import { useDispatch } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search';
import { resetSummary, setBackToSummary } from '../../../Redux/summarySlice';


const marketSummaryData = [
    {
        scrip: "Cogent dev software solution",
        ldcp: "100.50",
        open: "98.00",
        high: "102.00",
        low: "97.50",
        current: "100.00",
        change: "+2.00",
        volume: "15000",
        date: "2025-03-22"
    },
    {
        scrip: "XYZ",
        ldcp: "200.75",
        open: "195.50",
        high: "205.00",
        low: "194.00",
        current: "198.25",
        change: "-2.50",
        volume: "25000",
        date: "2025-03-21"
    },
    {
        scrip: "LMN",
        ldcp: "300.30",
        open: "290.00",
        high: "310.00",
        low: "285.00",
        current: "295.50",
        change: "+5.50",
        volume: "18000",
        date: "2025-03-20"
    },
    {
        scrip: "Cogent dev software solution",
        ldcp: "100.50",
        open: "98.00",
        high: "102.00",
        low: "97.50",
        current: "100.00",
        change: "+2.00",
        volume: "15000",
        date: "2025-03-22"
    },
    {
        scrip: "XYZ",
        ldcp: "200.75",
        open: "195.50",
        high: "205.00",
        low: "194.00",
        current: "198.25",
        change: "-2.50",
        volume: "25000",
        date: "2025-03-21"
    },
    {
        scrip: "LMN",
        ldcp: "300.30",
        open: "290.00",
        high: "310.00",
        low: "285.00",
        current: "295.50",
        change: "+5.50",
        volume: "18000",
        date: "2025-03-20"
    },
    {
        scrip: "Cogent dev software solution",
        ldcp: "100.50",
        open: "98.00",
        high: "102.00",
        low: "97.50",
        current: "100.00",
        change: "+2.00",
        volume: "15000",
        date: "2025-03-22"
    },
    {
        scrip: "XYZ",
        ldcp: "200.75",
        open: "195.50",
        high: "205.00",
        low: "194.00",
        current: "198.25",
        change: "-2.50",
        volume: "25000",
        date: "2025-03-21"
    },
    {
        scrip: "Cogent dev software solution Cogent dev software solution",
        ldcp: "300.30",
        open: "290.00",
        high: "310.00",
        low: "285.00",
        current: "295.50",
        change: "+5.50",
        volume: "18000",
        date: "2025-03-20"
    }
];


export const SummaryDetailPage = () => {
    const dispatch = useDispatch();
    const [page, setpage] = useState(0)
    const [rowPerPage, setRowperPage] = useState(5)
    const handleChangePage = (event, newPage) => {
        setpage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowperPage(parseInt(event.target.value, 10));
        setpage(0);
    };
    // -----------------------------------------
    const refOne = React.useRef(null);

    const inViewOne = useInView(refOne, { triggerOnce: true });
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    return (
        <div className='summary_details_page_main'>
            
            <button className='backBtn' onClick={() => {
                    dispatch(setBackToSummary())
                }}>
                    Back
                </button>

            <motion.div className='summary_details_page'
                ref={refOne}
                initial={{ opacity: 0, y: -100 }}
                animate={inViewOne ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: .8 }}>
                    
                <div className='overview_heading_index_div'>
                    <ShowChartIcon className='chart_icon' />
                    <span className='overview_heading'>Market Summary Details</span>
                </div>
                <div className='search_main'>
                    <div className="search_div">

                        <input placeholder="Search ...." className="search_input" />
                        <SearchIcon />
                    </div>
                </div>

                
                <div className="market_table_container_summary">
                    <table className='market_table'>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>SCRIP</th>
                                <th>LDCP</th>
                                <th>HIGH</th>
                                <th>LOW</th>
                                <th>CURRENT</th>
                                <th>CHANGE</th>
                                <th>VOLUME</th>



                            </tr>
                        </thead>
                        <tbody>
                            {marketSummaryData.slice(page * rowPerPage, (page + 1) * rowPerPage).map((item, index) => (
                                <tr key={index}>
                                    <td>{item.date}</td>
                                    <td>{item.scrip}</td>
                                    <td>{item.ldcp}</td>
                                    <td>{item.high}</td>
                                    <td>{item.low}</td>
                                    <td>{item.current}</td>
                                    <td>{item.change}</td>
                                    <td>{item.volume}</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <TablePagination
                        component="div"
                        count={marketSummaryData.length}
                        page={page}
                        rowsPerPage={rowPerPage}
                        onPageChange={handleChangePage}
                        rowsPerPageOptions={[5, 10, 20]}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </div>
            </motion.div>
        </div>
    );
};
