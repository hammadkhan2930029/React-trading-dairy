import React from "react";
import './loader.css'
import { FallingLines } from 'react-loader-spinner'
export const Loader = () => {
    return (
        <div className="loader">

            <FallingLines
                color="#247fe8"
                width="30%"
                visible={true}
                ariaLabel="falling-circles-loading"
            />
        </div>
       

    );
};