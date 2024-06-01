import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Flex, Button, Select, Text, useToast } from "@chakra-ui/react";
import { Comment } from "../../models/comment";
import CommentList from "../forum/CommentList";
import CreateCommentModal from "../forum/CreateCommentModal";
import EditCommentModal from "../forum/EditCommentModal";
import DeleteCommentConfirmation from "../forum/DeleteCommentConfirmation";

const ForumCommentsPage: React.FC = () => {
    const { forumId } = useParams<{ forumId: string }>();
    const navigate = useNavigate();
    const toast = useToast();

    const [comments, setComments] = useState<Comment[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [limit, setLimit] = useState<number>(20);
    const [offset, setOffset] = useState<number>(0);
    const [orderBy, setOrderBy] = useState<string>("DESC");
    const [total, setTotal] = useState<number>(0);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [commentToEdit, setCommentToEdit] = useState<string | null>(null);
    const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

    const fetchComments = async () => {
        if (!forumId) return;

        try {
            const params = new URLSearchParams();
            params.append("limit", limit.toString());
            params.append("offset", offset.toString());
            params.append("orderBy", orderBy);

            const response = await fetch(`http://localhost:5000/forum/${forumId}/comments?${params.toString()}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
            }
            const data = await response.json();
            setComments(data.comments);
            setTotal(data.total);
        } catch (err: any) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [limit, offset, orderBy, forumId]);

    const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLimit(Number(event.target.value));
        setOffset(0);
    };

    const handleOrderByChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setOrderBy(event.target.value);
    };

    const handlePageChange = (newOffset: number) => {
        setOffset(newOffset);
    };

    const handleCreateComment = () => {
        setIsCreateModalOpen(true);
    };

    const handleEditComment = (commentId: string) => {
        setCommentToEdit(commentId);
        setIsEditModalOpen(true);
    };

    const handleDeleteComment = (commentId: string) => {
        setCommentToDelete(commentId);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (commentToDelete && forumId) {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:5000/forum/${forumId}/comments/${commentToDelete}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                fetchComments();
                setIsDeleteModalOpen(false);
                toast({
                    title: "Hozzászólás törölve",
                    description: "A hozzászólás sikeresen törölve lett.",
                    status: "success",
                    duration: 5000,
                    isClosable: true
                });
            } catch (err: any) {
                setError(err.message);
            }
        }
    };

    if (!forumId) {
        return <Text color="white">Error: Forum ID is not defined.</Text>;
    }

    return (
        <Box width="full" padding={5} bg="black" color="white">
            {error && <Text color="red.500">Error: {error}</Text>}
            <Button onClick={() => navigate("/forum")} marginBottom={4}>
                Vissza a fórumokhoz
            </Button>
            <Flex justifyContent="space-between" alignItems="center" marginBottom={4}>
                <Select value={limit} onChange={handleLimitChange} width="100px">
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </Select>
                <Select value={orderBy} onChange={handleOrderByChange} width="200px">
                    <option value="ASC">Legrégebbi legelől</option>
                    <option value="DESC">Legújabb legelől</option>
                </Select>
            </Flex>
            <Button colorScheme="blue" onClick={handleCreateComment} marginBottom={4}>
                Új hozzászólás
            </Button>
            <CommentList comments={comments} onEditClick={handleEditComment} onDeleteClick={handleDeleteComment} />
            <Flex justifyContent="space-between" marginTop={4}>
                <Button onClick={() => handlePageChange(Math.max(offset - limit, 0))} isDisabled={offset === 0}>
                    Előző oldal
                </Button>
                <Button onClick={() => handlePageChange(offset + limit)} isDisabled={offset + limit >= total}>
                    Következő oldal
                </Button>
            </Flex>
            <CreateCommentModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} forumId={forumId} onCommentCreated={fetchComments} />
            {commentToEdit && (
                <EditCommentModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} forumId={forumId} commentId={commentToEdit} onCommentUpdated={fetchComments} />
            )}
            <DeleteCommentConfirmation isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleConfirmDelete} />
        </Box>
    );
};

export default ForumCommentsPage;