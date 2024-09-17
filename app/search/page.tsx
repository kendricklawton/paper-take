'use client'

import { useContext } from 'react';
// import { AppContext } from '../context/AppProvider';
// import NoteGUI from "../components/NoteGUI";
import styles from "../page.module.css";

export default function Search() {
    // const { filteredNotes } = useContext(AppContext);
    // const searchNotes = filteredNotes.filter(note => !note.isTrash);

    return (
        <div className={styles.content}>
            {/* {searchNotes.length === 0 ? ( */}
                <h3>Search</h3>
            {/* ) : (
                searchNotes.map(note => (
                    <>
                        <div style={{
                            height: '1rem'
                        }} key={note.id} />
                        <NoteGUI note={note} mode='read' key={note.id} />
                    </>
                ))
            )} */}
        </div>
    );
}