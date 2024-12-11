'use client';

import React, { useEffect, useState } from 'react';
import styles from "./page.module.css";
import { useAppContext } from "./providers/AppProvider";
import GUI from "./components/GUI/GUI";
import { Note, Project } from "./models";

const IdeasList: React.FC = () => {
    const { ideas, notes, projects,
        // handleUpdateIdeas 
    } = useAppContext();

    const [activePinnedIdeas, setActivePinnedIdeas] = useState<(Note | Project)[]>([]);
    const [activeIdeas, setActiveIdeas] = useState<(Note | Project)[]>([]);
    // const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    // const handleDragStart = (event: React.DragEvent<HTMLDivElement>, index: number) => {
    //     event.dataTransfer.setData('text/plain', index.toString());
    //     // event.dataTransfer.dropEffect = 'move';
    //     setDraggedIndex(index);

    //     // const dragImage = event.currentTarget.cloneNode(true) as HTMLElement;
    //     // document.body.appendChild(dragImage);
    //     // event.dataTransfer.setDragImage(dragImage, 10, -10);
    //     // setTimeout(() => {
    //     //     document.body.removeChild(dragImage);
    //     // }, 0);
    // };

    // const handleDrop = async (event: React.DragEvent<HTMLDivElement>, index: number) => {
    //     event.preventDefault();

    //     const prevActiveIdeas = [...activeIdeas];

    //     if (draggedIndex === null) return;

    //     const updatedIdeas = [...ideas];
    //     const [movedIdea] = updatedIdeas.splice(draggedIndex, 1);
    //     updatedIdeas.splice(index, 0, movedIdea);

    //     setDraggedIndex(null);

    //     try {
    //         await handleUpdateIdeas(updatedIdeas);
    //     } catch (error) {
    //         console.error(error);
    //         setActiveIdeas(prevActiveIdeas);
    //         return;
    //     }

    // };

    const localId = new Date().toISOString();
    const newNote = new Note(
        null,
        '#ffffff',
        '#121212',
        localId,
        '',
        '',
        false,
        false,
        false,
        [],
        null
    );

    useEffect(() => {
        const updatedActivePinnedIdeas = [
            ...notes.filter(note => note.isPinned && !note.isArchived && !note.isTrash),
            ...projects.filter(project => project.isPinned && !project.isArchived && !project.isTrash)
        ];

        const updatedActiveIdeas = [
            ...notes.filter(note => !note.isArchived && !note.isPinned && !note.isTrash),
            ...projects.filter(project => !project.isArchived && !project.isPinned && !project.isTrash)
        ];

        // const updatedActiveIdeasIds = ideas.filter(id =>
        //     updatedActiveIdeas.some(idea => idea.id === id)
        // );

        // const orderedActiveIdeas = updatedActiveIdeasIds.map(id =>
        //     updatedActiveIdeas.find(idea => idea.id === id)
        // ).filter((idea): idea is Note | Project => idea !== undefined);

        setActivePinnedIdeas(updatedActivePinnedIdeas);
        setActiveIdeas(updatedActiveIdeas);

        console.log('notes', notes);
        console.log('projects', projects);
        console.log('ideas', ideas);
        // console.log('orderedActiveIdeas', orderedActiveIdeas);

    }, [ideas, notes, projects]);

    return (
        <React.Fragment>
            <GUI operation={'create'} idea={newNote} />
            {
                activePinnedIdeas.length > 0 &&
                <React.Fragment>
                    <div className={styles.spacer} />
                    <div className={styles.spacer} />
                    <div className={styles.pinnedTextContainer}>
                        <p>Pinned</p>
                    </div>
                </React.Fragment>
            }
            {
                activePinnedIdeas.map((idea,
                    // index
                ) => (
                    <React.Fragment key={idea.id}>
                        <div className={styles.spacer} />
                        <GUI
                            operation={'read'}
                            idea={idea}
                        // draggableProps={{
                        //     onDragStart: (event) => handleDragStart(event, index),
                        //     onDrop: (event) => handleDrop(event, index),
                        // }}
                        />
                    </React.Fragment>
                ))
            }
            {
                (activePinnedIdeas.length > 0 && activeIdeas.length > 0) &&
                <React.Fragment>
                    <div className={styles.spacer} />
                    <div className={styles.spacer} />
                    <div className={styles.pinnedTextContainer}>
                        <p>Normal</p>
                    </div>
                </React.Fragment>
            }
            {
                activeIdeas.map((idea,
                    // index
                ) => (
                    <React.Fragment key={idea.id}>
                        <div className={styles.spacer} />
                        <GUI
                            operation={'read'}
                            idea={idea}
                        // draggableProps={{
                        //     onDragStart: (event) => handleDragStart(event, index),
                        //     onDrop: (event) => handleDrop(event, index),
                        // }}
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
