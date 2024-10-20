'use client'

import React from "react";
import GUI from "../components/GUI";
import styles from "../page.module.css";
import { useAppContext } from "../providers/AppProvider";
import {
    Note,
    Project
} from "../models";

export default function Trash() {
    const {
        notes,
        projects,
    } = useAppContext();


    const trashNotes = notes.filter(note => note.isTrash);
    const trashProjects = projects.filter(project => project.isTrash);
    const trashIdeas: (Note | Project)[] = [...trashNotes, ...trashProjects];

    return (
            <div className={styles.page}>
                {
                    trashIdeas.length > 0 && (
                        trashIdeas.map((idea, index) => (
                            <React.Fragment key={index}>
                                <div className={styles.spacer} />
                                <GUI
                                    key={idea.id}
                                    operation={'read'}
                                    idea={idea}
                                />
                            </React.Fragment>
                        )
                        )
                    )}
            </div >
    );
}