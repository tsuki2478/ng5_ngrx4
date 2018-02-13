export interface Task {
    id?: string;
    desc: string;
    completed: boolean;
    priority: string;
    dueDate?: Date;
    reminder?: Date;
    remark?: string;
    createDate: Date;
    ownerId?: string;
    participantIds: string[];
    taskListId: string;
}