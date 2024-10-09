'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { useAppContext } from '../providers/AppProvider';
<<<<<<< HEAD
import NoteBody from './NoteBody';
import NoteHeader from './NoteHeader';
import NoteFooter from './NoteFooter';
import styles from "./GUI.module.css"
import { Note } from '../models';
=======
import NoteBody from './NoteGUIBody';
import NoteHeader from './NoteGUIHeader';
import NoteFooter from './NoteGUIFooter';
import NoteNestedNotes from './NoteGUINestedNotes';
import styles from "./styles.module.css";
import { NestedNote, Note } from '../models';
import { v4 as uuidv4 } from 'uuid';
>>>>>>> origin/main

interface NoteGUIProps {
    operation: 'read' | 'create';
    note: Note
}

const NoteGUI: React.FC<NoteGUIProps> = ({ operation, note }) => {
    const { createNote, deleteNote, updateNote, setInfo } = useAppContext();

    // State for UI properties
    const initialOperation = operation;
    const [isModalMode, setIsModalMode] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isNoteOptionsMenuOpen, setIsNoteOptionsMenu] = useState(false);

    // State for content arrays properties
    const [contentArray, setContentArray] = useState([note.content]);

    // State for note properties
    const isArchived = note.isArchived;
    const isPinned = note.isPinned;
    const isTrash = note.isTrash;
    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);

    // Refs for DOM elements and indexes
    const index = useRef(0);
    const nestedIndex = useRef(0);
    const noteCreateRef = useRef<HTMLFormElement | null>(null);
    const noteEditRef = useRef<HTMLFormElement | null>(null);
    const noteOptionsMenuRef = useRef<HTMLDivElement | null>(null);
    const noteOptionsMenuRefButton = useRef<HTMLButtonElement | null>(null);

    const handleTitleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (isTrash) {
            return;
        }
        const newValue = event.target.value;
        if (newValue.length <= 1000) {
            if (newValue.length > 900) {
                setInfo([1000 - newValue.length + ' characters remaining.']);
            } else {
                setInfo(['']);
            }
            setTitle(newValue);
        };
    }

    const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (isTrash) {
            return;
        }
        const newValue = event.target.value;
        if (newValue.length <= 5000) {
            if (newValue.length > 4500) {
                setInfo([5000 - newValue.length + ' characters remaining.']);
            } else {
                setInfo(['']);
            }
            setContent(newValue);
            index.current = index.current + 1;
            setContentArray(
                [...contentArray.slice(0, index.current), newValue]
            );
        }
    }

    const handleResetNote = useCallback(() => {
        if (initialOperation === "create") {
            setContent('');
            setTitle('');
        }
        setIsModalMode(false);
        setContentArray([content]);
        setIsEditMode(false);
        index.current = 0;
        nestedIndex.current = 0;
    }, [initialOperation, content],);

    const handleUndo = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (index.current > 0) {
            index.current = index.current - 1;
            setContent(contentArray[index.current]);
        }
    };

    const handleRedo = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (index.current < contentArray.length - 1) {
            index.current = index.current + 1;
            setContent(contentArray[index.current]);
        }
    };

    const handleDeleteNote = async () => {
        try {
            await deleteNote(note.id);
            setInfo(['Note deleted']);
        } catch (error) {
            console.log(error);
        }
    };

    const handleNote = useCallback(() => {
        if (isTrash) {
            return;
        }

        const currentNote = {
            content: content,
            isArchived: isArchived,
            isPinned: isPinned,
            title: title,
            id: note.id,
        };

        const prevNote = note;

        if (initialOperation === 'create') {
            if (currentNote.title !== prevNote.title || currentNote.content !== prevNote.content) {
                createNote(currentNote as Note);
            } else {
                console.log("No Note Created");
            }
        } else {
            if (currentNote.title.trim().length === 0 && currentNote.content.trim().length === 0) {
                deleteNote(note.id);
                console.log("Deleted Note");
            } else {
                if (currentNote.title !== prevNote.title || currentNote.content !== prevNote.content || currentNote.isArchived !== prevNote.isArchived) {
                    updateNote(currentNote as Note);
                    console.log("Updated Note");
                } else {
                    console.log("No Note Updated");
                }
            }
        }

        handleResetNote();
    }, [isTrash, title, content, isArchived, isPinned, note, initialOperation, handleResetNote, createNote, deleteNote, updateNote]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleNote();
    };

    const handleClickOutside = useCallback((event: MouseEvent) => {
        event.stopPropagation();
        if (isNoteOptionsMenuOpen && noteOptionsMenuRef.current && !noteOptionsMenuRef.current.contains(event.target as Node) &&
            !(noteOptionsMenuRefButton.current && noteOptionsMenuRefButton.current.contains(event.target as Node))) {
            setIsNoteOptionsMenu(false);
        }

        if (isEditMode || isTrash) {
            if (initialOperation === 'create' && noteCreateRef.current && !noteCreateRef.current.contains(event.target as Node)) {
                handleNote();
            } else if (noteEditRef.current && !noteEditRef.current.contains(event.target as Node)) {
                handleNote();
            }
        }
    }, [isNoteOptionsMenuOpen, isEditMode, isTrash, initialOperation, handleNote]);

    const toggleArchive = async () => {
        await updateNote({ ...note, isArchived: !isArchived } as Note);
        setInfo([isArchived ? 'Note archived' : 'Note unarchived']);
        setIsNoteOptionsMenu(false);
    };

    const toggleDelete = async () => {
        if (initialOperation === 'create') {
            handleResetNote();
            setInfo(['Note deleted']);
        } else {
            await updateNote({ ...note, isTrash: !isTrash } as Note);
            setInfo([isTrash ? 'Note restored' : 'Note moved to trash']);
        }
        setIsNoteOptionsMenu(false);
    };

    const toggleModeTrue = () => {
        if (isTrash) {
            setInfo(['Cannot edit note in trash']);
        } else if (initialOperation === 'read') {
            setIsEditMode(true);
            setIsModalMode(true);
        } else {
            setIsEditMode(true);
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    useEffect(() => {
        const previousOverflow = document.body.style.overflowY;
        document.body.style.overflowY = isModalMode ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflowY = previousOverflow;
        };
    }, [isModalMode]);

    return (
        <div className={!isModalMode ? styles.container : styles.containerModal}>
            <form
                className={!isModalMode ? (initialOperation === 'create' ? styles.create : styles.read) : styles.noteEdit}
                onSubmit={handleSubmit} ref={initialOperation === 'create' ? noteCreateRef : noteEditRef}>
                <div
                    className={(initialOperation === 'read' && !isModalMode) ? styles.infoContainerRead : styles.infoContainer}
                >
                    <NoteHeader
                        initialOperation={initialOperation}
                        isEditMode={isEditMode}
                        isModalMode={isModalMode}
                        title={title}
                        handleTitleChange={handleTitleChange}
                        toggleModeTrue={toggleModeTrue}
                    />
                    <NoteBody
                        content={content}
                        handleContentChange={handleContentChange}
                        initialOperation={initialOperation}
                        isEditMode={isEditMode}
                        isModalMode={isModalMode}
                        toggleModeTrue={toggleModeTrue}
                    />
                </div>
                <NoteFooter
                    contentArray={contentArray}
                    initialOperation={initialOperation}
                    isArchived={isArchived}
                    isEditMode={isEditMode}
                    isNoteOptionsMenuOpen={isNoteOptionsMenuOpen}
                    isTrash={isTrash}
                    noteOptionsMenuRef={noteOptionsMenuRef}
                    noteOptionsMenuRefButton={noteOptionsMenuRefButton}
                    nestedIndex={nestedIndex}
                    index={index}
                    handleRedo={handleRedo}
                    handleUndo={handleUndo}
                    setIsNoteOptionsMenu={setIsNoteOptionsMenu}
                    toggleArchive={toggleArchive}
                    toggleDelete={toggleDelete}
                    handleDeleteNote={handleDeleteNote}
                />
            </form >
        </div>
    );
}

export default NoteGUI;