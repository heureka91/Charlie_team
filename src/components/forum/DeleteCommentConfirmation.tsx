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
    fetchComments,
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
                fetchComments();
                onConfirm();
                toast({
                    title: "Hozzászólás törölve",
                    description: "A hozzászólás sikeresen törölve lett.",
                    status: "success",
                    duration: 5000,
                    isClosable: true
                });
                return;
            }

            if (response.status === 401 || response.status === 403 || response.status === 404) {
                const data = await response.json();
                throw new Error(data.message || "Ismeretlen hiba történt.");
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
                    <Button variant="ghost" onClick={onClose}>
                        Mégse
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DeleteCommentConfirmation;
