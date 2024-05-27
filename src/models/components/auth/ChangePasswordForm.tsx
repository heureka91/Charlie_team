import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Button, ButtonGroup, Input, Box, FormControl, FormErrorMessage, Heading, useToast } from '@chakra-ui/react';

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
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        color: '#ffffff',
        backgroundColor: '#333333',
    },
    errorMessage: {
        color: 'red',
        textAlign: 'center' as 'center', // explicit cast
        marginTop: '10px',
    },
};

const ChangePasswordForm: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const toast = useToast();

    const validationSchema = Yup.object({
        oldPassword: Yup.string()
            .min(8, 'A jelszónak legalább 8 karakter hosszúnak kell lennie')
            .matches(/\d/, 'A jelszónak tartalmaznia kell legalább egy számot')
            .matches(/[a-z]/, 'A jelszónak tartalmaznia kell legalább egy kisbetűt')
            .required('Kötelező mező'),
        password: Yup.string()
            .min(8, 'A jelszónak legalább 8 karakter hosszúnak kell lennie')
            .matches(/\d/, 'A jelszónak tartalmaznia kell legalább egy számot')
            .matches(/[a-z]/, 'A jelszónak tartalmaznia kell legalább egy kisbetűt')
            .notOneOf([Yup.ref('oldPassword')], 'Az új jelszó nem egyezhet meg a régi jelszóval')
            .required('Kötelező mező'),
        passwordConfirm: Yup.string()
            .oneOf([Yup.ref('password')], 'A két jelszó nem egyezik meg')
            .required('Kötelező mező'),
    });

    const formik = useFormik({
        initialValues: {
            oldPassword: '',
            password: '',
            passwordConfirm: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            setError(null);
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/user/login', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(values),
                });

                if (response.ok) {
                    toast({
                        title: 'Jelszó sikeresen megváltoztatva!',
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
                        case 409:
                            throw new Error(errorData.message || 'A régi és az új jelszó azonos.');
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
                    }
                } else {
                    setError('Ismeretlen hiba történt.');
                }
            }
        },
    });

    return (
        <Box style={styles.container}>
            <Heading as="h2" size="lg" textAlign="center">Jelszó Módosítása</Heading>
            <form onSubmit={formik.handleSubmit}>
                <FormControl isInvalid={formik.touched.oldPassword && !!formik.errors.oldPassword} mb={4}>
                    <Input
                        type="password"
                        name="oldPassword"
                        placeholder="Régi Jelszó"
                        value={formik.values.oldPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        style={styles.input}
                        _placeholder={{ color: '#FFD700' }} // sárga placeholder szín
                    />
                    <FormErrorMessage>{formik.errors.oldPassword}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={formik.touched.password && !!formik.errors.password} mb={4}>
                    <Input
                        type="password"
                        name="password"
                        placeholder="Új Jelszó"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        style={styles.input}
                        _placeholder={{ color: '#FFD700' }} // sárga placeholder szín
                    />
                    <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={formik.touched.passwordConfirm && !!formik.errors.passwordConfirm} mb={4}>
                    <Input
                        type="password"
                        name="passwordConfirm"
                        placeholder="Új Jelszó Megerősítése"
                        value={formik.values.passwordConfirm}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        style={styles.input}
                        _placeholder={{ color: '#FFD700' }} // sárga placeholder szín
                    />
                    <FormErrorMessage>{formik.errors.passwordConfirm}</FormErrorMessage>
                </FormControl>
                {error && <p style={styles.errorMessage}>{error}</p>}
                <ButtonGroup>
                    <Button type="submit" colorScheme="green" width="100%" isDisabled={!formik.isValid || formik.isSubmitting}>
                        Mentés
                    </Button>
                    <Button type="button" colorScheme="red" width="100%" onClick={() => navigate('/profile')}>
                        Mégse
                    </Button>
                </ButtonGroup>
            </form>
        </Box>
    );
};

export default ChangePasswordForm;
