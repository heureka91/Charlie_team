import React, { useEffect, useState } from "react";
import { Box, Select, Input, Button, Flex, FormLabel, useDisclosure, useToast, Text, Spinner } from "@chakra-ui/react";
import { useNavigate, useLocation } from 'react-router-dom';
import ForumList from "../../components/forum/ForumList";
import { CreateForumModal } from "../../components/forum/CreateForumModal";
import EditForumModal from "../../components/forum/EditForumModal";
import DeleteConfirmation from "../../components/forum/DeleteConfirmation";
import { Forum } from "../../models/forum";

interface User {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
}

const ForumPage = () => {
    const [forums, setForums] = useState<Forum[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [orderBy, setOrderBy] = useState<string>("date.DESC");
    const [query, setQuery] = useState<string>("");
    const [after, setAfter] = useState<string>("");
    const [before, setBefore] = useState<string>("");
    const [user, setUser] = useState<User | null>(null);
    const [showOnlyUserForums, setShowOnlyUserForums] = useState<boolean>(false);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const toast = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    const [forumToEdit, setForumToEdit] = useState<string | null>(null);
    const [forumToDelete, setForumToDelete] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/user', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data: User = await response.json();
                    setUser(data);
                } else {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            } catch (err) {
                setError('Hiba történt az adatok lekérése során.');
                localStorage.removeItem('token');
                navigate('/login');
            }
        };

        fetchUserData();
    }, [navigate]);

    const fetchForums = async () => {
        try {
            const params = new URLSearchParams(location.search);

            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5000/forum?${params.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
            }
            const forumsJson = await response.json();
            setForums(forumsJson.map((forum: any) => ({
                ...forum,
                createdAt: new Date(forum.createdAt),
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
    }, [location.search]);

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
                    if (response.status === 403) {
                        throw new Error("Nincs jogosultságod a fórum törléséhez.");
                    }
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
                toast({
                    title: "Hiba",
                    description: err.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    };

    const handleForumUpdated = async () => {
        try {
            await fetchForums();
        } catch (err: any) {
            if (err.message.includes("403")) {
                setError("Nincs jogosultságod a fórum módosításához.");
                toast({
                    title: "Hiba",
                    description: "Nincs jogosultságod a fórum módosításához.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                setError(err.message);
            }
        }
    };

    const updateQueryParams = (params: Record<string, any>) => {
        const searchParams = new URLSearchParams(location.search);
        Object.keys(params).forEach(key => {
            if (params[key]) {
                searchParams.set(key, params[key]);
            } else {
                searchParams.delete(key);
            }
        });
        navigate({ search: searchParams.toString() }, { replace: true });
    };

    const handleToggleUserForums = () => {
        setShowOnlyUserForums(!showOnlyUserForums);
        updateQueryParams({ usersFirst: !showOnlyUserForums ? "true" : "" });
    };

    const filteredForums = showOnlyUserForums && user
        ? forums.filter(forum => forum.createdBy.userId === user.userId)
        : forums;

    if (!user) {
        return (
            <Box width="full" backgroundColor="black" color="white" padding={5} display="flex" justifyContent="center" alignItems="center">
                <Spinner size="xl" />
            </Box>
        );
    }

    return (
        <Box width="full" backgroundColor="black" color="white" padding={5}>
            {error && <Text color="red.500">Error: {error}</Text>}
            <Flex direction="column" marginBottom={4}>
                <Input
                    placeholder="Keresés..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onBlur={() => updateQueryParams({ query })}
                    marginBottom={2}
                    backgroundColor="gray.800"
                    color="white"
                    _placeholder={{ color: 'gray.500' }}
                />
                <Flex justifyContent="space-between" marginBottom={2}>
                    <Box width="48%">
                        <FormLabel color="white">Kezdő dátum</FormLabel>
                        <Input
                            type="date"
                            value={after}
                            onChange={(e) => setAfter(e.target.value)}
                            onBlur={() => updateQueryParams({ after })}
                            backgroundColor="gray.800"
                            color="white"
                        />
                    </Box>
                    <Box width="48%">
                        <FormLabel color="white">Vég dátum</FormLabel>
                        <Input
                            type="date"
                            value={before}
                            onChange={(e) => setBefore(e.target.value)}
                            onBlur={() => updateQueryParams({ before })}
                            backgroundColor="gray.800"
                            color="white"
                        />
                    </Box>
                </Flex>
                <Select
                    value={orderBy}
                    onChange={(e) => {
                        setOrderBy(e.target.value);
                        updateQueryParams({ orderBy: e.target.value });
                    }}
                    marginBottom={2}
                    backgroundColor="black"
                    color="white"
                    _hover={{ backgroundColor: "gray.700" }}
                    sx={{
                        option: {
                            backgroundColor: "black",
                            color: "white"
                        }
                    }}
                >
                    <option value="date.DESC">Legfrissebb legelöl</option>
                    <option value="date.ASC">Legrégebbi legelöl</option>
                    <option value="name.ASC">Név szerint A-Z</option>
                    <option value="name.DESC">Név szerint Z-A</option>
                </Select>
                <Button onClick={handleToggleUserForums} colorScheme="blue" marginBottom={2}>
                    {showOnlyUserForums ? "Összes fórum" : "Csak a saját fórumaim"}
                </Button>
                <Button onClick={onOpen} colorScheme="blue" marginBottom={2}>
                    Új fórum létrehozása
                </Button>
                <Button onClick={() => navigate('/profile')} colorScheme="blue" marginBottom={2}>
                    Felhasználói adatok módosítása
                </Button>
            </Flex>
            {filteredForums.length > 0 ? (
                <ForumList forums={filteredForums} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick} currentUser={user.userId} />
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
