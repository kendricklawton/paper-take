'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { useAppContext } from '../providers/AppProvider';
import GUIBody from './GUIBody';
import GUIHeader from './GUIHeader';
import GUIFooter from './GUIFooter';
import styles from "./GUI.module.css"
import { Note, Project } from '../models';
import { Box } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { StyledIconButton } from './Styled';
import { AlarmAddOutlined, CloseOutlined } from '@mui/icons-material';
import { Timestamp } from 'firebase/firestore';

interface GUIProps {
    draggableProps?: {
        onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;
        onDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
        onDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
    };
    noteIndex?: number;
    operation: 'read' | 'create';
    idea: Note | Project;
}

const GUI: React.FC<GUIProps> = ({
    draggableProps,
    operation,
    idea: idea,
}) => {
    const { createNote, deleteNote, updateNote, setInfo } = useAppContext();
    const initialOperation = operation;

    const [isModalMode, setIsModalMode] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isBackgroundMenuOpen, setIsBackgroundMenu] = useState(false);
    const [isFontMenuOpen, setIsFontMenu] = useState(false);
    const [isReminderMenuOpen, setIsReminderMenu] = useState(false);
    const [isOptionsMenuOpen, setIsOptionsMenu] = useState(false);
    const [isHovering, setIsHovering] = useState<boolean>(false);
    const [focus, setFocus] = useState<'title' | 'body'>('body');


    const isArchived = idea.isArchived;
    const isPinned = idea.isPinned;
    const isTrash = idea.isTrash;
    const [title, setTitle] = useState(idea.title);
    const [content, setContent] = useState(idea.type === 'note' ? idea.content : '');
    const [contentArray, setContentArray] = useState([idea.type === 'note' ? idea.content : '']);
    const [reminder, setReminder] = useState(idea.reminder);
    const [backgroundColor, setBackgroundColor] = useState(idea.type === 'note' ? idea.backgroundColor : '#ffffff');
    const [backgroundColorDark, setBackgroundColorDark] = useState(idea.type === 'note' ? idea.backgroundColorDark : '#121212');

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
        if (isTrash) return;
        const newValue = event.target.value;
        if (newValue.length <= 1000) {
            setInfo(newValue.length > 900 ? `${1000 - newValue.length} characters remaining.` : '');
            setTitle(newValue);
        }
    };

    const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (isTrash) return;
        const newValue = event.target.value;
        if (newValue.length <= 5000) {
            setInfo(newValue.length > 4500 ? `${5000 - newValue.length} characters remaining.` : '');
            setContent(newValue);
            index.current += 1;
            setContentArray([...contentArray.slice(0, index.current), newValue]);
        }
    };
    

    const handleReminderMenu = () => {
        if (isTrash) {
            setInfo('Cannot edit note in trash');
        } else {
            setIsReminderMenu(prev => !prev);
        }
     
    }
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
        try {
            if (isTrash) {
                await deleteNote(idea as Note);
                setInfo('Note deleted');
            }
        } catch (error) {
            console.log(error);
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
        if (isTrash) return;

        const newNote = new Note(
            null,
            backgroundColor,
            backgroundColorDark,
            uuidv4(),
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

    // To be implemented
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

    // const handleClickOutside = useCallback((event: MouseEvent) => {
    //     event.stopPropagation();
    //     if (
    //         isBackgroundMenuOpen &&
    //         backgroundMenuRef.current &&
    //         !backgroundMenuRef.current.contains(event.target as Node) &&
    //         !(backgroundMenuRefButton.current && backgroundMenuRefButton.current.contains(event.target as Node))
    //     ) {
    //         setIsBackgroundMenu(false);
    //     }

    //     if (
    //         isFontMenuOpen &&
    //         fontMenuRef.current &&
    //         !fontMenuRef.current.contains(event.target as Node) &&
    //         !(fontMenuRefButton.current && fontMenuRefButton.current.contains(event.target as Node))
    //     ) {
    //         setIsFontMenu(false);
    //     }

    //     if (isReminderMenuOpen &&
    //         reminderMenuRef.current &&
    //         !reminderMenuRef.current.contains(event.target as Node) &&
    //         !(reminderMenuRefButton.current && reminderMenuRefButton.current.contains(event.target as Node))
    //     ) {
    //         setIsReminderMenu(false);
    //     }

    //     if (
    //         isOptionsMenuOpen &&
    //         optionsMenuRef.current &&
    //         !optionsMenuRef.current.contains(event.target as Node) &&
    //         !(optionsMenuRefButton.current && optionsMenuRefButton.current.contains(event.target as Node))
    //     ) {
    //         setIsOptionsMenu(false);
    //     }

    // if (isEditMode || isTrash) {
    //     if (initialOperation === 'create' && noteCreateRef.current && !noteCreateRef.current.contains(event.target as Node)) {
    //         handleNote();
    //     } else if (noteEditRef.current && !noteEditRef.current.contains(event.target as Node)) {
    //         handleNote();
    //     }
    // }
    // }, [isBackgroundMenuOpen, isFontMenuOpen, isReminderMenuOpen, isOptionsMenuOpen, isEditMode, isTrash, initialOperation, handleNote]);

    const handleMouseEnter = useCallback(() => {
        setIsHovering(true);
    }, []);

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    const toggleArchive = async () => {
        if (isArchived) {
            setInfo('Note unarchived');
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
                isPinned,
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

    const toggleReminder = async (reminder: Timestamp | undefined) => {
        if (isTrash) {
            setInfo('Cannot edit note in trash');
            return;
        }

        if(reminder === undefined) {
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
    }

    const toggleModeTrue = () => {
        handleClearSelection();
        
        if (isTrash) {
            setInfo('Cannot edit note in trash');
            return;
        }
        if (initialOperation === 'read') {
            setIsModalMode(true);
        }
        setIsEditMode(true);
    };

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = isModalMode ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isModalMode]);

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
        <div
            draggable={initialOperation === 'read' && !isTrash && !isModalMode}
            {...draggableProps}
            onDragOver={
                (event) => {
                    event.preventDefault();
                    setIsHovering(false);
                }
            }
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
                        title={title}
                        handleTitleChange={handleTitleChange}
                        setFocus={setFocus}
                        toggleModeTrue={toggleModeTrue}
                    />
                    <GUIBody
                        focus={focus}
                        title={title}
                        content={content}
                        initialOperation={initialOperation}
                        isEditMode={isEditMode}
                        isModalMode={isModalMode}
                        handleContentChange={handleContentChange}
                        setFocus={setFocus}
                        setIsEditMode={setIsEditMode}
                        toggleModeTrue={toggleModeTrue}
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
                    toggleModeTrue={toggleModeTrue}
                />
            </Box>
        </div>
    );
};

export default GUI;