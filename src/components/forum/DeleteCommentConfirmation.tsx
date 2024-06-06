import React, { useState } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useToast,
} from "@chakra-ui/react";

interface DeleteCommentConfirmationProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    forumId: string;
    commentId: string | null;
    fetchComments: () => void;
}

const DeleteCommentConfirmation: React.FC<DeleteCommentConfirmationProps> = ({
    isOpen,
    onClose,
    onConfirm,
    forumId,
    commentId,
}) => {
    const [error, setError] = useState<string | null>(null);
    const toast = useToast();

    const handleConfirm = async () => {
        setError(null);

        try {
            if (!commentId || !forumId) return;

            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5000/forum/${forumId}/comments/${commentId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.status === 204) {
                onConfirm();
                toast({
                    title: "Hozzászólás törölve",
                    description: "A hozzászólás sikeresen törölve lett.",
                    status: "success",
                    duration: 5000,
                    isClosable: true
                });
                onClose();
                return;
            }

            if (response.status === 401) {
                throw new Error("Unauthorized: Ismeretlen felhasználó, hiányzó vagy érvénytelen token.");
            }

            if (response.status === 403) {
                throw new Error("Forbidden: Hozzáférés megtagadva, a felhasználó nem a tulajdonosa a fórumnak vagy hozzászólásnak.");
            }

            if (response.status === 404) {
                throw new Error("Not found: A fórum vagy hozzászólás nem található.");
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error: any) {
            setError(error.message);
            toast({
                title: "Hiba történt",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Hozzászólás törlése</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    Biztosan törölni szeretné ezt a hozzászólást?
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="red" onClick={handleConfirm}>
                        Törlés
                    </Button>
                    <Button bg="#D5D8DC" color="black" marginLeft={4} variant="ghost" onClick={onClose}>
                        Mégse
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DeleteCommentConfirmation;
