'use client'

import React from 'react';
import styles from "../page.module.css";
import { useAppContext } from "../providers/AppProvider";
import GUI from "../components/GUI";

import {
    Note,
    Project
} from "../models";
import { v4 as uuidv4 } from 'uuid';

const Notes: React.FC = () => {
    const { notes, projects } = useAppContext();

    const activeNotes: Note[] = notes.filter(note => !note.isArchived && !note.isTrash);
    const activeProjects: Project[] = projects.filter(project => !project.isArchived && !project.isTrash);
    const activeIdeas: (Note | Project)[] = [...activeNotes, ...activeProjects];

    const newNote = new Note(
        undefined,
        '#ffffff',
        '#121212',
        uuidv4(),
        '',
        '',
        false,
        false,
        false,
        [],
        undefined
    );

    return (
        <React.Fragment>
            <GUI operation={'create'} idea={newNote} />
            {activeIdeas.length === 0 ? (
                <div className={styles.pageText}>
                    <p>Ideas you create will appear here</p>
                </div>
            ) : (
                activeIdeas.map((idea, index) => (
                    <React.Fragment key={index}>
                        <div className={styles.spacer} />
                        { /* Todo - Create Draggable List */}
                        <GUI
                            key={idea.id}
                            operation={'read'}
                            idea={idea}
                        />
                    </React.Fragment>
                ))
            )}
        </React.Fragment>
    );
};


export default function Ideas() {
    return (
        <main className={styles.page}>
            <Notes />
        </main>
    );
}