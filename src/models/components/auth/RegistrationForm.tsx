// src/RegistrationForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, FormikHelpers } from 'formik';
import { useToast } from '@chakra-ui/react';
import * as Yup from 'yup';
import RegistrationFormView from './RegistrationFormView';

interface FormValues {
    username: string;
    password: string;
    passwordConfirm: string;
    firstName: string;
    lastName: string;
}

const validationSchema = Yup.object({
    username: Yup.string().email('Érvénytelen email cím').required('Kötelező mező'),
    password: Yup.string()
        .min(8, 'A jelszónak legalább 8 karakter hosszúnak kell lennie')
        .matches(/\d/, 'A jelszónak tartalmaznia kell legalább egy számot')
        .matches(/[a-z]/, 'A jelszónak tartalmaznia kell legalább egy kisbetűt')
        .required('Kötelező mező'),
    passwordConfirm: Yup.string()
        .oneOf([Yup.ref('password'), undefined], 'A jelszavaknak meg kell egyezniük')
        .required('Kötelező mező'),
    firstName: Yup.string().required('Kötelező mező'),
    lastName: Yup.string().required('Kötelező mező'),
});

const RegistrationForm: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const toast = useToast();

    const initialValues: FormValues = {
        username: '',
        password: '',
        passwordConfirm: '',
        firstName: '',
        lastName: '',
    };

    const handleSubmit = async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.accessToken);
                toast({
                    title: 'Sikeres regisztráció!',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                resetForm();
                navigate('/profile');
            } else {
                const errorData = await response.json();
                switch (response.status) {
                    case 400:
                        throw new Error(errorData.message || 'A bevitt adatok érvénytelenek.');
                    case 409:
                        throw new Error(errorData.message || 'A felhasználó már létezik.');
                    default:
                        throw new Error(errorData.message || 'Ismeretlen hiba történt.');
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
                toast({
                    title: 'Hiba történt',
                    description: error.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
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
    };

    const handleCancel = () => {
        navigate('/login'); // Navigálj a bejelentkezési oldalra a "Mégsem" gombbal
    };

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {(formikProps) => <RegistrationFormView formik={formikProps} error={error} onCancel={handleCancel} />}
        </Formik>
    );
};

export default RegistrationForm;
