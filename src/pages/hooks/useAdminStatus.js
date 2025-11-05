// src/hooks/useAdminStatus.js
import { useEffect, useState } from 'react';
import TokenService from '../../utils/tokenService';
import api from '../../api/axios'; // your pre-configured Axios instance

export const useAdminStatus = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const checkAdmin = async () => {
            const token = TokenService.getAccessToken();
            if (!token) {
                setIsAdmin(false);
                setChecked(true);
                return;
            }

            try {
                const response = await api.get('/api/is-admin/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setIsAdmin(response.data.isAdmin === true);
            } catch (err) {
                console.error('Failed to verify admin status:', err);
                setIsAdmin(false);
            } finally {
                setChecked(true);
            }
        };

        checkAdmin();
    }, []);

    return { isAdmin, checked };
};
