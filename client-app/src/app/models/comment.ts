export interface ChatComment {  // semantic-ui has a component called comment
    id: number;
    createdAt: Date;
    body: string;
    username: string;
    displayName: string;
    image: string;
}