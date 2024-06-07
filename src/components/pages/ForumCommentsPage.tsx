import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Box, Flex, Button, Select, Text, useToast } from "@chakra-ui/react";
import { Comment } from "../../models/comment";
import CommentList from "../forum/CommentList";
import CreateCommentModal from "../forum/CreateCommentModal";
import DeleteCommentConfirmation from "../forum/DeleteCommentConfirmation";

const ForumCommentsPage: React.FC = () => {
    const { forumId } = useParams<{ forumId: string }>();
    const navigate = useNavigate();
    const toast = useToast();
    const [searchParams, setSearchParams] = useSearchParams();

    const [comments, setComments] = useState<Comment[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [limit, setLimit] = useState<number>(parseInt(searchParams.get('limit') || '20'));
    const [offset, setOffset] = useState<number>(parseInt(searchParams.get('offset') || '0'));
    const [orderBy, setOrderBy] = useState<string>(searchParams.get('orderBy') || 'DESC');
    const [total, setTotal] = useState<number>(0);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

    const token = localStorage.getItem("token");

    const fetchComments = async () => {
        if (!forumId) return;
    
        try {
            const params = new URLSearchParams();
            params.append("limit", limit.toString());
            params.append("offset", offset.toString());
            params.append("orderBy", orderBy);
    
            const response = await fetch(`http://localhost:5000/forum/${forumId}/comments?${params.toString()}`);
    
            if (response.status === 400) {
                throw new Error("Bad request: Hibás rendezési vagy lapozási értékek.");
            }
    
            if (response.status === 404) {
                throw new Error("Not found: A megadott fórum nem található.");
            }
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
            }

            if (response.status === 200) {
                toast({
                    title: "Sikeres lekérdezés",
                    description: "A hozzászólások sikeresen lettek lekérdezve.",
                    status: "success",
                    duration: 5000,
                    isClosable: true
                });
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

    useEffect(() => {
        const params = new URLSearchParams();
        params.set("limit", limit.toString());
        params.set("offset", offset.toString());
        params.set("orderBy", orderBy);
        setSearchParams(params);
    }, [limit, offset, orderBy]);

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

    const handleDeleteComment = (commentId: string) => {
        setCommentToDelete(commentId);
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
                <Select value={limit} onChange={handleLimitChange} width="100px" bg="white" color="black">
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </Select>
                <Select value={orderBy} onChange={handleOrderByChange} width="200px" bg="white" color="black">
                    <option value="ASC">Legrégebbi legelől</option>
                    <option value="DESC">Legújabb legelől</option>
                </Select>
            </Flex>
            <Button colorScheme="blue" onClick={handleCreateComment} marginBottom={4} isDisabled={!token}>
                Új hozzászólás
            </Button>
            <CommentList comments={comments} onEditClick={handleCreateComment} onDeleteClick={handleDeleteComment} />
            <Flex justifyContent="space-between" marginTop={4}>
                <Button onClick={() => handlePageChange(Math.max(offset - limit, 0))} isDisabled={offset === 0}>
                    Előző oldal
                </Button>
                <Button onClick={() => handlePageChange(offset + limit)} isDisabled={offset + limit >= total}>
                    Következő oldal
                </Button>
            </Flex>
            <CreateCommentModal isOpen={
            isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} forumId={forumId} onCommentCreated={fetchComments} />
            <DeleteCommentConfirmation
                isOpen={!!commentToDelete}
                onClose={() => setCommentToDelete(null)}
                onConfirm={fetchComments}
                forumId={forumId}
                commentId={commentToDelete} currentUser={{
                    id: "",
                    isForumOwner: false
                }} commentOwnerId={""}/>
        </Box>
    );
};

export default ForumCommentsPage;
