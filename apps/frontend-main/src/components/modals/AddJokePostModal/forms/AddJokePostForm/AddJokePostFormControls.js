/* eslint-disable react/no-children-prop */
/* eslint-disable react/sort-comp */

import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Button,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    VStack,
    Icon,
    Select,
    Textarea,
} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import React, { Component } from 'react';
import { BiMessageAltAdd as BiMessageAltAddIcon } from 'react-icons/bi';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { addJokePost } from '../../../../../utilities/apiRequests/backendMainApiRequests';

const formikInitialValues = {
    type: '',
    title: '',
    description: '',
    textJoke: '',
    memeJoke: '',
};

const formikValidationSchema = Yup.object({
    type: Yup.string()
        .required('Required')
        .oneOf(['TEXT', 'MEME'], 'Must select a type'),
    title: Yup.string()
        .required('Required')
        .min(3, 'Too short')
        .max(50, 'Too long'),
    description: Yup.string().min(3, 'Too short').max(240, 'Too long'),
    textJoke: Yup.string().when('type', {
        is: 'TEXT',
        then: (fieldSchema) =>
            fieldSchema
                .required('Required')
                .min(3, 'Too short')
                .max(1000, 'Too long'),
    }),
    memeJoke: Yup.string().when('type', {
        is: 'MEME',
        then: (fieldSchema) => fieldSchema.required('Required'),
    }),
});

class AddJokePostFormControls extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    async handleFormSubmitting(formValues, formikProps) {
        const { onSuccessFn = () => {}, onFailureFn = () => {} } = this.props;

        try {
            const apiReqBody = {
                type: formValues.type,
                title: formValues.title,
                description: formValues.description,
                text_joke: formValues.textJoke,
                text_background: '',
                meme_joke_file: formValues.memeJoke[0],
            };

            // Resetting Existing Form Errors.
            formikProps.setStatus({
                formSubmitError: '',
            });
            formikProps.setSubmitting(true);

            // Adding Joke Post.
            await addJokePost(apiReqBody);

            onSuccessFn();

            toast.success('Joke Post Added.');
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
                    console.log(formikProps.errors, formikProps.values);

                    return (
                        <Form noValidate>
                            <VStack spacing={4}>
                                <Field name='type'>
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
                                                    Type
                                                </FormLabel>

                                                <Select
                                                    {...field}
                                                    placeholder='Select Joke Type'
                                                    variant='filled'>
                                                    <option value='TEXT'>
                                                        TEXT
                                                    </option>
                                                    <option value='MEME'>
                                                        MEME
                                                    </option>
                                                </Select>

                                                <FormErrorMessage>
                                                    {form.errors[field.name]}
                                                </FormErrorMessage>
                                            </FormControl>
                                        );
                                    }}
                                </Field>

                                <Field name='title'>
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
                                                    Title
                                                </FormLabel>

                                                <Input
                                                    {...field}
                                                    variant='filled'
                                                    placeholder='Title'
                                                />

                                                <FormErrorMessage>
                                                    {form.errors[field.name]}
                                                </FormErrorMessage>
                                            </FormControl>
                                        );
                                    }}
                                </Field>

                                <Field name='description'>
                                    {({ field, form }) => {
                                        return (
                                            <FormControl
                                                id={field.name}
                                                isRequired={false}
                                                isInvalid={
                                                    form.errors[field.name] &&
                                                    form.touched[field.name]
                                                }>
                                                <FormLabel htmlFor={field.name}>
                                                    Description
                                                </FormLabel>

                                                <Input
                                                    {...field}
                                                    variant='filled'
                                                    placeholder='Description About Post'
                                                />

                                                <FormErrorMessage>
                                                    {form.errors[field.name]}
                                                </FormErrorMessage>
                                            </FormControl>
                                        );
                                    }}
                                </Field>

                                {formikProps.values.type === 'TEXT' && (
                                    <Field name='textJoke'>
                                        {({ field, form }) => {
                                            return (
                                                <FormControl
                                                    id={field.name}
                                                    isRequired
                                                    isInvalid={
                                                        form.errors[
                                                            field.name
                                                        ] &&
                                                        form.touched[field.name]
                                                    }>
                                                    <FormLabel
                                                        htmlFor={field.name}>
                                                        Joke
                                                    </FormLabel>

                                                    <Textarea
                                                        {...field}
                                                        rows={10}
                                                        variant='filled'
                                                        placeholder='Type your Text Joke in here.'
                                                    />

                                                    <FormErrorMessage>
                                                        {
                                                            form.errors[
                                                                field.name
                                                            ]
                                                        }
                                                    </FormErrorMessage>
                                                </FormControl>
                                            );
                                        }}
                                    </Field>
                                )}

                                {formikProps.values.type === 'MEME' && (
                                    <Field name='memeJoke'>
                                        {({ field, form }) => {
                                            return (
                                                <FormControl
                                                    id={field.name}
                                                    isRequired
                                                    isInvalid={
                                                        form.errors[
                                                            field.name
                                                        ] &&
                                                        form.touched[field.name]
                                                    }>
                                                    <FormLabel
                                                        htmlFor={field.name}>
                                                        Joke
                                                    </FormLabel>

                                                    <Input
                                                        variant='filled'
                                                        placeholder='Meme Image'
                                                        type='file'
                                                        accept='image/*'
                                                        onChange={(event) => {
                                                            formikProps.setFieldValue(
                                                                'memeJoke',
                                                                event
                                                                    .currentTarget
                                                                    .files,
                                                            );
                                                        }}
                                                    />

                                                    <FormErrorMessage>
                                                        {
                                                            form.errors[
                                                                field.name
                                                            ]
                                                        }
                                                    </FormErrorMessage>
                                                </FormControl>
                                            );
                                        }}
                                    </Field>
                                )}

                                <Button
                                    colorScheme='facebook'
                                    size='lg'
                                    leftIcon={<Icon as={BiMessageAltAddIcon} />}
                                    isFullWidth
                                    type='submit'
                                    isLoading={formikProps.isSubmitting}>
                                    ADD
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

export default AddJokePostFormControls;
