'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { useAppContext } from '../../providers/AppProvider';
import GUIBody from './GUIBody';
import GUIHeader from './GUIHeader';
import GUIFooter from './GUIFooter';
import styles from "./GUI.module.css"
import { Note, Project } from '../../models';
import { Box } from '@mui/material';
import { StyledIconButton } from '../Styled';
import { AlarmAddOutlined, CloseOutlined } from '@mui/icons-material';
import { Timestamp } from 'firebase/firestore';
import PopUpModal from '../PopUpModal/PopUpModal';
import React from 'react';

interface GUIProps {
    draggableProps?: {
        onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;
        onDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
        onDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
    };
    operation: 'read' | 'create';
    idea: Note | Project;
}

const GUI: React.FC<GUIProps> = ({
    operation,
    idea: idea,
}) => {
    const { createNote, deleteNote, updateNote, setInfo } = useAppContext();
    const initialOperation = operation;

    const [isModalMode, setIsModalMode] = useState(false);
    const [isPopUpModalOpen, setIsPopUpModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isBackgroundMenuOpen, setIsBackgroundMenu] = useState(false);
    const [isFontMenuOpen, setIsFontMenu] = useState(false);
    const [isReminderMenuOpen, setIsReminderMenu] = useState(false);
    const [isOptionsMenuOpen, setIsOptionsMenu] = useState(false);
    const [isHovering, setIsHovering] = useState<boolean>(false);
    const [focus, setFocus] = useState<'title' | 'content' | ''>('');

    const isArchived = idea.isArchived;
    const isPinned = idea.isPinned;
    const isTrash = idea.isTrash;
    const [title, setTitle] = useState(idea.title);
    const [content, setContent] = useState(idea.type === 'note' ? idea.content : '');
    const [contentArray, setContentArray] = useState([idea.type === 'note' ? idea.content : '']);
    const [reminder, setReminder] = useState(idea.reminder);
    const [backgroundColor, setBackgroundColor] = useState(idea.type === 'note' ? idea.backgroundColor : '#ffffff');
    const [backgroundColorDark, setBackgroundColorDark] = useState(idea.type === 'note' ? idea.backgroundColorDark : '#121212');
    const [scrollPosition, setScrollPosition] = useState(0);

    const index = useRef(0);
    const infoRef = useRef<HTMLDivElement | null>(null);
    const nestedIndex = useRef(0);
    const noteCreateRef = useRef<HTMLFormElement | null>(null);
    const noteEditRef = useRef<HTMLFormElement | null>(null);
    const backgroundMenuRef = useRef<HTMLDivElement | null>(null);
    const backgroundMenuRefButton = useRef<HTMLButtonElement | null>(null);
    const fontMenuRef = useRef<HTMLDivElement | null>(null);
    const fontMenuRefButton = useRef<HTMLButtonElement | null>(null);
    const reminderMenuRef = useRef<HTMLDivElement | null>(null);
    const reminderMenuRefButton = useRef<HTMLButtonElement | null>(null);
    const optionsMenuRef = useRef<HTMLDivElement | null>(null);
    const optionsMenuRefButton = useRef<HTMLButtonElement | null>(null);

    const formattedDate = reminder ? new Date(reminder.seconds * 1000).toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }) : undefined;

    const handleClearSelection = () => {
        const selection = window.getSelection();
        if (selection) {
            selection.removeAllRanges();
        }
    };

    const handleTitleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (isTrash || !isEditMode) return;
        const newValue = event.target.value;
        if (newValue.length <= 1000) {
            setTitle(newValue);
        }
        if (newValue.length > 900) {
            setInfo(`${1000 - newValue.length} characters remaining.`);
        }
    };

    const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (isTrash || !isEditMode) return;
        const newValue = event.target.value;
        if (newValue.length <= 5000) {
            setContent(newValue);
            index.current += 1;
            setContentArray([...contentArray.slice(0, index.current), newValue]);
        }
        if (newValue.length > 4500) {
            setInfo(`${5000 - newValue.length} characters remaining.`);
        }
    };

    const handleReminderMenu = () => {
        if (isTrash) {
            setInfo('Cannot edit note in trash');
        } else {
            setIsReminderMenu(prev => !prev);
        }
    };

    const handleResetNote = useCallback(() => {
        handleClearSelection();

        if (initialOperation === 'create') {
            setContent('');
            setTitle('');
            setBackgroundColor('#ffffff');
            setBackgroundColorDark('#121212');
            setReminder(undefined);
        }

        setIsModalMode(false);
        setContentArray([content]);
        setIsEditMode(false);
        setIsHovering(false);

        index.current = 0;
        nestedIndex.current = 0;
        if (infoRef.current) {
            infoRef.current.scrollTo(0, 0);
        }

        window.scrollTo(0, 0);
    }, [initialOperation, content]);

    const handleUndo = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (index.current > 0) {
            index.current -= 1;
            setContent(contentArray[index.current]);
        }
    };

    const handleRedo = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (index.current < contentArray.length - 1) {
            index.current += 1;
            setContent(contentArray[index.current]);
        }
    };

    const handleDeleteNote = async () => {
        setIsPopUpModalOpen(true);
    };

    const handleModalClose = async (confirmed: boolean) => {
        setIsPopUpModalOpen(false);

        if (confirmed) {
            try {
                if (isTrash) {
                    setIsPopUpModalOpen(true);
                    await deleteNote(idea as Note);
                    setInfo('Note deleted');
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleNote = useCallback(async () => {
        if (idea.type !== 'note') {
            throw new Error('Idea is not a note');
        }

        if (isTrash) return;

        const currentNote = new Note(
            idea.createdAt,
            backgroundColor,
            backgroundColorDark,
            idea.id,
            title,
            content,
            isArchived,
            isPinned,
            isTrash,
            idea.type === 'note' ? idea.images : [],
            reminder ?? null,
        );

        const prevNote = idea as Note;

        console.log('Current note:', currentNote);
        console.log('Previous note:', idea);

        if (initialOperation === 'create') {
            if (
                currentNote.title !== prevNote.title
                || currentNote.content !== prevNote.content
                || currentNote.reminder !== prevNote.reminder
            ) {
                handleResetNote();
                await createNote(currentNote);
                return;
            }
        } else if (currentNote.title !== prevNote.title || currentNote.content !== prevNote.content) {
            handleResetNote();
            await updateNote(currentNote);
            return;
        }

        console.log('No changes made');
        handleResetNote();
    }, [idea, isTrash, backgroundColor, backgroundColorDark, reminder, title, content, isArchived, isPinned, initialOperation, handleResetNote, createNote, updateNote]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        console.log('clicking submit')
        event.preventDefault();
        handleNote();
    };

    const handleMakeACopy = async () => {
        const localId = new Date().toISOString();
        if (isTrash) return;
        const newNote = new Note(
            null,
            backgroundColor,
            backgroundColorDark,
            localId,
            title,
            content,
            false,
            false,
            false,
            [],
            reminder ?? null,
        );

        await createNote(newNote);
        setIsOptionsMenu(false);
    };

    const handleSend = async () => {
        if (isTrash) return;
        console.log('Sending needs to be implemented');
    };

    const handleClickOutside = useCallback((event: MouseEvent) => {
        event.stopPropagation();

        const checkIsMenuClose = (
            isMenuOpen: boolean,
            menuRef: React.RefObject<HTMLElement>,
            buttonRef: React.RefObject<HTMLElement>,
            setMenu: React.Dispatch<React.SetStateAction<boolean>>
        ) => {
            if (
                isMenuOpen &&
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                !(buttonRef.current && buttonRef.current.contains(event.target as Node))
            ) {
                setMenu(false);
            }
        };

        checkIsMenuClose(isBackgroundMenuOpen, backgroundMenuRef, backgroundMenuRefButton, setIsBackgroundMenu);
        checkIsMenuClose(isFontMenuOpen, fontMenuRef, fontMenuRefButton, setIsFontMenu);
        checkIsMenuClose(isReminderMenuOpen, reminderMenuRef, reminderMenuRefButton, setIsReminderMenu);
        checkIsMenuClose(isOptionsMenuOpen, optionsMenuRef, optionsMenuRefButton, setIsOptionsMenu);

        if (isEditMode || isTrash) {
            if (initialOperation === 'create' && noteCreateRef.current && !noteCreateRef.current.contains(event.target as Node)) {
                handleNote();
            } else if (noteEditRef.current && !noteEditRef.current.contains(event.target as Node)) {
                handleNote();
            }
        }
    }, [isBackgroundMenuOpen, isFontMenuOpen, isReminderMenuOpen, isOptionsMenuOpen, isEditMode, isTrash, initialOperation, handleNote]);

    const handleMouseEnter = useCallback(() => {
        setIsHovering(true);
    }, []);

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    const toggleArchive = async () => {
        if (initialOperation === 'create' && (content.length > 0 || title.length > 0)) {
            handleNote();
        } else if (initialOperation === 'create') {
            setInfo('Empty note discarded');
            return;
        }

        let updatedIsPinned = isPinned;

        if (updatedIsPinned) {
            updatedIsPinned = false;
        }

        if (isArchived) {
            setInfo('Note unarchived');
        } else if (!isArchived && isPinned) {
            setInfo('Note archived and unpinned');
        } else {
            setInfo('Note archived');
        }

        if (idea.type == 'note') {
            const updatedNote = new Note(
                idea.createdAt,
                backgroundColor,
                backgroundColorDark,
                idea.id,
                title,
                content,
                !isArchived,
                updatedIsPinned,
                isTrash,
                idea.images,
                idea.reminder,
            );
            console.log('Updated note:', updatedNote);
            await updateNote(updatedNote);
        }
        setIsOptionsMenu(false);
    };

    const toggleBackgroundColor = async (backgroundColor: '#ffffff' | '#fff59c' | '#aaf0d1' | '#b2dfdb' | '#f5f5f5',
        backgroundColorDark: '#121212' | "#9c955c" | '#5f8775' | '#005c5a' | '#8a8a8a') => {
        setBackgroundColor(backgroundColor);
        setBackgroundColorDark(backgroundColorDark);
        if (initialOperation === 'read' && !isTrash) {
            if (idea.type == 'note') {
                const updatedNote = new Note(
                    idea.createdAt,
                    backgroundColor,
                    backgroundColorDark,
                    idea.id,
                    title,
                    content,
                    isArchived,
                    isPinned,
                    isTrash,
                    idea.images,
                    idea.reminder,
                );
                console.log('Updated note:', updatedNote);
                await updateNote(updatedNote);
            }
        }
    };

    const toggleDelete = async () => {
        if (initialOperation === 'create') {
            setInfo('Note discarded');
            handleResetNote();
            return;
        }

        if (isTrash) {
            setInfo('Note restored');
        } else {
            setInfo('Note moved to trash');
        }

        if (idea.type == 'note') {
            const updatedNote = new Note(
                idea.createdAt,
                backgroundColor,
                backgroundColorDark,
                idea.id,
                title,
                content,
                isArchived,
                isPinned,
                !isTrash,
                idea.images,
                idea.reminder,
            );
            await updateNote(updatedNote);
        }
        setIsOptionsMenu(false);
    };

    const togglePinned = async () => {
        if (initialOperation === 'create' && (content.length > 0 || title.length > 0)) {
            handleNote();
        } else if (initialOperation === 'create') {
            setInfo('Empty note discarded');
            return;
        }

        let updatedIsArchived = isArchived;

        if (updatedIsArchived) {
            updatedIsArchived = false;
        }

        if (isPinned) {
            setInfo('Note unpinned');
        } else if (!isPinned && isArchived) {
            setInfo('Note pinned and unarchived');
        } else {
            setInfo('Note pinned');
        }

        if (idea.type == 'note') {
            const updatedNote = new Note(
                idea.createdAt,
                backgroundColor,
                backgroundColorDark,
                idea.id,
                title,
                content,
                updatedIsArchived,
                !isPinned,
                isTrash,
                idea.images,
                idea.reminder,
            );
            console.log('Updated note:', updatedNote);
            await updateNote(updatedNote);
        }
        setIsOptionsMenu(false);
    };

    const toggleReminder = async (reminder: Timestamp | undefined) => {
        if (isTrash) {
            setInfo('Cannot edit note in trash');
            return;
        }

        if (reminder === undefined) {
            setReminder(null);
        } else {
            setReminder(reminder);
        }

        if (initialOperation === 'read') {
            if (idea.type == 'note') {
                const updatedNote = new Note(
                    idea.createdAt,
                    backgroundColor,
                    backgroundColorDark,
                    idea.id,
                    title,
                    content,
                    isArchived,
                    isPinned,
                    isTrash,
                    idea.images,
                    reminder ?? null,
                );
                console.log('Updated note:', updatedNote);
                await updateNote(updatedNote);
            }
        }
        setIsReminderMenu(false);
    };

    useEffect(() => {
        if (isModalMode) {
            console.log('isModalMode:', isModalMode);
            document.body.style.overflow = 'hidden';
        } 

        return () => {
            document.body.style.overflow = '';
            window.scrollTo(0, scrollPosition);
        };
    }, [isModalMode, scrollPosition]);
    
    useEffect(() => {
        
        const handleEvent = (event: MouseEvent) => {
            handleClickOutside(event);
        };
        document.addEventListener('mousedown', handleEvent);
        return () => {
            document.removeEventListener('mousedown', handleEvent);
        };
    }, [handleClickOutside]);

    return (
        <React.Fragment>

            <div
                // draggable={initialOperation === 'read' && !isTrash && !isModalMode}
                // {...draggableProps}
                // onDragOver={
                //     (event) => {
                //         event.preventDefault();
                //         setIsHovering(false);
                //     }
                // }
                className={(isModalMode ? styles.containerModal : styles.container)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Box
                    component={'form'}
                    className={!isModalMode ? (initialOperation === 'create' ? styles.create : styles.read) : styles.noteEdit}
                    onSubmit={handleSubmit}
                    ref={initialOperation === 'create' ? noteCreateRef : noteEditRef}
                    sx={{
                        backgroundColor: backgroundColor,
                        '@media (prefers-color-scheme: dark)': {
                            backgroundColor: backgroundColorDark,
                        }
                    }}>
                    <div ref={infoRef} className={(initialOperation === 'read' && !isModalMode) ? styles.infoContainerRead : styles.infoContainer}>
                        <GUIHeader
                            focus={focus}
                            initialOperation={initialOperation}
                            isEditMode={isEditMode}
                            isModalMode={isModalMode}
                            isTrashMode={isTrash}
                            title={title}
                            handleTitleChange={handleTitleChange}
                            setFocus={setFocus}
                            setIsEditMode={setIsEditMode}
                            setIsModalMode={setIsModalMode}
                            setScrollPosition={setScrollPosition}
                        />
                        <GUIBody
                            focus={focus}
                            title={title}
                            content={content}
                            initialOperation={initialOperation}
                            isEditMode={isEditMode}
                            isModalMode={isModalMode}
                            isTrashMode={isTrash}
                            handleContentChange={handleContentChange}
                            setFocus={setFocus}
                            setIsEditMode={setIsEditMode}
                            setIsModalMode={setIsModalMode}
                            setScrollPosition={setScrollPosition}
                        />
                    </div>
                    {
                        (reminder) && (
                            <div className={styles.reminderContainer}>
                                <div className={styles.reminder}>
                                    <StyledIconButton onClick={handleReminderMenu}>
                                        <AlarmAddOutlined />
                                    </StyledIconButton>
                                    <p>{formattedDate}</p>
                                    <StyledIconButton onClick={() => toggleReminder(undefined)}>
                                        <CloseOutlined />
                                    </StyledIconButton>
                                </div>
                            </div>
                        )
                    }
                    <GUIFooter
                        content={content}
                        title={title}
                        type={idea.type}
                        backgroundColor={backgroundColor}
                        contentArray={contentArray}
                        initialOperation={initialOperation}
                        isArchived={isArchived}
                        isEditMode={isEditMode}
                        isHovering={isHovering}
                        isBackgroundMenuOpen={isBackgroundMenuOpen}
                        isFontMenuOpen={isFontMenuOpen}
                        isReminderMenuOpen={isReminderMenuOpen}
                        isOptionsMenuOpen={isOptionsMenuOpen}
                        isTrash={isTrash}
                        isPinned={isPinned}
                        backgroundMenuRef={backgroundMenuRef}
                        backgroundMenuRefButton={backgroundMenuRefButton}
                        fontMenuRef={fontMenuRef}
                        fontMenuRefButton={fontMenuRefButton}
                        reminderMenuRef={reminderMenuRef}
                        reminderMenuRefButton={reminderMenuRefButton}
                        optionsMenuRef={optionsMenuRef}
                        optionsMenuRefButton={optionsMenuRefButton}
                        index={index}
                        toggleBackgroundColor={toggleBackgroundColor}
                        handleDeleteNote={handleDeleteNote}
                        handleMakeACopy={handleMakeACopy}
                        handleSend={handleSend}
                        handleRedo={handleRedo}
                        handleUndo={handleUndo}
                        setIsBackgroundMenu={setIsBackgroundMenu}
                        setIsFontMenu={setIsFontMenu}
                        setIsOptionsMenu={setIsOptionsMenu}
                        setIsReminderMenu={setIsReminderMenu}
                        toggleReminder={toggleReminder}
                        toggleArchive={toggleArchive}
                        toggleDelete={toggleDelete}
                        togglePinned={togglePinned}
                        setIsEditMode={setIsEditMode}
                        setIsModalMode={setIsModalMode}
                    />
                </Box>
            </div>
            <PopUpModal
                isOpen={isPopUpModalOpen}
                confirmButtonText="Delete"
                message={idea.type === 'note' ? 'Are you sure you want to delete this note?' : 'Are you sure you want to delete this project?'}
                onClose={handleModalClose}
            />
        </React.Fragment>
    );
};

export default GUI;