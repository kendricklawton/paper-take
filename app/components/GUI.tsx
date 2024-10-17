'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { useAppContext } from '../providers/AppProvider';
import GUIBody from './GUIBody';
import GUIHeader from './GUIHeader';
import GUIFooter from './GUIFooter';
import styles from "./GUI.module.css"
import { Note, Project } from '../models';
import { Box } from '@mui/material';

interface GUIProps {
    // draggable?: boolean;
    // handleDragStart?: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
    // handleDragOver?: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
    // handleDrop?: (index: number) => void;
    noteIndex?: number;
    operation: 'read' | 'create';
    idea: Note | Project;
}

const GUI: React.FC<GUIProps> = ({
    // handleDragStart,
    // handleDragOver,
    // handleDrop,
    // noteIndex,
    operation,
    idea,
}) => {
    const { createIdea, deleteIdea, updateIdea, setInfo } = useAppContext();
    const initialOperation = operation;
    const [isModalMode, setIsModalMode] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isBackgroundMenuOpen, setIsBackgroundMenu] = useState(false);
    const [isFontMenuOpen, setIsFontMenu] = useState(false);
    const [isReminderMenuOpen, setIsReminderMenu] = useState(false);
    const [isOptionsMenuOpen, setIsOptionsMenu] = useState(false);
    const [isHovering, setIsHovering] = useState<boolean>(false);
    const [focus, setFocus] = useState<'title' | 'body'>('body');

    const [contentArray, setContentArray] = useState([idea.type === 'note' ? idea.content : '']);
    const isArchived = idea.isArchived;
    const isPinned = idea.isPinned;
    const isTrash = idea.isTrash;
    const [title, setTitle] = useState(idea.title);
    const [content, setContent] = useState(idea.type === 'note' ? idea.content : '');
    const [backgroundColor, setBackgroundColor] = useState(idea.type === 'note' ? idea.backgroundColor : '#ffffff');
    const [backgroundColorDark, setBackgroundColorDark] = useState(idea.type === 'note' ? idea.backgroundColorDark : '#121212');

    const index = useRef(0);
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

    const handleResetNote = useCallback(() => {
        if (initialOperation === 'create') {
            setContent('');
            setTitle('');
            setBackgroundColor('#ffffff');
            setBackgroundColorDark('#121212');
        }

        setIsModalMode(false);
        setContentArray([content]);
        setIsEditMode(false);
        setIsHovering(false);
        index.current = 0;
        nestedIndex.current = 0;
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
                await deleteIdea(idea);
                setInfo('Note deleted');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleNote = useCallback(async () => {
        if (idea.type !== 'note') return;

        if (isTrash) return;
        // createdAt: Timestamp | undefined;
        // id: string;
        // title: string;
        // backgroundColor: '#ffffff' | '#fff59c' | '#aaf0d1' | '#b2dfdb' | '#f5f5f5';
        // backgroundColorDark: '#121212' | '#a68f00' | '#4c8c7d' | '#005c5a' | '#004d40';
        // content: string;
        // isArchived: boolean;
        // isPinned: boolean;
        // isTrash: boolean;
        // images: string[];
        // reminder: Timestamp | undefined;

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
            idea.images,
            idea.reminder,
        );

        // const prevNote = idea;
      
        console.log('Current note:', currentNote);
        console.log('Previous idea:', idea);

        if (initialOperation === 'create') {
            
            // if (currentNote.title !== prevNote.title || currentNote.content !== prevNote.content) {
            if (currentNote.title !== idea.title || currentNote.content !== idea.content) {
     
                await createIdea(currentNote);
                handleResetNote();
                return;
            }
        // } else if (currentNote.title !== prevNote.title || currentNote.content !== prevNote.content || currentNote.backgroundColor !== prevNote.backgroundColor) {
        } else if (currentNote.title !== idea.title || currentNote.content !== idea.content || currentNote.backgroundColor !== idea.backgroundColor) {
            handleResetNote();
            await updateIdea(currentNote);
            return;
        }

        console.log('No changes made');
        handleResetNote();
    }, [backgroundColor, backgroundColorDark, isTrash, title, content, isArchived, isPinned, idea, initialOperation,
        handleResetNote, createIdea, updateIdea]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        console.log('clicking submit')
        event.preventDefault();
        handleNote();
    };

    const handleClickOutside = useCallback((event: MouseEvent | TouchEvent) => {
        event.stopPropagation();
        if (
            isBackgroundMenuOpen &&
            backgroundMenuRef.current &&
            !backgroundMenuRef.current.contains(event.target as Node) &&
            !(backgroundMenuRefButton.current && backgroundMenuRefButton.current.contains(event.target as Node))
        ) {
            setIsBackgroundMenu(false);
        }

        if (
            isFontMenuOpen &&
            fontMenuRef.current &&
            !fontMenuRef.current.contains(event.target as Node) &&
            !(fontMenuRefButton.current && fontMenuRefButton.current.contains(event.target as Node))
        ) {
            setIsFontMenu(false);
        }

        if (
            isOptionsMenuOpen &&
            optionsMenuRef.current &&
            !optionsMenuRef.current.contains(event.target as Node) &&
            !(optionsMenuRefButton.current && optionsMenuRefButton.current.contains(event.target as Node))
        ) {
            setIsOptionsMenu(false);
        }

        if (isEditMode || isTrash) {
            if (initialOperation === 'create' && noteCreateRef.current && !noteCreateRef.current.contains(event.target as Node)) {
                handleNote();
            } else if (noteEditRef.current && !noteEditRef.current.contains(event.target as Node)) {
                handleNote();
            }
        }
    }, [isOptionsMenuOpen, isBackgroundMenuOpen, isFontMenuOpen, isEditMode, isTrash, initialOperation, handleNote]);

    const toggleArchive = async () => {
        if (isArchived) {
            setInfo('Note unarchived');
        } else {
            setInfo('Note archived');
        }
        await updateIdea({ ...idea, isArchived: !isArchived } as Note);
        setIsOptionsMenu(false);
    };

    // backgroundColor: '' | '#fff59c' | '#aaf0d1' | '#b2dfdb' | '#f5f5f5';
    // backgroundColorsDark: '' | '#a68f00' | '#4c8c7d' | '#005c5a' | '#004d40' | '#424242';
    const handleBackgroundColor = async (backgroundColor: "#ffffff" | "#fff59c" | "#aaf0d1" | "#b2dfdb" | "#f5f5f5", 
        backgroundColorDark: '#121212' | '#a68f00' | '#4c8c7d' | '#005c5a' | '#004d40') => {
        console.log('Background color:', backgroundColor);
        console.log('Background color dark:', backgroundColorDark);
        setBackgroundColor(backgroundColor);
        setBackgroundColorDark(backgroundColorDark);
        if (initialOperation === 'read' && !isTrash) {
            await updateIdea({ ...idea, backgroundColor: backgroundColor, backgroundColorDark: backgroundColorDark } as Note);
        }
    };

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    const toggleDelete = async () => {
        if (initialOperation === 'create') {
            handleResetNote();
            setInfo('Note deleted');
        } else {
            await updateIdea({ ...idea, isTrash: !isTrash } as Note);
            setInfo(isTrash ? 'Note restored' : 'Note moved to trash');
        }
        setIsOptionsMenu(false);
    };

    const toggleModeTrue = () => {
        if (isTrash) {
            setInfo('Cannot edit note in trash');
        } else if (initialOperation === 'read') {
            setIsEditMode(true);
            setIsModalMode(true);
        } else {
            setIsEditMode(true);
        }
    };


    // useEffect(() => {
    //     const previousOverflow = document.body.style.overflowY;
    //     document.body.style.overflowY = isModalMode ? 'hidden' : 'auto';
    //     return () => {
    //         document.body.style.overflowY = previousOverflow;
    //     };
    // }, [isModalMode]);

    useEffect(() => {
        const handleEvent = (event: MouseEvent | TouchEvent) => {
            handleClickOutside(event);
        };

        document.addEventListener('mousedown', handleEvent);
        document.addEventListener('touchstart', handleEvent);

        return () => {
            document.removeEventListener('mousedown', handleEvent);
            document.removeEventListener('touchstart', handleEvent);
        };
    }, [handleClickOutside]);

    return (
        <div
            // draggable={initialOperation === 'read' && !isModalMode}
            // onDragStart={(e) => handleDragStart && handleDragStart(e, noteIndex ?? 0)}
            // onDragOver={(e) => handleDragOver && handleDragOver(e, noteIndex ?? 0)}
            // onDrop={() => handleDrop && handleDrop(noteIndex ?? 0)}
            className={(isModalMode ? styles.containerModal : styles.container)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Box
        
                component={'form'}
                className={!isModalMode ? (initialOperation === 'create' ? styles.create : styles.read) : styles.noteEdit}
                onSubmit={handleSubmit}
                ref={initialOperation === 'create' ? noteCreateRef : noteEditRef}
                // style={{ backgroundColor: backgroundColor }}
                sx={{
                    backgroundColor: backgroundColor,
                    '@media (prefers-color-scheme: dark)': {
                        backgroundColor: backgroundColorDark,
                    },
                }}
            >
                <div
                    className={(initialOperation === 'read' && !isModalMode) ? styles.infoContainerRead : styles.infoContainer}
                >
                    <GUIHeader
                        focus={focus}
                        setFocus={setFocus}
                        initialOperation={initialOperation}
                        isEditMode={isEditMode}
                        isModalMode={isModalMode}
                        title={title}
                        handleTitleChange={handleTitleChange}
                        toggleModeTrue={toggleModeTrue}
                    />

                    <GUIBody
                        focus={focus}
                        setFocus={setFocus}
                        title={title}
                        content={content}
                        handleContentChange={handleContentChange}
                        initialOperation={initialOperation}
                        isEditMode={isEditMode}
                        isModalMode={isModalMode}
                        setIsEditMode={setIsEditMode}
                        toggleModeTrue={toggleModeTrue}
                    />
                </div>


                <GUIFooter
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
                    handleBackgroundColor={handleBackgroundColor}
                    handleDeleteNote={handleDeleteNote}
                    handleRedo={handleRedo}
                    handleUndo={handleUndo}
                    setIsBackgroundMenu={setIsBackgroundMenu}
                    setIsFontMenu={setIsFontMenu}
                    setIsOptionsMenu={setIsOptionsMenu}
                    setIsReminderMenu={setIsReminderMenu}
                    toggleArchive={toggleArchive}
                    toggleDelete={toggleDelete}
                />
            </Box>
        </div>

    );
};

export default GUI;
