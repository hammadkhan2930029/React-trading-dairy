import React from "react";
import './registeredUsers.css';
import { fetchRegisteredUsers } from '../Redux/userListTypeslice';
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";



export const RegisteredUsers = () => {
    const dispatch = useDispatch()
    const { registeredUsers, loading, error } = useSelector((state) => state.userType);

   
     useEffect(() => {            
            dispatch(fetchRegisteredUsers());
        }, [dispatch]);
    console.log("Registereed Users",registeredUsers)

    return (
        <div className="registered_user_container">
            <h2>Registered Users</h2>
            <div className="registered_user">
                <table className="table">
                    <thead className="table_head">
                        <tr className="table_head_row">
                            <th>Name</th>
                            <th>Email</th>
                            <th>Moble No</th>


                        </tr>
                    </thead>
                    {registeredUsers.map((item, index) => (
                        <tbody className="table_body">
                            <tr className="table_body_row">
                                <td style={{ color: '#000' }}>{item.name}</td>
                                <td>{item.email}</td>
                                <td>{item.number}</td>

                            </tr>
                        </tbody>
                    ))}

                </table>

            </div>
        </div>
    )
}