// src/LoginFormView.tsx
import React from 'react';
import { FormikProps } from 'formik';
import { Box, Button, ButtonGroup, FormControl, FormLabel, Input, FormErrorMessage, Heading, Text } from '@chakra-ui/react';

interface FormValues {
    username: string;
    password: string;
}

interface LoginFormViewProps {
    formik: FormikProps<FormValues>;
    error: string | null;
    loading: boolean;
}

const LoginFormView: React.FC<LoginFormViewProps> = ({ formik, error, loading }) => {
    return (
        <Box maxWidth="400px" margin="auto" padding="20px" border="1px solid #ccc" borderRadius="5px">
            <Heading as="h2" textAlign="center" marginBottom="20px">Belépés</Heading>
            <form onSubmit={formik.handleSubmit}>
                <FormControl isInvalid={!!(formik.touched.username && formik.errors.username)} marginBottom="15px">
                    <FormLabel htmlFor="username">Felhasználónév</FormLabel>
                    <Input
                        type="email"
                        id="username"
                        name="username"
                        placeholder="Felhasználónév"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        backgroundColor="#e0e0e0"
                    />
                    <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!(formik.touched.password && formik.errors.password)} marginBottom="15px">
                    <FormLabel htmlFor="password">Jelszó</FormLabel>
                    <Input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Jelszó"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        backgroundColor="#e0e0e0"
                    />
                    <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
                </FormControl>
                {error && <Text color="red" textAlign="center" marginTop="10px">{error}</Text>}
                <ButtonGroup width="100%" mt={4}>
                    <Button
                        type="submit"
                        colorScheme="green"
                        width="100%"
                        isLoading={loading}
                        isDisabled={!formik.isValid || formik.isSubmitting}
                    >
                        Belépés
                    </Button>
                </ButtonGroup>
                <Text textAlign="center" marginTop="10px">
                    Nincs fiókod? <a href="/register">Regisztráció</a>
                </Text>
            </form>
        </Box>
    );
};

export default LoginFormView;
