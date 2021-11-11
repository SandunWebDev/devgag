/* eslint-disable react/no-children-prop */
/* eslint-disable react/sort-comp */

import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    InputGroup,
    Input,
    InputLeftElement,
    InputRightElement,
    Button,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Box,
    VStack,
    Icon,
    IconButton,
} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import React, { Component } from 'react';
import {
    BiLogIn as BiLogInIcon,
    BiUserCircle as BiUserCircleIcon,
} from 'react-icons/bi';
import { RiLockPasswordLine as RiLockPasswordLineIcon } from 'react-icons/ri';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { withGlobalContext } from '../../../../reactContexts/globalContextor/globalContextor';
import {
    loginUser,
    getLoggedUserDetails,
} from '../../../../utilities/apiRequests/backendMainApiRequests';
import { saveLoggedUser } from '../../../../utilities/userAuthentication';

const formikInitialValues = {
    username: '',
    password: '',
};

const formikValidationSchema = Yup.object({
    username: Yup.string().email('Invalid Email').required('Required'),
    password: Yup.string().required('Required'),
});

class LoginFormControls extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showPassword: false,
        };
    }

    togglePasswordDisplay() {
        const { showPassword } = this.state;

        this.setState({
            showPassword: !showPassword,
        });
    }

    async handleFormSubmitting(formValues, formikProps) {
        const { contextActions } = this.props;
        const { onSuccessFn = () => {}, onFailureFn = () => {} } = this.props;

        const { updateCurrentUserData } = contextActions;

        try {
            const apiReqBody = {
                username: formValues.username,
                password: formValues.password,
            };

            // Resetting Existing Form Errors.
            formikProps.setStatus({
                formSubmitError: '',
            });
            formikProps.setSubmitting(true);

            // Logging User with Backend. (Getting Tokens)
            const resData = await loginUser(apiReqBody);
            const { access_token, refresh_token } = resData;

            saveLoggedUser({
                AccessToken: access_token,
                RefreshToken: refresh_token,
            });

            // Get extra details about logged user (Ex. FirstName, LastName, Etc...) and saving on global context.
            const loggedUserExtraData = await getLoggedUserDetails();
            updateCurrentUserData(loggedUserExtraData);

            onSuccessFn();

            toast.success('You have logged successfully.');
            formikProps.setSubmitting(false);
        } catch (error) {
            const errMsg = error.customErrMsg || error.message;

            onFailureFn();

            // Resetting Existing Form Errors.
            formikProps.setStatus({
                formSubmitError: errMsg,
            });

            formikProps.setSubmitting(false);
        }
    }

    render() {
        const { showPassword } = this.state;

        return (
            <Formik
                initialValues={formikInitialValues}
                validationSchema={formikValidationSchema}
                initialStatus={{
                    formSubmitError: '',
                }}
                onSubmit={async (formValues, formikProps) => {
                    await this.handleFormSubmitting(formValues, formikProps);
                }}>
                {(formikProps) => {
                    return (
                        <Form noValidate>
                            <VStack spacing={4}>
                                <Field name='username'>
                                    {({ field, form }) => {
                                        return (
                                            <FormControl
                                                id={field.name}
                                                isRequired
                                                isInvalid={
                                                    form.errors[field.name] &&
                                                    form.touched[field.name]
                                                }>
                                                <FormLabel htmlFor={field.name}>
                                                    Username
                                                </FormLabel>

                                                <InputGroup>
                                                    <InputLeftElement
                                                        pointerEvents='none'
                                                        children={
                                                            <Icon
                                                                as={
                                                                    BiUserCircleIcon
                                                                }
                                                                color='gray.500'
                                                            />
                                                        }
                                                    />
                                                    <Input
                                                        {...field}
                                                        variant='filled'
                                                        placeholder='Email'
                                                        type='email'
                                                    />
                                                </InputGroup>

                                                <FormErrorMessage>
                                                    {form.errors[field.name]}
                                                </FormErrorMessage>
                                            </FormControl>
                                        );
                                    }}
                                </Field>

                                <Field name='password'>
                                    {({ field, form }) => {
                                        return (
                                            <FormControl
                                                id={field.name}
                                                isRequired
                                                isInvalid={
                                                    form.errors[field.name] &&
                                                    form.touched[field.name]
                                                }>
                                                <FormLabel htmlFor={field.name}>
                                                    Password
                                                </FormLabel>

                                                <InputGroup>
                                                    <InputLeftElement
                                                        pointerEvents='none'
                                                        children={
                                                            <Icon
                                                                as={
                                                                    RiLockPasswordLineIcon
                                                                }
                                                                color='gray.500'
                                                            />
                                                        }
                                                    />
                                                    <Input
                                                        {...field}
                                                        pr='4.5rem' // So don't exceed Hide/Show button.
                                                        type={
                                                            showPassword
                                                                ? 'text'
                                                                : 'password'
                                                        }
                                                        variant='filled'
                                                        placeholder='Password'
                                                    />
                                                    <InputRightElement width='4.5rem'>
                                                        <Box
                                                            onClick={() =>
                                                                this.togglePasswordDisplay()
                                                            }>
                                                            {showPassword ? (
                                                                <IconButton
                                                                    aria-label='Hide'
                                                                    size='sm'
                                                                    icon={
                                                                        <ViewOffIcon />
                                                                    }
                                                                />
                                                            ) : (
                                                                <IconButton
                                                                    aria-label='Show'
                                                                    size='sm'
                                                                    icon={
                                                                        <ViewIcon />
                                                                    }
                                                                />
                                                            )}
                                                        </Box>
                                                    </InputRightElement>
                                                </InputGroup>

                                                <FormErrorMessage>
                                                    {form.errors[field.name]}
                                                </FormErrorMessage>
                                            </FormControl>
                                        );
                                    }}
                                </Field>

                                <Button
                                    colorScheme='facebook'
                                    size='lg'
                                    leftIcon={<Icon as={BiLogInIcon} />}
                                    isFullWidth
                                    type='submit'
                                    isLoading={formikProps.isSubmitting}>
                                    LOGIN
                                </Button>

                                {formikProps.status.formSubmitError && (
                                    <Alert status='error'>
                                        <AlertIcon />
                                        <AlertTitle mr={2}>
                                            Login Failed
                                        </AlertTitle>
                                        <AlertDescription>
                                            {formikProps.status.formSubmitError}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </VStack>
                        </Form>
                    );
                }}
            </Formik>
        );
    }
}

export default withGlobalContext(LoginFormControls);
