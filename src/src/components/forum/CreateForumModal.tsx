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
    Input,
    Textarea,
    useToast,
    Box,
    Text,
    Link
} from "@chakra-ui/react";

interface CreateForumModalProps {
    isOpen: boolean;
    onClose: () => void;
    onForumCreated: () => void;
}

export const CreateForumModal: React.FC<CreateForumModalProps> = ({ isOpen, onClose, onForumCreated }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState<string | null>(null);
    const toast = useToast();

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
            const response = await fetch("http://localhost:5000/forum", {
                method: "POST",
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
                title: "Fórum létrehozva",
                description: `A fórum sikeresen létre lett hozva: ${data.title}`,
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top-right",
                render: () => (
                    <Box color="white" p={3} bg="green.500" borderRadius="md">
                        <Text>{`A fórum sikeresen létre lett hozva: ${data.title}`}</Text>
                        <Link href={`/forum/${data.id}`} color="teal.200">Nézd meg a fórumot</Link>
                    </Box>
                )
            });

            onClose();
            onForumCreated();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Új fórum létrehozása</ModalHeader>
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
