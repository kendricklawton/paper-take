'use client'

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
                trashNotes.map(note => (
                    <NoteGUI operation={'read'} note={note} key={note.id} />
                ))
            )}
        </div >
    );
}