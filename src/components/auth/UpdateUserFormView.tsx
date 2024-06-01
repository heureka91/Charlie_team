import React from 'react';
import { Box, Button, FormControl, FormLabel, Input, Text, Heading, ButtonGroup, FormErrorMessage } from '@chakra-ui/react';
import { Formik, Field, Form, FormikProps } from 'formik';
import * as Yup from 'yup';
import { useUpdateUserForm } from './UpdateUserForm';
import { User } from '../../models/User';

interface UpdateUserFormViewProps {
    formik: FormikProps<User>;
    error?: string;
    onCancel: () => void;
}

const UpdateUserFormView: React.FC<UpdateUserFormViewProps> = ({ formik, error, onCancel }) => {
    return (
        <Box maxWidth="400px" margin="auto" padding="20px" border="1px solid #ccc" borderRadius="5px">
            <Heading as="h2" textAlign="center" mb={4}>Felhasználói adatok frissítése</Heading>
            <Form>
                <FormControl isInvalid={!!(formik.touched.firstName && formik.errors.firstName)} marginBottom="15px">
                    <FormLabel htmlFor="firstName">Keresztnév</FormLabel>
                    <Field as={Input}
                           type="text"
                           id="firstName"
                           name="firstName"
                           placeholder="Keresztnév"
                           backgroundColor="#e0e0e0"
                    />
                    <FormErrorMessage>{formik.errors.firstName}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!(formik.touched.lastName && formik.errors.lastName)} marginBottom="15px">
                    <FormLabel htmlFor="lastName">Vezetéknév</FormLabel>
                    <Field as={Input}
                           type="text"
                           id="lastName"
                           name="lastName"
                           placeholder="Vezetéknév"
                           backgroundColor="#e0e0e0"
                    />
                    <FormErrorMessage>{formik.errors.lastName}</FormErrorMessage>
                </FormControl>
                {error && <Text color="red.500" textAlign="center" marginTop="10px">{error}</Text>}
                <ButtonGroup width="100%" mt={4}>
                    <Button type="submit" colorScheme="green" width="100%" isLoading={formik.isSubmitting} isDisabled={!formik.isValid || formik.isSubmitting}>
                        Frissítés
                    </Button>
                    <Button type="button" colorScheme="red" width="100%" onClick={onCancel} isDisabled={formik.isSubmitting}>
                        Mégse
                    </Button>
                </ButtonGroup>
            </Form>
        </Box>
    );
};

const UpdateUserFormContainer: React.FC = () => {
    const { userData, handleSubmit } = useUpdateUserForm();

    if (!userData) {
        return null;
    }

    return (
        <Formik
            initialValues={userData}
            validationSchema={Yup.object({
                firstName: Yup.string().required('Keresztnév szükséges'),
                lastName: Yup.string().required('Vezetéknév szükséges'),
            })}
            onSubmit={(values, { setSubmitting }) => {
                handleSubmit(values);
                setSubmitting(false);
            }}
        >
            {formik => (
                <UpdateUserFormView
                    formik={formik}
                    onCancel={() => window.history.back()}
                />
            )}
        </Formik>
    );
};

export default UpdateUserFormContainer;
