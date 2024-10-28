'use client';

import React, {useEffect, useState } from 'react';
import styles from "./page.module.css";
import { useAppContext } from "./providers/AppProvider";
import GUI from "./components/GUI";
import { Note, Project } from "./models";
import { v4 as uuidv4 } from 'uuid';
import { useAuthContext } from './providers/AuthProvider';
import Link from 'next/link';

const IdeasList: React.FC = () => {
    const { authChecked, user } = useAuthContext();
    const { ideasIds, notes, projects } = useAppContext();

    const [activeIdeas, setActiveIdeas] = useState<(Note | Project)[]>([]);
    const [activeIdeasIds, setActiveIdeasIds] = useState<string[]>([]);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, index: number) => {
        event.dataTransfer.setData('text/plain', '');
        setDraggedIndex(index);
    }

    const handleDrop = (index: number) => {
        if (draggedIndex === null) return;
        const updatedIdeas = [...activeIdeas];
        const [movedIdea] = updatedIdeas.splice(draggedIndex, 1);
        updatedIdeas.splice(index, 0, movedIdea);
        setActiveIdeas(updatedIdeas);
        setDraggedIndex(null);
    }

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

        const updatedActiveIdeasIds = ideasIds.filter(id => updatedActiveIdeas.some(idea => idea.id === id));

        setActiveIdeas(updatedActiveIdeas);
        setActiveIdeasIds(updatedActiveIdeasIds);
        
    }, [ideasIds, notes, projects]);

    // console.log('activeIdeas', activeIdeas);
    console.log('activeIdeasIds', activeIdeasIds);

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
                                onDrop: () => handleDrop(index),
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
