export interface User {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
}

export interface Comment {
    id: string;
    message: string;
    createdAt: Date;
    user: User;
}

export interface Forum {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    createdBy: User;
    commentsCount: number;
    lastComment: Comment | null;
}
