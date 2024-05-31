import { User } from "./User";
import { Comment } from "./comment";

export interface Forum {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    createdBy: User;
    commentsCount: number;
    lastComment: Comment | null;
}
