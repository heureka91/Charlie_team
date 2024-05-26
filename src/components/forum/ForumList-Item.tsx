import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Text, Heading, LinkBox, LinkOverlay, Button, Box } from "@chakra-ui/react";
import { Forum } from "../../models/forum"; // Helyes import

interface ForumProps {
    forum: Forum;
    onEditClick: (forumId: string) => void;
    onDeleteClick: (forumId: string) => void;
}

const ForumListItem: FC<ForumProps> = ({ forum, onEditClick, onDeleteClick }) => {
    const navigate = useNavigate();

    return (
        <LinkBox
            sx={{
                padding: 4,
                borderWidth: 1,
                borderRadius: "md",
                borderColor: "gray.300",
                backgroundColor: "white",
                _hover: { borderColor: "gray.500", backgroundColor: "gray.100" },
            }}
        >
            <Flex justifyContent="space-between" opacity={0.85}>
                <LinkOverlay as="button" onClick={() => navigate(`/forum/${forum.id}/comments`)}>
                    <Heading as="header" flexGrow={1} gap={3} display="flex" flexDirection="column">
                        <Text as="h4" fontSize="lg">
                            {forum.title}
                        </Text>
                        <Text fontSize="md" fontWeight="medium">
                            {forum.description}
                        </Text>
                        <Text fontSize="md">
                            Fórum készítője: {forum.createdBy.firstName} {forum.createdBy.lastName}
                        </Text>
                        <Text fontSize="md" fontWeight="medium">
                            Létrehozva: {new Date(forum.createdAt).toLocaleString()}
                        </Text>
                        <Text fontSize="md" fontWeight="medium">
                            Utolsó komment időpontja: {forum.lastComment ? new Date(forum.lastComment.createdAt).toLocaleString() : "N/A"}
                        </Text>
                        <Text fontSize="md" fontWeight="medium">
                            Utolsó kommentet létrehozta: {forum.lastComment ? `${forum.lastComment.user.firstName} ${forum.lastComment.user.lastName}` : "N/A"}
                        </Text>
                        <Text fontSize="md" fontWeight="medium">
                            Kommentek száma: {forum.commentsCount}
                        </Text>
                    </Heading>
                </LinkOverlay>
                <Box>
                    <Button colorScheme="yellow" onClick={(e) => { e.stopPropagation(); onEditClick(forum.id); }} marginRight={2}>
                        Módosítás
                    </Button>
                    <Button colorScheme="red" onClick={(e) => { e.stopPropagation(); onDeleteClick(forum.id); }}>
                        Törlés
                    </Button>
                </Box>
            </Flex>
        </LinkBox>
    );
};

export default ForumListItem;
