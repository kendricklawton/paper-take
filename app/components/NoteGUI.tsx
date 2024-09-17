'use client';

import { AlarmOutlined, MoreVert, Archive, ArchiveOutlined, Bolt, Brush, ChevronLeft, ImageOutlined, NoteAddOutlined, NoteOutlined, PushPin, PushPinOutlined, RedoOutlined, UndoOutlined, DeleteForever, DeleteForeverOutlined, RestoreOutlined, RestoreFromTrashOutlined } from '@mui/icons-material';
import { Box, Button, IconButton, TextField, MenuItem } from '@mui/material';
import { useCallback, useContext, useEffect, useState, useRef } from 'react';
import { useAppContext } from '../providers/AppProvider';


import NoteHeader from './NoteHeader';
import NoteBody from './NoteBody';
// import NoteFooter from './NoteFooter';
import { Note } from '../models/note';
import styles from "./noteStyles.module.css"

// notes: Note[];
// filteredNotes: Note[];
// projects: Project[];
// filteredProjects: Project[];
// infoQueue: string[];
// addInfoToQueue: (info: string) => void;
// clearInfoQueue: () => void;
// createNote: () => void;
// deleteNote: (id: string) => void;
// addProject: (project: Project) => void;
// deleteProject: (id: string) => void;
// error: string | null;

export interface NoteGUIProps {
    mode: 'create' | 'read';
    note: Note;
}

