import { User } from "./User";

export interface Comment {
    id: string;
    content: string;
    createdAt: Date;
    user: User;
    message: string;
}
