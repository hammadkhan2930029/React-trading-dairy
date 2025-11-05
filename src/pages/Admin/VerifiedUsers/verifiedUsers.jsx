import React from "react";
import './verifiedUsers.css';
import { fetchVerifiedUsers } from '../Redux/userListTypeslice';
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

export const VerifiedUsers = () => {

    const dispatch = useDispatch()
    const { verifiedUsers, loading, error } = useSelector((state) => state.userType);    
       
         useEffect(() => {            
                dispatch(fetchVerifiedUsers());
            }, [dispatch]);
        
    return (
        <div className="verified_user_container">

            <h2>Verified Users</h2>

            <div className="verified_user">
                <table className="table">
                    <thead className="table_head">
                        <tr className="table_head_row">
                            <th>Name</th>
                            <th>Email</th>
                            <th>Moble No</th>
                            <th>Status</th>



                        </tr>
                    </thead>
                    {verifiedUsers.map((item, index) => (
                        <tbody className="table_body">
                            <tr className="table_body_row">
                                <td style={{ color: '#000' }}>{item.name}</td>
                                <td>{item.email}</td>
                                <td>{item.number}</td>
                                <td style={{ color: item.is_active ? "green" : "red", fontWeight: "bold" }}>
                                    {item.is_active ? "Verified" : "Unverified"}
                                </td>


                            </tr>
                        </tbody>
                    ))}

                </table>

            </div>
        </div>

    )
}