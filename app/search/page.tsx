'use client'

import { useAppContext } from '../providers/AppProvider';
import NoteGUI from "../components/NoteGUI";
import styles from "../page.module.css";

export default function Search() {
    const { filteredNotes } = useAppContext();
    const searchNotes = filteredNotes.filter(note => !note.isTrash);

    return (
        <div className={styles.content}>
            {searchNotes.length === 0 ? (
                <div className={styles.pageTitle}>
                    <p>Search</p>
                </div>
            ) : (
                searchNotes.map(note => (
                    <>
                        <div style={{
                            height: '1rem'
                        }} key={note.id} />
                        <NoteGUI note={note} operation='read' key={note.id} />
                    </>
                ))
            )}
        </div>
    );
}