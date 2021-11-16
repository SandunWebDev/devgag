/* eslint-disable jsx-a11y/no-static-element-interactions */

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    Icon,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { BiLogIn as BiLogInIcon } from 'react-icons/bi';

import LoginForm from '../../../pages/LoginPage/forms/LoginForm/LoginForm';
import SignupForm from '../../../pages/SignupPage/forms/SignupForm/SignupForm';

export default function LoginModal(props) {
    const {
        trigger,
        defaultFormType = 'LOGIN',
        modalProps = {}, // Pass props like "isOpen, onClose, onSuccessFn" in  here, If need to manually control the modal.
    } = props;
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [formType, setFormType] = useState(defaultFormType);

    return (
        <div>
            {trigger ? (
                <div onClick={() => onOpen()}>{trigger}</div>
            ) : (
                <Button
                    display={{ base: 'none', md: 'inline-flex' }}
                    fontSize='sm'
                    fontWeight={600}
                    color='black'
                    bg='blue.100'
                    href='#'
                    leftIcon={<Icon as={BiLogInIcon} />}
                    _hover={{
                        bg: 'blue.200',
                    }}
                    onClick={() => onOpen()}>
                    Login
                </Button>
            )}

            <Modal
                isOpen={modalProps.isOpen || isOpen}
                onClose={() => {
                    setFormType('LOGIN');

                    // eslint-disable-next-line no-unused-expressions
                    modalProps.onCloseClick
                        ? modalProps.onCloseClick()
                        : onClose();
                }}
                closeOnOverlayClick={false}
                closeOnEsc={false}
                isCentered
                scrollBehavior='inside'
                {...modalProps}>
                <ModalOverlay bg='myBrand.modalBackground.light' />

                <ModalContent maxWidth='500px' margin='50px'>
                    <ModalHeader fontSize='md' />
                    <ModalCloseButton />
                    <ModalBody paddingBottom='20px'>
                        {formType === 'LOGIN' && (
                            <LoginForm
                                onSuccessFn={() => {
                                    // eslint-disable-next-line no-unused-expressions
                                    modalProps.onSuccessFn
                                        ? modalProps.onSuccessFn()
                                        : '';

                                    // eslint-disable-next-line no-unused-expressions
                                    modalProps.onCloseClick
                                        ? modalProps.onCloseClick()
                                        : onClose();
                                }}
                                onFooterLinkClick={() => setFormType('SIGNUP')}
                            />
                        )}

                        {formType === 'SIGNUP' && (
                            <SignupForm
                                // eslint-disable-next-line sonarjs/no-identical-functions
                                onSuccessFn={() => {
                                    // eslint-disable-next-line no-unused-expressions
                                    modalProps.onSuccessFn
                                        ? modalProps.onSuccessFn()
                                        : '';

                                    // eslint-disable-next-line no-unused-expressions
                                    modalProps.onCloseClick
                                        ? modalProps.onCloseClick()
                                        : onClose();
                                }}
                                onFooterLinkClick={() => setFormType('LOGIN')}
                            />
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    );
}