export default function NoteGUI({ mode, note }: NoteGUIProps) {
    const { createNote, deleteNote } = useAppContext();

    const initialMode = mode;

    const [isEditMode, setIsEditMode] = useState(false);
    const [isInfoScroll, setIsInfoScroll] = useState(false);
    const [isNoteReminderMenuOpen, setIsNoteReminderMenu] = useState(false);
    const [isNoteOptionsMenuOpen, setIsNoteOptionsMenu] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);

    const [contentArray, setContentArray] = useState([note.content]);

    const isArchived = note.isArchived;
    const isPinned = note.isPinned;
    const isTrash = note.isTrash;
    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);

    const index = useRef(0);
    const noteCreateRef = useRef(null);
    const noteEditRef = useRef(null);
    const noteReminderMenuRef = useRef(null);
    const noteOptionsMenuRef = useRef(null);
    const noteOptionsMenuRefButton = useRef(null);
    const infoContainerRef = useRef(null);

    const toggleArchive = () => {
        // if (isArchived) {
        //     setInfoGeneral('Note unarchived')
        // } else {
        //     setInfoGeneral('Note archived')
        // }
        // setNotes(notes.map(note =>
        //     note.id === props.note.id ? { ...note, isArchived: !note.isArchived } : note
        // ));
    };

    const toggleEditModeTrue = () => {
        // if (isTrash) {
        //     setInfoGeneral('Cannot edit note in trash');
        // } else if (props.mode === 'read') {
        //     setIsEditMode(true);
        //     setIsViewMode(true);
        // } else {
        //     setIsEditMode(true);
        // }
    }

    const toggleDelete = () => {
        // if (initialMode === 'create') {
        //     handleResetNote();
        //     setInfoGeneral('Note deleted');
        // } else {

        //     if (isTrash) {
        //         setInfoGeneral('Note restored from trash')
        //     } else {
        //         setInfoGeneral('Note moved to trash')
        //     }

        //     setNotes(notes.map(note =>
        //         note.id === props.note.id ? { ...note, isTrash: !note.isTrash } : note
        //     ));
        // }

        // setIsNoteOptionsMenu(false);
    };

    const handleTitleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (isTrash) {
            return;
        }
        const newValue = event.target.value;
        if (newValue.length <= 1000) {
            if (newValue.length > 900) {
                // setInfoTitle(1000 - newValue.length + ' characters remaining.');
            } else {
                // setInfoTitle('');
            }

            setTitle(newValue);

        }
    };

    const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (isTrash) {
            return;
        }
        const newValue = event.target.value;

        if (newValue.length <= 5000) {
            if (newValue.length > 4500) {
                // setInfoContent(5000 - newValue.length + ' characters remaining.');
            } else {
                // setInfoContent('');
            }

            setContent(newValue);
            index.current = index.current + 1;
            setContentArray(
                [...contentArray.slice(0, index.current), newValue]
            );

        }
    };

    const handleResetNote = useCallback(() => {
        // if (initialMode === "create") {
        //     setContent('');
        //     setTitle('');
        //     setInfoContent('');
        //     setInfoTitle('');
        // }
        // setIsInfoScroll(false);
        // setIsViewMode(false);
        // setContentArray([content]);
        // setIsEditMode(false);
        // index.current = 0;

    }, [initialMode]);


    // const handleUndo = () => {
    //     if (index.current > 0) {
    //         index.current = index.current - 1;
    //         setContent(contentArray[index.current]);
    //     }
    // };

    // const handleRedo = () => {

    //     if (index.current < contentArray.length - 1) {
    //         index.current = index.current + 1;
    //         setContent(contentArray[index.current]);
    //     }

    // };

    // const handleNote = useCallback(() => {

    //     if (isTrash) {
    //         handleResetNote();
    //         return;
    //     }
    //     const note = {
    //         title: title,
    //         content: content,
    //         isArchived: isArchived,
    //         isPinned: isPinned,

    //     };

    //     const prevNote = props.note;

    //     if (initialMode === 'create') {
    //         if (note.title !== prevNote.title || note.content !== prevNote.content) {
    //             createNote(note);
    //             console.log("Created Note");
    //         } else {
    //             console.log("No Note Created");
    //         }
    //     } else {


    //         if (note.title.trim().length === 0 && note.content.trim().length === 0) {
    //             deleteNote(props.note.id);
    //             console.log("Deleted Note");
    //         } else {
    //             if (note.title !== prevNote.title || note.content !== prevNote.content || note.isArchived !== prevNote.isArchived) {
    //                 updateNote(note);
    //                 console.log("Updated Note");
    //             } else {
    //                 console.log("No Note Updated");
    //             }
    //         }
    //     }

    //     handleResetNote();
    // }, [isTrash, title, content, isArchived, isPinned, props.note, initialMode, handleResetNote, createNote, deleteNote, updateNote]);

    // const handleSubmit = (event) => {
    //     event.preventDefault();
    //     handleNote();
    // };

    // const handleClickOutside = useCallback((event) => {
    //     event.stopPropagation();
    //     if (isNoteOptionsMenuOpen && noteOptionsMenuRef.current && !noteOptionsMenuRef.current.contains(event.target) &&
    //         !noteOptionsMenuRefButton.current.contains(event.target)) {

    //         setIsNoteOptionsMenu(false);
    //     }

    //     if (isEditMode || isTrash) {
    //         if (initialMode === 'create' && noteCreateRef.current && !noteCreateRef.current.contains(event.target)) {

    //             handleNote();
    //         } else if (noteEditRef.current && !noteEditRef.current.contains(event.target)) {

    //             handleNote();
    //         }
    //     }
    // }, [isNoteOptionsMenuOpen, isEditMode, isTrash, initialMode, handleNote]);

    // useEffect(() => {
    //     document.addEventListener('mousedown', handleClickOutside);
    //     return () => {
    //         document.removeEventListener('mousedown', handleClickOutside);
    //     };
    // }, [handleClickOutside]);

    // useEffect(() => {
    //     const handleScroll = () => {
    //         if (infoContainerRef.current) {
    //             if (infoContainerRef.current.scrollTop > 0) {
    //                 setIsInfoScroll(true);
    //             } else {
    //                 setIsInfoScroll(false);
    //             }
    //         }

    //     };

    //     const container = infoContainerRef.current;
    //     if (container) {
    //         container.addEventListener('scroll', handleScroll);
    //     }

    //     return () => {
    //         if (container) {
    //             container.removeEventListener('scroll', handleScroll);
    //         }
    //     };
    // }, [isViewMode]);

    // useEffect(() => {
    //     const previousOverflow = document.body.style.overflowY;
    //     document.body.style.overflowY = isViewMode ? 'hidden' : 'auto';
    //     return () => {
    //         document.body.style.overflowY = previousOverflow;
    //     };
    // }, [isViewMode]);

    return (
        <div className={!isViewMode ? styles.container : styles.containerModal}>
            <Box component="form"
                className={!isViewMode ? (initialMode === 'create' ? styles.noteCreate : styles.noteRead) : styles.noteEdit}
                // onSubmit={handleSubmit} 
                ref={initialMode === 'create' ? noteCreateRef : noteEditRef}>
                <div
                    className={(initialMode === 'read' && !isViewMode) ? styles.infoContainerRead : styles.infoContainer}
                    ref={infoContainerRef}
                >
                    <NoteHeader
                        handleTitleChange={handleTitleChange}
                        initialMode={initialMode}
                        isEditMode={isEditMode}
                        isViewMode={isViewMode}
                        title={title}
                        toggleEditModeTrue={toggleEditModeTrue}
                    />
                    <NoteBody
                        content={content}
                        handleContentChange={handleContentChange}
                        initialMode={initialMode}  // Fixed the formatting here
                        isEditMode={isEditMode}
                        isViewMode={isViewMode}
                        toggleEditModeTrue={toggleEditModeTrue}
                    />
                </div>
                {/* <NoteFooter
                    contentArray={contentArray}
                    handleRedo={handleRedo}
                    handleUndo={handleUndo}
                    initialMode={initialMode}
                    isArchived={isArchived}
                    isEditMode={isEditMode}
                    isNoteOptionsMenuOpen={isNoteOptionsMenuOpen}
                    isNoteReminderMenuOpen={isNoteReminderMenuOpen}
                    isTrash={isTrash}
                    mode={props.mode}
                    noteOptionsMenuRef={noteOptionsMenuRef}
                    noteOptionsMenuRefButton={noteOptionsMenuRefButton}
                    noteReminderMenuRef={noteReminderMenuRef}
                    index={index}
                    setIsNoteOptionsMenu={setIsNoteOptionsMenu}
                    toggleArchive={toggleArchive}
                    toggleDelete={toggleDelete}
                /> */}
            </Box >
        </div>
    );
}