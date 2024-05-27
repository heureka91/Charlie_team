import { user } from './user';

export interface Comment {
    id: string;
    message: string;
    createdAt: Date;
    user: user;
}
