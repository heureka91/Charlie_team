import React, { FC } from "react";
import { Forum } from "../../models/forum"; // Ensure the correct import
import { Grid, GridItem } from "@chakra-ui/react";
import ForumListItem from "./ForumList-Item"; // Ensure the correct import

interface ForumListProps {
    forums: Forum[];
    onEditClick: (forumId: string) => void;
    onDeleteClick: (forumId: string) => void;
}

const ForumList: FC<ForumListProps> = ({ forums, onEditClick, onDeleteClick }) => {
    return (
        <Grid
            sx={{
                gridTemplateColumns: "repeat(1, 1fr)",
                gap: 10,
                padding: 5,
                borderWidth: 2,
                borderRadius: "md",
                borderColor: "gray.300",
                backgroundColor: "gray.50",
            }}
        >
            {forums.map((forumItem: Forum) => (
                <GridItem key={forumItem.id}>
                    <ForumListItem
                        forum={forumItem}
                        onEditClick={onEditClick}
                        onDeleteClick={onDeleteClick}
                    />
                </GridItem>
            ))}
        </Grid>
    );
};

export default ForumList;
