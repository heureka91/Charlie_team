import React from 'react';
import { Box, Button, FormControl, FormLabel, Input, Alert, Text } from '@chakra-ui/react';
import { FormikProps, Field, Form, ErrorMessage } from 'formik';
import { RegisterFormValues } from '../../models/RegisterFormValues';

interface RegisterFormViewProps {
    formik: FormikProps<RegisterFormValues>;
    error: string | null;
    onCancel: () => void;
}

const RegisterFormView: React.FC<RegisterFormViewProps> = ({ formik, error, onCancel }) => {
    return (
        <Box width="400px" mx="auto" mt="50px">
            <Form onSubmit={formik.handleSubmit}>
                <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Field as={Input} name="username" />
                    <ErrorMessage name="username">
                        {msg => <Text color="red.500">{msg}</Text>}
                    </ErrorMessage>
                </FormControl>
                <FormControl isRequired mt={4}>
                    <FormLabel>Password</FormLabel>
                    <Field as={Input} type="password" name="password" />
                    <ErrorMessage name="password">
                        {msg => <Text color="red.500">{msg}</Text>}
                    </ErrorMessage>
                </FormControl>
                <FormControl isRequired mt={4}>
                    <FormLabel>Confirm Password</FormLabel>
                    <Field as={Input} type="password" name="passwordConfirm" />
                    <ErrorMessage name="passwordConfirm">
                        {msg => <Text color="red.500">{msg}</Text>}
                    </ErrorMessage>
                </FormControl>
                <FormControl isRequired mt={4}>
                    <FormLabel>First Name</FormLabel>
                    <Field as={Input} name="firstName" />
                    <ErrorMessage name="firstName">
                        {msg => <Text color="red.500">{msg}</Text>}
                    </ErrorMessage>
                </FormControl>
                <FormControl isRequired mt={4}>
                    <FormLabel>Last Name</FormLabel>
                    <Field as={Input} name="lastName" />
                    <ErrorMessage name="lastName">
                        {msg => <Text color="red.500">{msg}</Text>}
                    </ErrorMessage>
                </FormControl>
                {error && (
                    <Alert status="error" mt={4}>
                        {error}
                    </Alert>
                )}
                <Box mt={4} display="flex" justifyContent="space-between">
                    <Button type="reset" colorScheme="gray" onClick={onCancel}>
                        Mégsem
                    </Button>
                    <Button type="submit" colorScheme="teal" isLoading={formik.isSubmitting}>
                        Regisztráció
                    </Button>
                </Box>
            </Form>
        </Box>
    );
};

export default RegisterFormView;
