import React from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button
} from "@chakra-ui/react";

interface DeleteCommentConfirmationProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteCommentConfirmation: React.FC<DeleteCommentConfirmationProps> = ({ isOpen, onClose, onConfirm }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Hozzászólás törlése</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    Biztosan törölni szeretné ezt a hozzászólást?
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="red" onClick={onConfirm}>
                        Törlés
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                        Mégse
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DeleteCommentConfirmation;
