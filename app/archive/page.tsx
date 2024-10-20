'use client'

import React from "react";
import GUI from "../components/GUI";
import styles from "../page.module.css";
import { useAppContext } from "../providers/AppProvider";
import {
    Note,
    Project
} from "../models";

export default function Archive() {
    const {
        notes,
        projects,
    } = useAppContext();

    const archiveNotes = notes.filter(note => note.isArchived && !note.isTrash);
    const archiveProjects = projects.filter(project => project.isArchived && !project.isTrash);

    const archiveIdeas: (Note | Project)[] = [...archiveNotes, ...archiveProjects];

    return (
        <div className={styles.page}>
            {
                archiveIdeas.length === 0 &&
                <React.Fragment>
                    <h2>Archive is empty</h2>
                    <p>Archive contains all your archived notes and projects.</p>
                </React.Fragment>
            }
            {archiveIdeas.length > 0 && (
                archiveIdeas.map((idea, index) => (
                    <React.Fragment key={index}>
                        <div className={styles.spacer} />
                        <GUI
                            key={idea.id}
                            operation={'read'}
                            idea={idea}
                        />
                    </React.Fragment>
                ))
            )}
        </div >
    );
}