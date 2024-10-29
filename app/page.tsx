'use client';

import React, { useEffect, useState } from 'react';
import styles from "./page.module.css";
import { useAppContext } from "./providers/AppProvider";
import GUI from "./components/GUI";
import { Note, Project } from "./models";
import { v4 as uuidv4 } from 'uuid';
import { useAuthContext } from './providers/AuthProvider';
import Link from 'next/link';

const IdeasList: React.FC = () => {
    const { authChecked, user } = useAuthContext();
    const { ideas, notes, projects, handleUpdateIdeas } = useAppContext();

    const [activeIdeas, setActiveIdeas] = useState<(Note | Project)[]>([]);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, index: number) => {
        event.dataTransfer.setData('text/plain', index.toString());
        // event.dataTransfer.dropEffect = 'move';
        setDraggedIndex(index);

        // const dragImage = event.currentTarget.cloneNode(true) as HTMLElement;
        // document.body.appendChild(dragImage);
        // event.dataTransfer.setDragImage(dragImage, 10, -10);
        // setTimeout(() => {
        //     document.body.removeChild(dragImage);
        // }, 0);
    };

    const handleDrop = async (event: React.DragEvent<HTMLDivElement>, index: number) => {
        event.preventDefault();

        const prevActiveIdeas = [...activeIdeas];

        if (draggedIndex === null) return;

        const updatedIdeas = [...ideas];
        const [movedIdea] = updatedIdeas.splice(draggedIndex, 1);
        updatedIdeas.splice(index, 0, movedIdea);

        setDraggedIndex(null);

        try {
            await handleUpdateIdeas(updatedIdeas);
        } catch (error) {
            console.error(error);
            setActiveIdeas(prevActiveIdeas);
            return;
        }

    };

    const newNote = new Note(
        null,
        '#ffffff',
        '#121212',
        uuidv4(),
        '',
        '',
        false,
        false,
        false,
        [],
        null
    );

    useEffect(() => {
        const updatedActiveIdeas = [
            ...notes.filter(note => !note.isArchived && !note.isTrash),
            ...projects.filter(project => !project.isArchived && !project.isTrash)
        ];

        const updatedActiveIdeasIds = ideas.filter(id =>
            updatedActiveIdeas.some(idea => idea.id === id)
        );

        const orderedActiveIdeas = updatedActiveIdeasIds.map(id =>
            updatedActiveIdeas.find(idea => idea.id === id)
        ).filter((idea): idea is Note | Project => idea !== undefined);

        setActiveIdeas(orderedActiveIdeas);

        console.log('notes', notes);
        console.log('projects', projects);
        console.log('ideas', ideas);
        console.log('orderedActiveIdeas', orderedActiveIdeas);

    }, [ideas, notes, projects]);

    return (
        <React.Fragment>
            {
                (!user && authChecked) && (
                    <p className={styles.notesText}><Link href={"/login"}>Login</Link> to save notes</p>
                )
            }
       
            <GUI operation={'create'} idea={newNote} />
            {
                activeIdeas.map((idea, index) => (
                    <React.Fragment key={idea.id}>
                        <div className={styles.spacer} />
                        <GUI
                            operation={'read'}
                            idea={idea}
                            draggableProps={{
                                onDragStart: (event) => handleDragStart(event, index),
                                onDrop: (event) => handleDrop(event, index),
                            }}
                        />
                    </React.Fragment>
                ))
            }
        </React.Fragment>
    );
};

export default function Ideas() {
    return (
        <main className={styles.page}>
            <IdeasList />
        </main>
    );
}
