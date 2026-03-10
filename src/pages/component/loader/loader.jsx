import React from 'react'
import { Circles } from 'react-loader-spinner';
import "./loader.css"

export const Loader_f = () => {
    return (
        <div className='loader'>
            <div>

            <Circles
              
                className='loader-f'
                color="var(--primary-green)"
                ariaLabel="circles-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            />
            </div>

        </div>
    )
}
