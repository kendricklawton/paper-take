'use client'

import { useAppContext } from '../providers/AppProvider';
import NoteGUI from "../components/NoteGUI";
import styles from "../page.module.css";
import { Note } from '../models';

export default function Search() {
    const { filteredItems } = useAppContext();
    const searchNotes = filteredItems.filter(note => !note.isTrash);

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
                        <NoteGUI note={note as Note} operation='read' key={note.id} />
                    </>
                ))
            )}
        </div>
    );
}