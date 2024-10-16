'use client'

import React from "react";
import GUI from "../components/GUI";
import styles from "../page.module.css";
import { useAppContext } from "../providers/AppProvider";
import {
    Note,
    Project
} from "../models";
import { StyledTextButton } from "../components/Styled";

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
            <div className={styles.pageTitle}>
                <p>Ideas in Trash are deleted after 7 days</p>
            </div>
            {trashIdeas.length === 0 ? (
                <React.Fragment>
                    <div className={styles.spacer} />
                    {trashIdeas.length > 0 ? (<StyledTextButton>Empty Trash</StyledTextButton>) : <p>No Ideas In Trash</p>}
                </React.Fragment>
            ) : (
                trashIdeas.map((idea, index) => (
                    <React.Fragment key={index}>
                        <div className={styles.spacer}>
                        </div>
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