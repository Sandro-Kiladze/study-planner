export interface Assignment {
    id: string;
    title: string;
    description?: string;
    dueDate: Date;
    courseId: string;
    status: 'pending' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    createdAt: Date;
    updatedAt: Date;

}
