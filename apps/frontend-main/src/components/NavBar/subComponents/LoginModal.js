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

import LoginForm from '../../../pages/LoginPage/forms/LoginForm/LoginForm';

export default function LoginModal(props) {
    const { trigger } = props;
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
                isOpen={isOpen}
                onClose={onClose}
                closeOnOverlayClick={false}
                closeOnEsc={false}
                isCentered
                scrollBehavior='inside'>
                <ModalOverlay />
                <ModalContent maxWidth='500px' margin='50px'>
                    <ModalHeader fontSize='md' />
                    <ModalCloseButton />
                    <ModalBody paddingBottom='20px'>
                        <LoginForm
                            onSuccessFn={() => {
                                onClose();
                            }}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    );
}
