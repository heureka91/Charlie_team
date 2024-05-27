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
    FormControl,
    FormLabel,
    Textarea,
    useToast,
    Box,
    Text
} from "@chakra-ui/react";

interface EditCommentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCommentUpdated: () => void;
    forumId: string;
    commentId: string;
}

const EditCommentModal: React.FC<EditCommentModalProps> = ({ isOpen, onClose, onCommentUpdated, forumId, commentId }) => {
    const [message, setMessage] = useState("");
    const [error, setError] = useState<string | null>(null);
    const toast = useToast();

    useEffect(() => {
        const fetchCommentDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/forum/${forumId}/comments/${commentId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const comment = await response.json();
                setMessage(comment.message);
            } catch (err: any) {
                setError(err.message);
            }
        };

        if (forumId && commentId) {
            fetchCommentDetails();
        }
    }, [forumId, commentId]);

    const handleSubmit = async () => {
        setError(null);

        if (message.trim() === "") {
            setError("A hozzászólás nem lehet üres.");
            return;
        }
        if (message.length > 250) {
            setError("A hozzászólás legfeljebb 250 karakter hosszú lehet.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5000/forum/${forumId}/comments/${commentId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            toast({
                title: "Hozzászólás módosítva",
                description: "A hozzászólás sikeresen módosítva lett.",
                status: "success",
                duration: 5000,
                isClosable: true
            });

            onClose();
            onCommentUpdated();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Hozzászólás módosítása</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {error && <Text color="red">{error}</Text>}
                    <FormControl isRequired>
                        <FormLabel>Hozzászólás</FormLabel>
                        <Textarea
                            placeholder="Írj egy hozzászólást..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" onClick={handleSubmit}>
                        Módosítás
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                        Mégse
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditCommentModal;
