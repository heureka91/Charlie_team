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
    FormControl,
    FormLabel,
    Textarea,
    useToast,
    Text
} from "@chakra-ui/react";

interface CreateCommentModalProps {
    isOpen: boolean;
    onClose: () => void;
    forumId: string;
    onCommentCreated: () => void;
}

const CreateCommentModal: React.FC<CreateCommentModalProps> = ({ isOpen, onClose, forumId, onCommentCreated }) => {
    const [message, setMessage] = useState("");
    const [error, setError] = useState<string | null>(null);
    const toast = useToast();

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
            const response = await fetch(`http://localhost:5000/forum/${forumId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            toast({
                title: "Hozzászólás létrehozva",
                description: "A hozzászólás sikeresen létre lett hozva.",
                status: "success",
                duration: 5000,
                isClosable: true
            });

            onClose();
            onCommentCreated();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Új hozzászólás</ModalHeader>
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
                        Létrehozás
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                        Mégse
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CreateCommentModal;
