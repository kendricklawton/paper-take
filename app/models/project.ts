import { Task } from "./task";

export class Project {
    id: string;
    name: string;
    description: string;
    tasks: Task[];
    dueDate?: Date;

    constructor(
        id: string,
        name: string,
        description: string,
        tasks: Task[] = [],
        dueDate?: Date
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.tasks = tasks;
        this.dueDate = dueDate;
    }

    static fromJSON(jsonString: string): Project | null {
        try {
            const data: {
                id: string;
                name: string;
                description: string;
                tasks?: any[];
                dueDate?: string;
            } = JSON.parse(jsonString);

            const { id, name, description, tasks, dueDate } = data;

            // Validate required fields
            if (
                typeof id !== 'string' ||
                typeof name !== 'string' ||
                typeof description !== 'string'
            ) {
                throw new Error('Invalid data format: Missing or incorrect types for required fields');
            }

            // Parse dueDate
            const dueDateObj = dueDate ? new Date(dueDate) : undefined;

            if (dueDateObj && isNaN(dueDateObj.getTime())) {
                throw new Error('Invalid dueDate format');
            }

            // Parse images
            if (!Array.isArray(tasks)) {
                throw new Error("Expected tasks to be an array");
            }

            // Parse tasks
            const tasksArray: Task[] = Array.isArray(tasks)
                ? tasks
                    .map((task: any) => Task.fromJSON(JSON.stringify(task)))
                    .filter((task): task is Task => task !== null)
                : [];

            return new Project(
                id,
                name,
                description,
                tasksArray,
                dueDateObj
            );
        } catch (error) {
            console.error('Error parsing Project JSON:', error);
            return null;
        }
    }

    toJSON(): string {
        return JSON.stringify({
            id: this.id,
            name: this.name,
            description: this.description,
            tasks: this.tasks.map(task => JSON.parse(task.toJSON())), // Assuming toJSON returns JSON string
            dueDate: this.dueDate?.toISOString(),
        });
    }

    addTask(task: Task): Project {
        return new Project(this.id, this.name, this.description, [...this.tasks, task], this.dueDate);
    }

    removeTask(taskId: string): Project {
        return new Project(
            this.id,
            this.name,
            this.description,
            this.tasks.filter(task => task.id !== taskId),
            this.dueDate
        );
    }

    getTaskById(taskId: string): Task | undefined {
        return this.tasks.find(task => task.id === taskId);
    }

    validate(): boolean {
        return this.id.trim() !== '' && this.name.trim() !== '' && this.description.trim() !== '';
    }
}
