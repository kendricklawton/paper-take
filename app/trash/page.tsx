'use client'

import React from "react";
import NoteGUI from "../components/NoteGUI";
// import ProjectGUI from "../components/ProjectGUI";
import styles from "../page.module.css";
import { useAppContext } from "../providers/AppProvider";

export default function Trash() {
    const { notes } = useAppContext();
    const trashNotes = notes.filter(note => note.isTrash);

    return (
        <div className={styles.page}>
            {trashNotes.length === 0 ? (
                <div className={styles.pageTitle}><p>Empty Trash</p></div>
            ) : (
                trashNotes.map((note, index) => (
                    <React.Fragment key={note.id}>
                        <NoteGUI note={note} operation='read' key={note.id} />
                        <div className={styles.spacer} key={index} />
                    </React.Fragment>
                ))
            )}
        </div >
    );
}