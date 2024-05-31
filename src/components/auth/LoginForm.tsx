import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { setToken } from '../../auth';
import LoginFormView from './LoginFormView';
import { FormValues } from '../../models/LoginFormValues';

interface LoginFormProps {
    onLogin: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const formik = useFormik<FormValues>({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().email('Érvénytelen email cím').required('Kötelező mező'),
            password: Yup.string().min(8, 'A jelszónak legalább 8 karakter hosszúnak kell lennie').required('Kötelező mező'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            setError(null);
            try {
                const response = await fetch('http://localhost:5000/user/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: values.username,
                        password: values.password,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setToken(data.accessToken);
                    onLogin();
                    navigate('/');
                } else if (response.status === 400) {
                    const errorData = await response.json();
                    if (errorData.message) {
                        setError(errorData.message);
                    } else {
                        setError('Invalid input data');
                    }
                } else if (response.status === 401) {
                    setError('Invalid username or password');
                } else {
                    setError('An unknown error occurred.');
                }
            } catch (err) {
                setError('Failed to connect to the server.');
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <LoginFormView
            formik={formik}
            error={error}
            loading={formik.isSubmitting}
        />
    );
};

export default LoginForm;
