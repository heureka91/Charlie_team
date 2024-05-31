import React, { FC } from "react";
import { Forum } from "../../models/Forum";
import { Grid, GridItem } from "@chakra-ui/react";
import ForumListItem from "./ForumList-Item";

interface ForumListProps {
    forums: Forum[];
    onEditClick: (forumId: string) => void;
    onDeleteClick: (forumId: string) => void;
    currentUser: string;
}

const ForumList: FC<ForumListProps> = ({ forums, onEditClick, onDeleteClick, currentUser }) => {
    return (
        <Grid
            sx={{
                gridTemplateColumns: "repeat(1, 1fr)",
                gap: 10,
                padding: 5,
                borderWidth: 2,
                borderRadius: "md",
                borderColor: "black.300",
                backgroundColor: "black.50",
            }}
        >
            {forums.map((forumItem: Forum) => (
                <GridItem key={forumItem.id}>
                    <ForumListItem
                        forum={forumItem}
                        onEditClick={onEditClick}
                        onDeleteClick={onDeleteClick}
                        currentUser={currentUser}
                    />
                </GridItem>
            ))}
        </Grid>
    );
};

export default ForumList;