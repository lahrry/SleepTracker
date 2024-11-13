import { Task } from './task-types';

export function createTask(title: string): Task {
    return {
        id: generateUniqueId(),
        title,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
    };
}

function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
}