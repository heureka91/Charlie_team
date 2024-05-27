import React, { FC } from "react";
import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { Comment } from "../../models/comment";

interface CommentListProps {
    comments: Comment[];
    onEditClick: (commentId: string) => void;
    onDeleteClick: (commentId: string) => void;
}

const CommentList: FC<CommentListProps> = ({ comments, onEditClick, onDeleteClick }) => {
    return (
        <Box>
            {comments.map((comment) => (
                <Box key={comment.id} padding={4} borderWidth={1} borderRadius="md" marginBottom={2} backgroundColor="black" color="white">
                    <Flex justifyContent="space-between">
                        <Text fontSize="md">{comment.message}</Text>
                        <Text fontSize="sm" color="gray.400">{new Date(comment.createdAt).toLocaleString()}</Text>
                    </Flex>
                    <Text fontSize="sm" fontWeight="medium">Létrehozta: {comment.user.firstName} {comment.user.lastName}</Text>
                    <Flex justifyContent="flex-end" marginTop={2}>
                        <Button colorScheme="yellow" onClick={() => onEditClick(comment.id)} marginRight={2}>
                            Módosítás
                        </Button>
                        <Button colorScheme="red" onClick={() => onDeleteClick(comment.id)}>
                            Törlés
                        </Button>
                    </Flex>
                </Box>
            ))}
        </Box>
    );
};

export default CommentList;
