interface Image {
    url: string;
    description?: string;
}

export class Note {
    id: string;
    title: string;
    content: string;
    isArchived: boolean;
    isPinned: boolean;
    isTrash: boolean;
    images: Image[];
    reminderDate?: Date;

    constructor(
        id: string,
        title: string,
        content: string,
        isArchived: boolean,
        isPinned: boolean,
        isTrash: boolean = false,
        images: Image[] = [],
        reminderDate?: Date
    ) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.isArchived = isArchived;
        this.isPinned = isPinned;
        this.isTrash = isTrash;
        this.images = images;
        this.reminderDate = reminderDate;
    }

    static fromJSON(jsonString: string): Note | null {
        try {
            const data: {
                id: string;
                title: string;
                content: string;
                isArchived: boolean;
                isPinned: boolean;
                isTrash: boolean;
                images?: any[];
                reminderDate?: string;
            } = JSON.parse(jsonString);

            const { id, title, content, isArchived, isPinned, isTrash,  images, reminderDate } = data;

            // Validate required fields
            if (
                typeof id !== 'string' ||
                typeof title !== 'string' ||
                typeof content !== 'string' ||
                typeof isArchived !== 'boolean' ||
                typeof isPinned !== 'boolean' ||
                typeof isTrash !== 'boolean'
            ) {
                throw new Error('Invalid data format: Missing or incorrect types for required fields');
            }

            // Parse reminderDate
            const reminderDateObj = reminderDate ? new Date(reminderDate) : undefined;

            if (reminderDateObj && isNaN(reminderDateObj.getTime())) {
                throw new Error('Invalid reminderDate format');
            }

            // Parse images
            if (!Array.isArray(images)) {
                throw new Error("Expected images to be an array");
            }

            const imagesArray: Image[] = images
                .map(image => ({
                    url: image.url,
                    description: image.description
                }))
                .filter((image: any): image is Image => typeof image.url === 'string');

            // Create and return Note instance
            return new Note(
                id,
                title,
                content,
                isArchived,
                isPinned,
                isTrash,
                imagesArray,
                reminderDateObj
            );
        } catch (error) {
            console.error('Error parsing Note JSON:', error);
            return null;
        }
    }

    toJSON(): string {
        return JSON.stringify({
            id: this.id,
            title: this.title,
            content: this.content,
            isPinned: this.isPinned,
            isTrash: this.isTrash,
            images: this.images,
            reminderDate: this.reminderDate?.toISOString(),
        });
    }

    validate(): boolean {
        return this.id.trim() !== '' && this.title.trim() !== '' && this.content.trim() !== '';
    }
}
