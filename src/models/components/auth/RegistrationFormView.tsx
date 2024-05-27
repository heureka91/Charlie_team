// src/RegistrationFormView.tsx
import React from 'react';
import { FormikProps, Form, Field, ErrorMessage } from 'formik';
import { Box, Button, ButtonGroup, FormControl, FormLabel, Input, FormErrorMessage, Heading, Text } from '@chakra-ui/react';

interface FormValues {
    username: string;
    password: string;
    passwordConfirm: string;
    firstName: string;
    lastName: string;
}

interface RegistrationFormViewProps {
    formik: FormikProps<FormValues>;
    error: string | null;
    onCancel: () => void;
}

const RegistrationFormView: React.FC<RegistrationFormViewProps> = ({ formik, error, onCancel }) => {
    return (
        <Box maxWidth="400px" margin="auto" padding="20px" border="1px solid #ccc" borderRadius="5px" backgroundColor="#000000" color="#ffffff">
            <Heading as="h2" textAlign="center">Regisztrációs űrlap</Heading>
            <Form>
                <FormControl isInvalid={!!(formik.touched.username && formik.errors.username)} marginBottom="15px">
                    <FormLabel htmlFor="username" color="#ffffff">Felhasználónév</FormLabel>
                    <Field as={Input}
                           type="email"
                           id="username"
                           name="username"
                           placeholder="Felhasználónév"
                           backgroundColor="#333333"
                           color="#ffffff"
                           _placeholder={{ color: '#FFD700' }} // sárga placeholder szín
                    />
                    <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!(formik.touched.password && formik.errors.password)} marginBottom="15px">
                    <FormLabel htmlFor="password" color="#ffffff">Jelszó</FormLabel>
                    <Field as={Input}
                           type="password"
                           id="password"
                           name="password"
                           placeholder="Jelszó"
                           backgroundColor="#333333"
                           color="#ffffff"
                           _placeholder={{ color: '#FFD700' }} // sárga placeholder szín
                    />
                    <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!(formik.touched.passwordConfirm && formik.errors.passwordConfirm)} marginBottom="15px">
                    <FormLabel htmlFor="passwordConfirm" color="#ffffff">Jelszó megerősítése</FormLabel>
                    <Field as={Input}
                           type="password"
                           id="passwordConfirm"
                           name="passwordConfirm"
                           placeholder="Jelszó megerősítése"
                           backgroundColor="#333333"
                           color="#ffffff"
                           _placeholder={{ color: '#FFD700' }} // sárga placeholder szín
                    />
                    <FormErrorMessage>{formik.errors.passwordConfirm}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!(formik.touched.firstName && formik.errors.firstName)} marginBottom="15px">
                    <FormLabel htmlFor="firstName" color="#ffffff">Keresztnév</FormLabel>
                    <Field as={Input}
                           type="text"
                           id="firstName"
                           name="firstName"
                           placeholder="Keresztnév"
                           backgroundColor="#333333"
                           color="#ffffff"
                           _placeholder={{ color: '#FFD700' }} // sárga placeholder szín
                    />
                    <FormErrorMessage>{formik.errors.firstName}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!(formik.touched.lastName && formik.errors.lastName)} marginBottom="15px">
                    <FormLabel htmlFor="lastName" color="#ffffff">Vezetéknév</FormLabel>
                    <Field as={Input}
                           type="text"
                           id="lastName"
                           name="lastName"
                           placeholder="Vezetéknév"
                           backgroundColor="#333333"
                           color="#ffffff"
                           _placeholder={{ color: '#FFD700' }} // sárga placeholder szín
                    />
                    <FormErrorMessage>{formik.errors.lastName}</FormErrorMessage>
                </FormControl>
                {error && <Text color="red.500" textAlign="center" marginTop="10px">{error}</Text>}
                <ButtonGroup width="100%" mt={4}>
                    <Button type="submit" colorScheme="green" width="100%" isLoading={formik.isSubmitting} isDisabled={!formik.isValid || formik.isSubmitting}>
                        Regisztráció
                    </Button>
                    <Button type="button" colorScheme="red" width="100%" onClick={onCancel} isDisabled={formik.isSubmitting}>
                        Mégse
                    </Button>
                </ButtonGroup>
            </Form>
        </Box>
    );
};


export default RegistrationFormView;