import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Text, Heading, LinkBox, LinkOverlay, Button, Box } from "@chakra-ui/react";
import { Forum } from "../../models/Forum";

interface ForumProps {
    forum: Forum;
    onEditClick: (forumId: string) => void;
    onDeleteClick: (forumId: string) => void;
    currentUser: string;
}

const ForumListItem: FC<ForumProps> = ({ forum, onEditClick, onDeleteClick, currentUser }) => {
    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate(`/forum/${forum.id}/comments`);
        window.scrollTo(0, 0);
    };

    return (
        <LinkBox
            sx={{
                padding: 4,
                borderWidth: 1,
                borderRadius: "md",
                borderColor: "gray.300",
                backgroundColor: "black",
                _hover: { borderColor: "black.500", backgroundColor: "black.700" },
            }}
        >
            <Flex justifyContent="space-between" opacity={0.85}>
                <LinkOverlay as="button" onClick={handleNavigation}>
                    <Heading as="header" flexGrow={1} gap={3} display="flex" flexDirection="column">
                        <Text as="h4" fontSize="lg" color="green.500">
                            {forum.title}
                        </Text>
                        <Text fontSize="md" fontWeight="medium" color="green.500">
                            {forum.description}
                        </Text>
                        <Text fontSize="md" color="green.500">
                            Fórum készítője: {forum.createdBy.firstName} {forum.createdBy.lastName}
                        </Text>
                        <Text fontSize="md" fontWeight="medium" color="green.500">
                            Létrehozva: {new Date(forum.createdAt).toLocaleString()}
                        </Text>
                        <Text fontSize="md" fontWeight="medium" color="green.500">
                            Utolsó komment időpontja: {forum.lastComment ? new Date(forum.lastComment.createdAt).toLocaleString() : "N/A"}
                        </Text>
                        <Text fontSize="md" fontWeight="medium" color="green.500">
                            Utolsó kommentet létrehozta: {forum.lastComment ? `${forum.lastComment.user.firstName} ${forum.lastComment.user.lastName}` : "N/A"}
                        </Text>
                        <Text fontSize="md" fontWeight="medium" color="green.500">
                            Kommentek száma: {forum.commentsCount}
                        </Text>
                    </Heading>
                </LinkOverlay>
                {forum.createdBy.userId === currentUser && (
                    <Box>
                        <Button colorScheme="yellow" onClick={(e) => { e.stopPropagation(); onEditClick(forum.id); }} marginRight={2}>
                            Módosítás
                        </Button>
                        <Button colorScheme="red" onClick={(e) => { e.stopPropagation(); onDeleteClick(forum.id); }}>
                            Törlés
                        </Button>
                    </Box>
                )}
            </Flex>
        </LinkBox>
    );
};

export default ForumListItem;
