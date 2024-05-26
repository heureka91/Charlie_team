import React, { useEffect, useState } from "react";
import { Box, Select, Input, Button, Flex, FormLabel, useDisclosure, useToast } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import ForumList from "../../components/forum/ForumList"; // Helyes import
import { CreateForumModal } from "../../components/forum/CreateForumModal";
import EditForumModal from "../../components/forum/EditForumModal";
import DeleteConfirmation from "../../components/forum/DeleteConfirmation";
import { Forum } from "../../models/forum";

const ForumPage = () => {
    const [forums, setForums] = useState<Forum[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [orderBy, setOrderBy] = useState<string>("date.DESC");
    const [query, setQuery] = useState<string>("");
    const [after, setAfter] = useState<string>("");
    const [before, setBefore] = useState<string>("");
    const [usersFirst, setUsersFirst] = useState<boolean>(false);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const toast = useToast();
    const navigate = useNavigate();

    const [forumToEdit, setForumToEdit] = useState<string | null>(null);
    const [forumToDelete, setForumToDelete] = useState<string | null>(null);

    const fetchForums = async () => {
        try {
            const params = new URLSearchParams();
            if (query) params.append("query", query);
            if (after) params.append("after", after);
            if (before) params.append("before", before);
            if (usersFirst) params.append("usersFirst", String(usersFirst));
            if (orderBy) params.append("orderBy", orderBy);

            const response = await fetch(`http://localhost:5000/forum?${params.toString()}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
            }
            const forumsJson = await response.json();
            setForums(forumsJson.map((forum: any) => ({
                ...forum,
                createdAt: new Date(forum.createdAt), // Biztosítjuk, hogy a createdAt mező Date objektummá legyen alakítva
                lastComment: forum.lastComment ? {
                    ...forum.lastComment,
                    createdAt: new Date(forum.lastComment.createdAt)
                } : null
            })));
        } catch (err: any) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchForums();
    }, [orderBy, query, after, before, usersFirst]);

    const handleForumCreated = () => {
        fetchForums();
    };

    const handleEditClick = (forumId: string) => {
        setForumToEdit(forumId);
        onEditOpen();
    };

    const handleDeleteClick = (forumId: string) => {
        setForumToDelete(forumId);
        onDeleteOpen();
    };

    const handleConfirmDelete = async () => {
        if (forumToDelete) {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:5000/forum/${forumToDelete}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                fetchForums();
                onDeleteClose();
                toast({
                    title: "Fórum törölve",
                    description: "A fórum sikeresen törölve lett.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            } catch (err: any) {
                setError(err.message);
            }
        }
    };

    const handleForumUpdated = () => {
        fetchForums();
    };

    return (
        <Box width="full" backgroundColor="gray.100" padding={5}>
            {error && <p>Error: {error}</p>}
            <Flex direction="column" marginBottom={4}>
                <Input
                    placeholder="Keresés..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    marginBottom={2}
                />
                <Flex justifyContent="space-between" marginBottom={2}>
                    <Box width="48%">
                        <FormLabel>Kezdő dátum</FormLabel>
                        <Input
                            type="date"
                            value={after}
                            onChange={(e) => setAfter(e.target.value)}
                        />
                    </Box>
                    <Box width="48%">
                        <FormLabel>Vég dátum</FormLabel>
                        <Input
                            type="date"
                            value={before}
                            onChange={(e) => setBefore(e.target.value)}
                        />
                    </Box>
                </Flex>
                <Select
                    value={orderBy}
                    onChange={(e) => setOrderBy(e.target.value)}
                    marginBottom={2}
                >
                    <option value="date.DESC">Legfrissebb legelöl</option>
                    <option value="date.ASC">Legrégebbi legelöl</option>
                    <option value="name.ASC">Név szerint A-Z</option>
                    <option value="name.DESC">Név szerint Z-A</option>
                </Select>
                <Button onClick={() => setUsersFirst(!usersFirst)} marginBottom={2}>
                    {usersFirst ? "Minden fórum" : "Csak a saját fórumjaim"}
                </Button>
                <Button onClick={onOpen} colorScheme="blue" marginBottom={2}>
                    Új fórum létrehozása
                </Button>
                <Button onClick={() => navigate('/profile')} colorScheme="blue" marginBottom={2}>
                    Felhasználói adatok módosítása
                </Button>
            </Flex>
            {forums.length > 0 ? (
                <ForumList forums={forums} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick} />
            ) : (
                <p>Loading...</p>
            )}
            <CreateForumModal isOpen={isOpen} onClose={onClose} onForumCreated={handleForumCreated} />
            {forumToEdit && (
                <EditForumModal
                    isOpen={isEditOpen}
                    onClose={onEditClose}
                    onForumUpdated={handleForumUpdated}
                    forumId={forumToEdit}
                />
            )}
            <DeleteConfirmation
                isOpen={isDeleteOpen}
                onClose={onDeleteClose}
                onConfirm={handleConfirmDelete}
            />
        </Box>
    );
};

export default ForumPage;
