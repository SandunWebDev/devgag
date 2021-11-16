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
import React from 'react';
import { BiMessageAltAdd as BiMessageAltAddIcon } from 'react-icons/bi';

import AddJokePostForm from './forms/AddJokePostForm/AddJokePostForm';

export default function AddJokePostModal(props) {
    const {
        trigger,
        modalProps = {}, // Pass props like "isOpen, onClose, onSuccessFn" in  here, If need to manually control the modal.
    } = props;
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <div>
            {trigger ? (
                <div onClick={() => onOpen()}>{trigger}</div>
            ) : (
                <Button
                    display={{ base: 'none', md: 'inline-flex' }}
                    fontSize='sm'
                    fontWeight={600}
                    color='white'
                    bg='blue.400'
                    href='#'
                    leftIcon={<Icon as={BiMessageAltAddIcon} />}
                    _hover={{
                        bg: 'blue.500',
                    }}
                    onClick={() => onOpen()}>
                    Add Joke Post
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
                <ModalOverlay bg='myBrand.modalBackground.light' />

                <ModalContent maxWidth='500px' margin='50px'>
                    <ModalHeader fontSize='md' />
                    <ModalCloseButton />
                    <ModalBody paddingBottom='20px'>
                        <AddJokePostForm
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
