import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Heading, Text, useToast, Spinner } from '@chakra-ui/react';

interface User {
    email: string;
    firstName: string;
    lastName: string;
    userId: string;
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        maxWidth: '400px',
        margin: 'auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        backgroundColor: '#000000',
        color: '#ffffff',
    },
    text: {
        color: '#ffffff',
    },
    button: {
        width: '100%',
        marginTop: '10px',
    },
    errorMessage: {
        color: 'red',
        textAlign: 'center' as 'center',
        marginTop: '10px',
    },
};

const Profile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/user', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data: User = await response.json();
                    setUser(data);
                } else {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            } catch (err) {
                setError('Hiba történt az adatok lekérése során.');
                localStorage.removeItem('token');
                navigate('/login');
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleUpdateUser = () => {
        navigate('/update');
    };

    const handleChangePassword = () => {
        navigate('/change-password');
    };

    const handleBackToForum = () => {
        navigate('/forum');
    };

    if (error) {
        return (
            <Box style={styles.container}>
                <Text style={styles.errorMessage}>{error}</Text>
            </Box>
        );
    }

    if (!user) {
        return (
            <Box style={styles.container}>
                <Spinner size="xl" />
            </Box>
        );
    }

    return (
        <Box style={styles.container}>
            <Heading as="h2" textAlign="center" mb={4}>Profil Oldal</Heading>
            <Text style={styles.text}><strong>Email:</strong> {user.email}</Text>
            <Text style={styles.text}><strong>Keresztnév:</strong> {user.firstName}</Text>
            <Text style={styles.text}><strong>Vezetéknév:</strong> {user.lastName}</Text>
            <Button colorScheme="teal" style={styles.button} onClick={handleUpdateUser}>
                Személyes adatok módosítása
            </Button>
            <Button colorScheme="teal" style={styles.button} onClick={handleChangePassword}>
                Jelszó módosítása
            </Button>
            <Button colorScheme="red" style={styles.button} onClick={handleLogout}>
                Kilépés
            </Button>
            <Button colorScheme="blue" style={styles.button} onClick={handleBackToForum}>
                Vissza a fórumra
            </Button>
        </Box>
    );
};

export default Profile;
