export class Task {
    id: string;
    title: string;
    description?: string;
    status: 'not started' | 'in progress' | 'completed'; // Status values

    constructor(
        id: string,
        title: string,
        status: 'not started' | 'in progress' | 'completed', // Status values
        description?: string
    ) {
        if (!['not started', 'in progress', 'completed'].includes(status)) {
            throw new Error('Invalid status');
        }
        this.id = id;
        this.title = title;
        this.status = status;
        this.description = description;
    }

    static fromJSON(jsonString: string): Task | null {
        try {
            const { id, title, description, status } = JSON.parse(jsonString);

            // Validate status
            const validStatuses: Set<string> = new Set(['not started', 'in progress', 'completed']);
            if (!validStatuses.has(status)) {
                throw new Error('Invalid status');
            }

            return new Task(id, title, status, description);
        } catch (error) {
            console.error('Error parsing Task JSON:', error);
            return null;
        }
    }

    toJSON(): string {
        return JSON.stringify({
            id: this.id,
            title: this.title,
            description: this.description,
            status: this.status,
        });
    }
}