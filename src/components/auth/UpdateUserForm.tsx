// src/UpdateUserForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, FormikHelpers } from 'formik';
import { Box, Text, useToast, Spinner } from '@chakra-ui/react';
import * as Yup from 'yup';
import UpdateUserFormView from './UpdateUserFormView';

interface User {
    email: string;
    firstName: string;
    lastName: string;
}

interface FormValues {
    firstName: string;
    lastName: string;
}

const validationSchema = Yup.object({
    firstName: Yup.string().required('Kötelező mező'),
    lastName: Yup.string().required('Kötelező mező'),
});

const UpdateUserForm: React.FC = () => {
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

    const handleSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/user', {
                method: 'PUT', // Ensure PUT method for updating user data
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                const data: User = await response.json();
                setUser(data);
                toast({
                    title: 'Adatok sikeresen frissítve!',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                navigate('/profile');
            } else {
                const errorData = await response.json();
                switch (response.status) {
                    case 400:
                        throw new Error(errorData.message || 'A bevitt adatok érvénytelenek.');
                    case 401:
                        throw new Error(errorData.message || 'Hiányzó vagy érvénytelen token.');
                    default:
                        throw new Error(errorData.message || 'Ismeretlen hiba történt.');
                }
            }
        } catch (err) {
            if (err instanceof Error) {
                if (err.message === 'Hiányzó vagy érvénytelen token.') {
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    setError(err.message);
                    toast({
                        title: 'Hiba történt',
                        description: err.message,
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                }
            } else {
                setError('Ismeretlen hiba történt.');
                toast({
                    title: 'Hiba történt',
                    description: 'Ismeretlen hiba történt.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
        setSubmitting(false);
    };

    const handleCancel = () => {
        navigate('/profile'); // Navigate to the profile page on cancel
    };

    return (
        user ? (
            <Formik
                initialValues={{ firstName: user.firstName, lastName: user.lastName }}
                enableReinitialize
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {(formikProps) => <UpdateUserFormView formik={formikProps} error={error} onCancel={handleCancel} />}
            </Formik>
        ) : (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                {error ? (
                    <Text color="red.500">{error}</Text>
                ) : (
                    <Spinner size="xl" />
                )}
            </Box>
        )
    );
};

export default UpdateUserForm;
