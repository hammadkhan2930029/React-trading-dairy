import React, { useEffect, useState } from 'react';
import { Formik, ErrorMessage } from 'formik';
import "./brokerForm.css"
import "react-datepicker/dist/react-datepicker.css";
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import { motion, useInView } from "framer-motion";

// import { setBroker_list } from '../Redux/profileSlice';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import MenuItem from '@mui/material/MenuItem';
import { selectAllBrokers, fetchBrokerlist} from "../../Redux/brokerSlice";
import { useDispatch, useSelector} from "react-redux";
import { createUserBroker } from "../../Redux/userBrokerSlice";

const brokerNames = [];

export const BrokerForm = () => {
    const dispatch = useDispatch()
    const [isMobile, setIsMobile] = useState(window.innerWidth < 430);
    const refOne = React.useRef(null);
    const inViewOne = useInView(refOne, { triggerOnce: true });
    const brokers = useSelector(selectAllBrokers)

    // Fetch broker list from Backend 
        useEffect(() => {
            const fetchData = async () => {
                if (brokers.length === 0) {
                    try {
                        await dispatch(fetchBrokerlist());
                    } catch (error) {
                        console.error("Failed to fetch stocks:", error);
                    }
                }
            };    
        fetchData();
        }, [dispatch, brokers.length]);


    return (

        <motion.div
            ref={refOne}
            initial={{ opacity: 0, y: -100 }}
            animate={inViewOne ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: .8 }}>
            <Formik
                initialValues={{
                    broker_id: '',
                    broker_name: '',
                    
                }}                
                onSubmit={(values, { resetForm }) => {
                    if (values.broker_id) {
                    dispatch(createUserBroker(values.broker_id));
                    }
                    resetForm();
                }}
                >
                {({ handleBlur, handleChange, handleSubmit, values, errors,setFieldValue }) => (
                    <form onSubmit={handleSubmit}>

                        <div className='form-main-brokerForm'>

                            <div>

                                <span className='heading'>Broker</span>

                            </div>

                            <div className='form_broker_main'>

                                <div className='form_broker'>

                                    <TextField
                                        select 
                                        label="Broker Name"
                                        name="broker_id"
                                        value={values.broker_id || ''}
                                        onChange={(e) => {
                                            const selectedId = parseInt(e.target.value);
                                            const selectedBroker = brokers.find(broker => broker.id === selectedId);
                                            setFieldValue("broker_id", selectedId);
                                            setFieldValue("broker_name",  selectedBroker?.broker_name || "");
                                        
                                            
                                        }}
                                        //onBlur={handleBlur}
                                        fullWidth
                                        >
                                        <MenuItem value="">
                                            <em>Select a Broker</em>
                                        </MenuItem>
                                        {brokers.map((broker) => (
                                            <MenuItem key={broker.id} value={broker.id}>
                                            {broker.broker_name}
                                            </MenuItem>
                                        ))} 
                                    </TextField>
                                    {/* <div className='btn_div'> */}
                                        <button className='border_Add_btn'>  <SendIcon sx={{ mr: 1 }} /> Add</button>
                                    {/* </div> */}

                                    {/* -------------------------------- */}
                                    {/* {[
                                        { label: "First Range", from: "from_rang_1", to: "to_rang_1", charges: "charges_1" },
                                        { label: "Second Range", from: "from_rang_2", to: "to_rang_2", charges: "charges_2" },
                                        { label: "Third Range", from: "from_rang_3", to: "to_rang_3", charges: "charges_3" },
                                    ].map((item, index) => (
                                        <div className='range_section'>
                                            <span className='sub_heading'>{item.label}</span>


                                            <div className='broker_input_row'>


                                                <TextField
                                                    id="outlined-required"
                                                    label="From"
                                                    type="number"
                                                    className='broker_input'
                                                    placeholder="from_rang..."
                                                    // name='from_rang_1'
                                                    // onChange={handleChange}
                                                    // onBlur={handleBlur}
                                                    // value={values.from_rang_1}
                                                    name={item.from}
                                                    value={values[item.from]}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                <TextField
                                                    id="outlined-required"
                                                    label="to"
                                                    type="text"
                                                    placeholder="to_rang..."
                                                    className='broker_input'
                                                    name={item.to}
                                                    value={values[item.to]}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                <TextField
                                                    id="outlined-required"
                                                    label="Charges"
                                                    type="text"
                                                    placeholder="Charges..."
                                                    className='broker_input_charges'
                                                    name={item.charges}
                                                    value={values[item.charges]}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                            </div>
                                        </div>


                                    ))} */}

                                    {/* -------------------------------- */}
                                    {/* <div className='sub_heading_div'>
                                            <span className='sub_heading'>Second Rang</span>
                                        </div>

                                    <div className='broker_input_row'>


                                        <TextField
                                            id="outlined-required"
                                            label="From"
                                            type="text"
                                            className='broker_input'
                                            placeholder="Charges..."
                                            name='charges_1'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.charges_1}
                                        />
                                        <TextField
                                            id="outlined-required"
                                            label="to"
                                            type="text"
                                            placeholder="Charges..."
                                            className='broker_input'

                                            name='charges_2'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.charges_2}
                                        />
                                        <TextField
                                            id="outlined-required"
                                            label="Charges"
                                            type="text"
                                            placeholder="Charges..."
                                            className='broker_input_charges'

                                            name='charges_3'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.charges_3}
                                        />
                                    </div> */}

                                    {/* -------------------------------- */}
                                    {/* <div className='sub_heading_div'>
                                            <span className='sub_heading'>Third Rang</span>
                                        </div>

                                    <div className='broker_input_row'>


                                        <TextField
                                            id="outlined-required"
                                            label="From"
                                            type="text"
                                            className='broker_input'
                                            placeholder="Charges..."
                                            name='charges_1'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.charges_1}
                                        />
                                        <TextField
                                            id="outlined-required"
                                            label="to"
                                            type="text"
                                            placeholder="Charges..."
                                            className='broker_input'

                                            name='charges_2'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.charges_2}
                                        />
                                        <TextField
                                            id="outlined-required"
                                            label="Charges"
                                            type="text"
                                            placeholder="Charges..."
                                            className='broker_input_charges'

                                            name='charges_3'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.charges_3}
                                        />
                                    </div> */}

                                </div>


                            </div>



                        </div>
                    </form>
                )}

            </Formik>
        </motion.div>

    )
}

export default BrokerForm;