 export interface Note {
    id: string;
    title: string;
    content: string;
    courseId?: string;
    assignmentId?: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}