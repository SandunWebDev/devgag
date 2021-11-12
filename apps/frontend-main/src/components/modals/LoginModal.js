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
import React from 'react';
import { BiLogIn as BiLogInIcon } from 'react-icons/bi';

import LoginForm from '../../pages/LoginPage/forms/LoginForm/LoginForm';

export default function LoginModal(props) {
    const {
        trigger,
        modalProps = {}, // Pass props like "isOpen, onClose, onSuccessFn" in  here, If need to manually control the modal.
    } = props;
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <div>
            {trigger || (
                <Button
                    display={{ base: 'none', md: 'inline-flex' }}
                    fontSize='sm'
                    fontWeight={600}
                    color='white'
                    bg='blue.400'
                    href='#'
                    leftIcon={<Icon as={BiLogInIcon} />}
                    _hover={{
                        bg: 'blue.500',
                    }}
                    onClick={() => onOpen()}>
                    Login
                </Button>
            )}

            <Modal
                isOpen={modalProps.isOpen || isOpen}
                onClose={modalProps.onCloseClick || onClose}
                closeOnOverlayClick={false}
                closeOnEsc={false}
                isCentered
                scrollBehavior='inside'
                {...modalProps}>
                <ModalOverlay />
                <ModalContent maxWidth='500px' margin='50px'>
                    <ModalHeader fontSize='md' />
                    <ModalCloseButton />
                    <ModalBody paddingBottom='20px'>
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
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    );
}
