import React, { useState, useEffect } from "react";
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
    onConfirm: (commentId: string) => void;
    forumId: string;
    commentId: string | null;
    currentUser: { id: string; isForumOwner: boolean };
    commentOwnerId: string;
}

const DeleteCommentConfirmation: React.FC<DeleteCommentConfirmationProps> = ({
    isOpen,
    onClose,
    onConfirm,
    forumId,
    commentId,
    currentUser,
    commentOwnerId,
}) => {
    const [error, setError] = useState<string | null>(null);
    const toast = useToast();

    useEffect(() => {
        if (!currentUser.isForumOwner && currentUser.id !== commentOwnerId) {
            setError("Nincs jogosultságod a hozzászólás törlésére.");
        } else {
            setError(null);
        }
    }, [currentUser, commentOwnerId]);

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
                onConfirm(commentId);
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
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    Biztosan törölni szeretné ezt a hozzászólást?
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="red" onClick={handleConfirm} isDisabled={!!error}>
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
