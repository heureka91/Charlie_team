import React, { useEffect, useState } from 'react';
import { Box, Button, Text, Spinner, Heading, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { getToken, clearToken } from '../../auth';
import { User } from "../../models/User";

const Profile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = getToken();
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/user', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data: User = await response.json();
                    setUser(data);
                } else {
                    clearToken();
                    navigate('/login');
                }
            } catch (err) {
                setError('Hiba történt az adatok lekérése során.');
                clearToken();
                navigate('/login');
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        clearToken();
        navigate('/login');
    };

    const handleUpdateUser = () => {
        navigate('/profile/edit');
    };

    const handleChangePassword = () => {
        navigate('/change-password');
    };

    if (error) {
        return (
            <Box maxW="400px" m="auto" p="20px" border="1px solid #ccc" borderRadius="5px" bg="black" color="white">
                <Text color="red" textAlign="center" mt="10px">{error}</Text>
            </Box>
        );
    }

    if (!user) {
        return (
            <Box maxW="400px" m="auto" p="20px" border="1px solid #ccc" borderRadius="5px" bg="black" color="white">
                <Spinner size="xl" />
            </Box>
        );
    }

    return (
        <Box maxW="400px" m="auto" p="20px" border="1px solid #ccc" borderRadius="5px" bg="black" color="white">
            <Heading as="h2" textAlign="center" mb={4}>Profil Oldal</Heading>
            <Text><strong>Email:</strong> {user.email}</Text>
            <Text><strong>Keresztnév:</strong> {user.firstName}</Text>
            <Text><strong>Vezetéknév:</strong> {user.lastName}</Text>
            <Button colorScheme="teal" width="100%" mt="10px" onClick={handleUpdateUser}>
                Személyes adatok módosítása
            </Button>
            <Button colorScheme="teal" width="100%" mt="10px" onClick={handleChangePassword}>
                Jelszó módosítása
            </Button>
            <Button colorScheme="red" width="100%" mt="10px" onClick={handleLogout}>
                Kilépés
            </Button>
            <Button colorScheme="blue" width="100%" mt="10px" onClick={() => navigate('/forum')}>
                Vissza a fórumra
            </Button>
        </Box>
    );
};

export default Profile;
