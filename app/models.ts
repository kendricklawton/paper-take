export class NestedNote {
    id: string;
    title: string;
    content: string;

    constructor(
        id: string,
        title: string,
        content: string
    ) {
        this.id = id;
        this.title = title;
        this.content = content;
    }

    static fromJSON(jsonString: string): NestedNote | null {
        try {
            const {
                id, title,
                content
            } = JSON.parse(jsonString);

            // Todo - Add Error Handling

            return new NestedNote(
                id,
                title,
                content
            );
        } catch (error) {
            console.error('Failed to parse JSON:', error);
            return null;
        }
    }

    toJson(): string {
        return JSON.stringify({
            id: this.id,
            title: this.title,
            content: this.content
        });
    }
}

export class Note {
    createdAt: Date | undefined;
    id: string;
    title: string;
    content: string;
    isArchived: boolean;
    isPinned: boolean;
    isTrash: boolean;
    images: string[];
    // nestedNotes: NestedNote[];
    reminder?: Date;

    constructor(
        createdAt: Date | undefined,
        id: string,
        title: string,
        content: string,
        isArchived: boolean,
        isPinned: boolean,
        isTrash: boolean,
        images: string[] = [],
        // nestedNotes: NestedNote[] = [],
        reminder?: Date
    ) {
        this.createdAt = createdAt;
        this.id = id;
        this.title = title;
        this.content = content;
        this.isArchived = isArchived;
        this.isPinned = isPinned;
        this.isTrash = isTrash;
        this.images = images;
        // this.nestedNotes = nestedNotes;
        this.reminder = reminder;
    }

    static fromJSON(jsonString: string): Note | null {
        try {
            const { createdAt, id, title, content, isArchived,
                isPinned, isTrash, reminder, images = [],
                // nestedNotes = []
            } = JSON.parse(jsonString);

            // Todo - Add Error Handling

            // const parsedNestedNotes = nestedNotes
            //     .map((nestedNote: NestedNote) => NestedNote
            //         .fromJSON(JSON.stringify(nestedNote)))
            //     .filter((note: NestedNote | null) => note !== null) as NestedNote[];

            return new Note(
                createdAt ? new Date(createdAt) : undefined,
                id,
                title,
                content,
                isArchived,
                isPinned,
                isTrash,
                images,
                // parsedNestedNotes,
                reminder ? new Date(reminder) : undefined
            );
        } catch (error) {
            console.error('Failed to parse JSON:', error);
            return null;
        }
    }

    toJSON(): string {
        return JSON.stringify({
            createdAt: this.createdAt?.toISOString(),
            id: this.id,
            title: this.title,
            content: this.content,
            isArchived: this.isArchived,
            isPinned: this.isPinned,
            isTrash: this.isTrash,
            images: this.images,
            // nestedNotes: this.nestedNotes.map(nestedNote => nestedNote.toJson()),
            reminder: this.reminder?.toISOString() || null
        });
    }
}

export class Task {
    createdAt: Date | undefined;
    id: string;
    title: string;
    description: string;
    dueDate: Date | undefined;
    status: 'new' | 'active' | 'closed';

    constructor(
        createdAt: Date | undefined,
        id: string,
        title: string,
        description: string,
        dueDate: Date | undefined,
        status: 'new' | 'active' | 'closed',
    ) {
        if (!['new', 'active', 'closed'].includes(status)) {
            throw new Error('Invalid status');
        }
        this.createdAt = createdAt;
        this.id = id;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.status = status;
    }

    static fromJSON(jsonString: string): Task | null {
        try {
            const {
                createdAt,
                id,
                title,
                description,
                status,
                dueDate
            } = JSON.parse(jsonString);

            if (!id || !title || !status) {
                throw new Error("Missing required properties");
            }

            const validStatuses: Set<string> = new Set(['new', 'active', 'closed']);
            if (!validStatuses.has(status)) {
                throw new Error('Invalid status');
            }

            return new Task(
                createdAt ? new Date(createdAt) : undefined,
                id,
                title,
                description,
                dueDate ? new Date(dueDate) : undefined,
                status as 'new' | 'active' | 'closed',
            );
        } catch (error) {
            console.error('Error parsing Task JSON:', error);
            return null;
        }
    }

    toJSON(): string {
        return JSON.stringify({
            createdAt: this.createdAt?.toISOString(),
            id: this.id,
            title: this.title,
            description: this.description,
            status: this.status,
            dueDate: this.dueDate?.toISOString()
        });
    }
}

export class Project {
    createdAt: Date | undefined;
    id: string;
    title: string;
    description: string;
    dueDate: Date | undefined;
    isArchived: boolean;
    isPinned: boolean;
    isTrash: boolean;
    tasks: Task[];

    constructor(
        createdAt: Date | undefined,
        id: string,
        title: string,
        description: string,
        dueDate: Date | undefined,
        isArchived: boolean,
        isPinned: boolean,
        isTrash: boolean,
        tasks: Task[] = [],
    ) {
        this.createdAt = createdAt;
        this.id = id;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.isArchived = isArchived;
        this.isPinned = isPinned;
        this.isTrash = isTrash;
        this.tasks = tasks;
    }

    static fromJSON(jsonString: string): Project | null {
        try {
            const {
                createdAt,
                id,
                title,
                description,
                dueDate,
                isArchived,
                isPinned,
                isTrash,
                tasks = []
            } = JSON.parse(jsonString);

            // Todo - Add Error Handling

            const parsedTasks = tasks
            .map((task: Task) => Task
            .fromJSON(JSON.stringify(task)))
            .filter((task: Task) => task !== null) as Task[];

            return new Project(
                createdAt ? new Date(createdAt) : undefined,
                id,
                title,
                description,
                dueDate ? new Date(dueDate) : undefined,
                isArchived,
                isPinned,
                isTrash,
                parsedTasks,
            );
        } catch (error) {
            console.error('Failed to parse Project JSON:', error);
            return null;
        }
    }

    toJSON(): string {
        return JSON.stringify({
            createdAt: this.createdAt?.toISOString(),
            id: this.id,
            title: this.title,
            description: this.description,
            isArchived: this.isArchived,
            isPinned: this.isPinned,
            isTrash: this.isTrash,
            tasks: this.tasks.map(task => JSON.parse(task.toJSON())),
            dueDate: this.dueDate?.toISOString() || null,
        });
    }

    toString(): string {
        return `Project: ${this.title} (ID: ${this.id})`;
    }
}