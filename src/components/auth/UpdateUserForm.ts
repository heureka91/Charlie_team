import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { getToken, clearToken } from '../../auth';
import { User } from '../../models/User';

export const useUpdateUserForm = () => {
    const [userData, setUserData] = useState<User | null>(null);
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        const fetchData = async () => {
            const token = getToken();
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/user', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                } else if (response.status === 401) {
                    handleLogout();
                } else {
                    throw new Error('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                handleLogout();
            }
        };

        fetchData();
    }, [navigate]);

    const handleLogout = () => {
        clearToken();
        sessionStorage.removeItem('token');
        navigate('/login');
    };

    const handleSubmit = async (values: User) => {
        const token = getToken();
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                const data = await response.json();
                setUserData(data);
                toast({
                    title: 'Profile updated.',
                    description: "Your profile information has been successfully updated.",
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                navigate('/profile'); // Navigate back to the profile page
            } else if (response.status === 400) {
                toast({
                    title: 'Error',
                    description: 'Invalid input data.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } else if (response.status === 401) {
                handleLogout();
            } else {
                throw new Error('Failed to update user data');
            }
        } catch (error) {
            console.error('Error updating user data:', error);
            toast({
                title: 'Error',
                description: 'Failed to connect to the server.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return {
        userData,
        handleSubmit,
    };
};
