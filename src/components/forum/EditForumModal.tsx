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
    Input,
    Textarea,
    useToast,
    Text
} from "@chakra-ui/react";

interface EditForumModalProps {
    isOpen: boolean;
    onClose: () => void;
    onForumUpdated: () => void;
    forumId: string;
}

const EditForumModal: React.FC<EditForumModalProps> = ({ isOpen, onClose, onForumUpdated, forumId }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState<string | null>(null);
    const toast = useToast();

    useEffect(() => {
        const fetchForumDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/forum/${forumId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const forum = await response.json();
                setTitle(forum.title);
                setDescription(forum.description);
            } catch (err: any) {
                setError(err.message);
            }
        };

        if (forumId) {
            fetchForumDetails();
        }
    }, [forumId]);

    const handleSubmit = async () => {
        setError(null);

        // Validation
        if (title.trim() === "" || description.trim() === "") {
            setError("Minden mezőt ki kell tölteni.");
            return;
        }
        if (title.length > 100) {
            setError("A cím legfeljebb 100 karakter hosszú lehet.");
            return;
        }
        if (description.length > 250) {
            setError("A leírás legfeljebb 250 karakter hosszú lehet.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5000/forum/${forumId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ title, description })
            });

            if (response.status === 409) {
                setError("Már létezik ilyen című fórum.");
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            toast({
                title: "Fórum módosítva",
                description: `A fórum sikeresen módosítva lett: ${data.title}`,
                status: "success",
                duration: 5000,
                isClosable: true
            });

            onClose();
            onForumUpdated();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Fórum módosítása</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {error && <Text color="red">{error}</Text>}
                    <FormControl isRequired>
                        <FormLabel>Cím</FormLabel>
                        <Input
                            placeholder="Fórum címe"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </FormControl>
                    <FormControl isRequired marginTop={4}>
                        <FormLabel>Leírás</FormLabel>
                        <Textarea
                            placeholder="Fórum részletes leírása"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
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

export default EditForumModal;
