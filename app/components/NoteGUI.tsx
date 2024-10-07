'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { useAppContext } from '../providers/AppProvider';
import NoteBody from './NoteGUIBody';
import NoteHeader from './NoteGUIHeader';
import NoteFooter from './NoteGUIFooter';
import NoteNestedNotes from './NoteGUINestedNotes';
import styles from "./GUI.module.css"
import { NestedNote, Note } from '../models';
import { v4 as uuidv4 } from 'uuid';

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
    const [isNestedMode, setIsNestedMode] = useState(false);
    const [isNoteOptionsMenuOpen, setIsNoteOptionsMenu] = useState(false);

    // State for content arrays properties
    const [contentArray, setContentArray] = useState([note.content]);
    const [nestedContentArray, setNestedContentArray] = useState(['']);

    // State for nested note properties
    const [nestedNoteId, setNestedNoteId] = useState('');
    const [nestedNoteContent, setNestedContent] = useState('');
    const [nestedNoteTitle, setNestedTitle] = useState('');

    // State for note properties
    const isArchived = note.isArchived;
    const isPinned = note.isPinned;
    const isTrash = note.isTrash;
    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);
    const [nestedNotes, setNestedNotes] = useState<NestedNote[]>(note.nestedNotes);
    const [prevNestedNotes, setPrevNestedNotes] = useState<NestedNote[]>([]);

    // Refs for DOM elements and indexes
    const index = useRef(0);
    const nestedIndex = useRef(0);
    const noteCreateRef = useRef<HTMLFormElement | null>(null);
    const noteEditRef = useRef<HTMLFormElement | null>(null);
    const noteOptionsMenuRef = useRef<HTMLDivElement | null>(null);
    const noteOptionsMenuRefButton = useRef<HTMLButtonElement | null>(null);

    const isUndoNestedNote = prevNestedNotes.length > 0;

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
            if (isNestedMode) {
                setNestedTitle(newValue);
            } else {
                setTitle(newValue);
            }
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
            if (isNestedMode) {
                setNestedContent(newValue);
                nestedIndex.current = nestedIndex.current + 1;
                setNestedContentArray(
                    [...nestedContentArray.slice(0, nestedIndex.current), newValue]
                );
            } else {
                setContent(newValue);
                index.current = index.current + 1;
                setContentArray(
                    [...contentArray.slice(0, index.current), newValue]
                );
            }
        }
    }

    const handleResetNote = useCallback(() => {
        if (initialOperation === "create") {
            setContent('');
            setTitle('');
            setNestedContent('');
            setNestedTitle('');
            setNestedNotes([]);
        }
        setIsModalMode(false);
        setContentArray([content]);
        setNestedContentArray([nestedNoteContent]);
        setIsNestedMode(false);
        setIsEditMode(false);
        index.current = 0;
        nestedIndex.current = 0;
    }, [initialOperation, content, nestedNoteContent],);

    const handlePushToNestedNote = (nestedNote: NestedNote) => {
        setNestedNoteId(nestedNote.id);
        setNestedTitle(nestedNote.title);
        setNestedContent(nestedNote.content);
        setIsNestedMode(true);
        console.log("Pushing To Nested Note: " + JSON.stringify(nestedNote));
    };

    const handleUndo = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (isNestedMode) {
            if (nestedIndex.current > 0) {
                nestedIndex.current = nestedIndex.current - 1;
                setNestedContent(nestedContentArray[nestedIndex.current]);
            }
        } else {
            if (index.current > 0) {
                index.current = index.current - 1;
                setContent(contentArray[index.current]);
            }
        }
    };

    const handleRedo = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (isNestedMode) {
            if (nestedIndex.current < nestedContentArray.length - 1) {
                nestedIndex.current = nestedIndex.current + 1;
                setNestedContent(nestedContentArray[nestedIndex.current]);
            }
        } else {
            if (index.current < contentArray.length - 1) {
                index.current = index.current + 1;
                setContent(contentArray[index.current]);
            }
        }
    };

    const handleDeleteNote = async () => {
        // setActionToConfirm('deleteNote');
        // setShowDialog(true);
        try {
            await deleteNote(note.id);
            setInfo(['Note deleted']);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteNestedNote = () => {
        // setActionToConfirm('deleteNestedNote');
        // setShowDialog(true);
        setNestedTitle('');
        setNestedContent('');
        setNestedContentArray(['']);
        setIsNestedMode(false);
        nestedIndex.current = 0;
        setPrevNestedNotes(nestedNotes);
        const updatedNestedNotes = nestedNotes.filter(note => note.id !== nestedNoteId);
        setNestedNotes(updatedNestedNotes);
        setIsNestedMode(false);
        setInfo(['Nested Note Deleted']);
    };

    const handleUndoDeletedNestedNote = () => {
        setNestedNotes(prevNestedNotes);
        setInfo(['Deleted Nested Note Restored']);
        setPrevNestedNotes([]);
    }

    const handleCompareNestedNotesDifferent = (notes1: NestedNote[], notes2: NestedNote[]): boolean => {
        if (notes1.length !== notes2.length) return true;

        for (let i = 0; i < notes1.length; i++) {
            const note1 = notes1[i];
            const note2 = notes2[i];

            if (
                note1.title !== note2.title ||
                note1.content !== note2.content ||
                note1.id !== note2.id
            ) {
                return true;
            }
        }
        return false;
    };

    const handleNestedNote = useCallback(() => {

        const currentNestedNote = new NestedNote(
            nestedNoteId,
            nestedNoteTitle,
            nestedNoteContent
        );

        console.log("Current Nested Note: " + JSON.stringify(currentNestedNote));

        let updatedNestedNotes = nestedNotes;

        if (currentNestedNote.id === "" && (currentNestedNote.title.trim().length !== 0 || currentNestedNote.content.trim().length !== 0)) {
            console.log("Adding Nested Note");
            currentNestedNote.id = uuidv4();
            updatedNestedNotes = [...nestedNotes, currentNestedNote];
        } else if (currentNestedNote.id !== "" && (currentNestedNote.title.trim().length !== 0 || currentNestedNote.content.trim().length !== 0)) {
            console.log("Updating Nested Note");
            updatedNestedNotes = nestedNotes.map((note) =>
                note.id === nestedNoteId ? currentNestedNote : note
            );
        } else if (currentNestedNote.id !== "" && (currentNestedNote.title === "" && currentNestedNote.content === "")) {
            console.log("Deleting Nested Note");
            updatedNestedNotes = nestedNotes.filter(note => note.id !== currentNestedNote.id);
        } else {
            console.log("No Nested Note Added/Updated");
        }

        setNestedNotes(updatedNestedNotes);
        setIsNestedMode(false);
        setNestedTitle('');
        setNestedNoteId('');
        setNestedContent('');
        setNestedContentArray(['']);
        nestedIndex.current = 0;

        return updatedNestedNotes;

    }, [nestedNoteContent, nestedNoteId, nestedNoteTitle, nestedNotes]);


    const handleNote = useCallback(() => {
        if (isTrash) {
            return;
        }

        let currentNestedNotes: NestedNote[] = [];

        if (isNestedMode) {
            console.log("Handling Nested Note");
            currentNestedNotes = handleNestedNote();
            console.log("Completed Handling Nested Note");
        } else {
            currentNestedNotes = nestedNotes;
        }

        console.log("Current Nested Notes: " + JSON.stringify(currentNestedNotes));

        const currentNote = {
            content: content,
            isArchived: isArchived,
            isPinned: isPinned,
            nestedNotes: currentNestedNotes,
            title: title,
            id: note.id,
        };

        const prevNote = note;

        if (initialOperation === 'create') {
            if (currentNote.title !== prevNote.title || currentNote.content !== prevNote.content || currentNote.nestedNotes.length > 0) {
                createNote(currentNote as Note);
            } else {
                console.log("No Note Created");
            }
        } else {
            const nestedNotesChanged = handleCompareNestedNotesDifferent(nestedNotes, prevNote.nestedNotes);

            if (currentNote.title.trim().length === 0 && currentNote.content.trim().length === 0 && currentNote.nestedNotes.length === 0) {
                deleteNote(note.id);
                console.log("Deleted Note");
            } else {
                if (currentNote.title !== prevNote.title || currentNote.content !== prevNote.content || nestedNotesChanged || currentNote.isArchived !== prevNote.isArchived) {
                    updateNote(currentNote as Note);
                    console.log("Updated Note");
                } else {
                    console.log("No Note Updated");
                }
            }
        }

        handleResetNote();
    }, [isTrash, nestedNotes, isNestedMode, title, content, isArchived, isPinned, note, initialOperation, handleResetNote, handleNestedNote, createNote, deleteNote, updateNote]);

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
        <div className={!isModalMode ? styles.container : styles.containerNote}>
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
                        isNestedMode={isNestedMode}
                        nestedNoteTitle={nestedNoteTitle}
                        title={title}
                        handleTitleChange={handleTitleChange}
                        toggleModeTrue={toggleModeTrue}
                    />
                    <NoteBody
                        content={content}
                        handleContentChange={handleContentChange}
                        initialOperation={initialOperation}
                        isEditMode={isEditMode}
                        isNestedMode={isNestedMode}
                        isModalMode={isModalMode}
                        nestedNoteContent={nestedNoteContent}
                        toggleModeTrue={toggleModeTrue}
                    />
                </div>
                <NoteNestedNotes
                    isNestedMode={isNestedMode}
                    nestedNotes={nestedNotes}
                    handlePushToNestedNote={handlePushToNestedNote}
                    toggleModeTrue={toggleModeTrue}
                />
                <NoteFooter
                    contentArray={contentArray}
                    initialOperation={initialOperation}
                    isArchived={isArchived}
                    isEditMode={isEditMode}
                    isNestedMode={isNestedMode}
                    isNoteOptionsMenuOpen={isNoteOptionsMenuOpen}
                    isTrash={isTrash}
                    isUndoNestedNote={isUndoNestedNote}
                    nestedContentArray={nestedContentArray}
                    noteOptionsMenuRef={noteOptionsMenuRef}
                    noteOptionsMenuRefButton={noteOptionsMenuRefButton}
                    nestedIndex={nestedIndex}
                    index={index}
                    handleNestedNote={handleNestedNote}
                    handleUndoDeletedNestedNote={handleUndoDeletedNestedNote}
                    handleRedo={handleRedo}
                    handleUndo={handleUndo}
                    setIsNestedMode={setIsNestedMode}
                    setIsNoteOptionsMenu={setIsNoteOptionsMenu}
                    toggleArchive={toggleArchive}
                    toggleDelete={toggleDelete}
                    handleDeleteNote={handleDeleteNote}
                    handleDeleteNestedNote={handleDeleteNestedNote}
                />
            </form >
        </div>
    );
}

export default NoteGUI;