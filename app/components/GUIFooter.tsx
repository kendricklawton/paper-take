'use client';

import {
    Archive,
    ArchiveOutlined,
    DeleteForeverOutlined,
    PaletteOutlined,
    MoreVert,
    RedoOutlined,
    UndoOutlined,
    RestoreFromTrashOutlined,
    NoteOutlined,
    AlarmAddOutlined,
    PushPinOutlined,
    AccountTreeOutlined
} from '@mui/icons-material';
import styles from "./GUI.module.css"
import React from 'react';
import {
    BackgroundCircle, BackgroundIconButton, StyledIconButton, StyledTextButton, TransparentIconButton, TransparentIcon,
    StyledTooltip,
    BackgroundCircleYellow,
    BackgroundCircleMintyGreen,
    BackgroundCircleTeal,
    BackgroundCircleChalk
} from './Styled';
import { MenuItem } from '@mui/material';
import { Timestamp } from 'firebase/firestore';

const MenuItemStyles = {
    fontFamily: 'monospace',
    paddingLeft: '1.2rem',
    paddingRight: '1.2rem',
    // maxWidth: '280px',
    display: 'flex',
    gap: '64px',
    justifyContent: 'space-between',
}

interface GUIFooterProps {
    type: 'note' | 'project';
    backgroundColor: string;
    title: string;
    content: string;
    contentArray: string[];
    initialOperation: 'read' | 'create';
    isArchived: boolean;
    isEditMode: boolean;
    isHovering: boolean;
    isBackgroundMenuOpen: boolean;
    isFontMenuOpen: boolean;
    isReminderMenuOpen: boolean;
    isOptionsMenuOpen: boolean;
    isTrash: boolean;
    // isHidden: boolean;
    backgroundMenuRef: React.RefObject<HTMLDivElement>;
    backgroundMenuRefButton: React.RefObject<HTMLButtonElement>;
    fontMenuRef: React.RefObject<HTMLDivElement>;
    fontMenuRefButton: React.RefObject<HTMLButtonElement>;
    optionsMenuRef: React.RefObject<HTMLDivElement>;
    optionsMenuRefButton: React.RefObject<HTMLButtonElement>;
    reminderMenuRef: React.RefObject<HTMLDivElement>;
    reminderMenuRefButton: React.RefObject<HTMLButtonElement>;
    index: React.MutableRefObject<number>;
    toggleBackgroundColor: (
        backgroundColor: '#ffffff' | '#fff59c' | '#aaf0d1' | '#b2dfdb' | '#f5f5f5',
        backgroundColorDark: '#121212' | "#9c955c" | '#5f8775' | '#005c5a' | '#8a8a8a'
    ) => Promise<void>;
    handleDeleteNote: () => void;
    handleSend: () => void;
    handleRedo: (event: React.MouseEvent<HTMLButtonElement>) => void;
    handleUndo: (event: React.MouseEvent<HTMLButtonElement>) => void;
    handleMakeACopy: () => void;
    handleMoveUp?: () => void;
    handleMoveDown?: () => void;
    setIsBackgroundMenu: React.Dispatch<React.SetStateAction<boolean>>;
    setIsFontMenu: React.Dispatch<React.SetStateAction<boolean>>;
    setIsReminderMenu: React.Dispatch<React.SetStateAction<boolean>>;
    setIsOptionsMenu: React.Dispatch<React.SetStateAction<boolean>>;
    toggleArchive: () => void;
    toggleDelete: () => void;
    toggleReminder: (reminder: Timestamp | undefined) => void;
    setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>,
    setIsModalMode: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function GUIFooter({
    type,
    backgroundColor,
    content,
    title,
    contentArray,
    isArchived,
    // isDarkMode,
    isEditMode,
    isBackgroundMenuOpen,
    isHovering,
    // isHidden,
    // isFontMenuOpen,
    isReminderMenuOpen,
    isOptionsMenuOpen,
    isTrash,
    initialOperation,
    backgroundMenuRef,
    backgroundMenuRefButton,
    // fontMenuRef,
    // fontMenuRefButton,
    reminderMenuRef,
    reminderMenuRefButton,
    optionsMenuRef,
    optionsMenuRefButton,
    index,
    handleDeleteNote,
    handleMakeACopy,
    // handleSend,
    handleRedo,
    handleUndo,
    setIsBackgroundMenu,
    // setIsFontMenu,
    setIsOptionsMenu,
    setIsReminderMenu,
    setIsEditMode,
    setIsModalMode,
    toggleArchive,
    toggleBackgroundColor,
    toggleDelete,
    toggleReminder,
}: GUIFooterProps) {
    const showFooter = isEditMode || initialOperation === 'read';
    const showFooterIcons = isEditMode || (isHovering && initialOperation === 'read') || isBackgroundMenuOpen || isOptionsMenuOpen || isReminderMenuOpen;
    const showCloseButton = initialOperation === 'create' || isEditMode;
    const showMakeACopyButton = initialOperation === 'create' && (content.length > 0 || title.length > 0) || initialOperation === 'read';

    const handleIdeaIconButton = () => {    
        setIsModalMode(true);
        setIsEditMode(true);
    }
    
    const sixHours = Timestamp.fromDate(new Date(
        new Date().setHours(new Date().getHours() + 6)
    ));

    const sixHoursString = sixHours.toDate().toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const twelveHours = Timestamp.fromDate(new Date(
        new Date().setHours(new Date().getHours() + 12)
    ));

    const twelveHoursString = twelveHours.toDate().toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const twentyFourHours = Timestamp.fromDate(new Date(
        new Date().setHours(new Date().getHours() + 24)
    ));

    const twentyFourHoursString = twentyFourHours.toDate().toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <React.Fragment>
            {isTrash ?
                (<div className={styles.footerWrapper}>
                    <div className={styles.footerContainer}>
                        <div className={styles.footerLeading}>
                            {
                                showFooterIcons && (
                                    <React.Fragment>
                                        <StyledTooltip title='Delete forever'>
                                            <StyledIconButton aria-label="Delete forever" onClick={() => handleDeleteNote()}>
                                                <DeleteForeverOutlined />
                                            </StyledIconButton>
                                        </StyledTooltip>
                                        <StyledTooltip title='Restore'>
                                            <StyledIconButton aria-label="Restore" onClick={() => toggleDelete()}>
                                                <RestoreFromTrashOutlined />
                                            </StyledIconButton>
                                        </StyledTooltip>
                                    </React.Fragment>
                                )
                            }
                        </div>
                        <StyledTooltip title={type === 'note' ? 'Note' : 'Project'} >
                            <span>
                                <StyledIconButton onClick={handleIdeaIconButton}>
                                    {type === 'note' ? <NoteOutlined /> : <AccountTreeOutlined />}
                                </StyledIconButton>
                            </span>
                        </StyledTooltip>
                    </div>
                </div>)
                :
                showFooter && (
                    <div className={styles.footerWrapper}>
                        <div className={styles.footerContainer}>
                            {
                                showFooterIcons ? (
                                    <div className={styles.footerLeading}>
                                        <StyledTooltip title={'Pin note'}>
                                            <StyledIconButton className={styles.menuButton}
                                            // onClick={() => setIsBackgroundMenu(prev => !prev)}
                                            >
                                                <PushPinOutlined />
                                            </StyledIconButton>
                                        </StyledTooltip>
                                        <div className={styles.anchor}>
                                            {/* <StyledTooltip  title={'Reminder'}> */}
                                            <StyledIconButton ref={reminderMenuRefButton} className={styles.menuButton}
                                                onClick={() => setIsReminderMenu(prev => !prev)}>
                                                <AlarmAddOutlined />
                                            </StyledIconButton>
                                            {/* </StyledTooltip> */}
                                            {isReminderMenuOpen && (
                                                <div className={styles.menu} ref={reminderMenuRef}>
                                                    {/* {MenuHeader('Reminder')} */}
                                                    <MenuItem disableGutters sx={MenuItemStyles} onClick={() => toggleReminder(sixHours)} >6 hours  <span>{sixHoursString}</span></MenuItem>
                                                    <MenuItem disableGutters sx={MenuItemStyles} onClick={() => toggleReminder(twelveHours)}>12 hours <span>{twelveHoursString}</span></MenuItem>
                                                    <MenuItem disableGutters sx={MenuItemStyles} onClick={() => toggleReminder(twentyFourHours)}>24 hours <span>{twentyFourHoursString}</span></MenuItem>
                                                    {/* <MenuItem disableGutters sx={MenuItemStyles}>Pick date & time</MenuItem> */}
                                                </div>
                                            )}
                                        </div>
                                        <div className={styles.anchor}>

                                            {/* <StyledTooltip title={'Background options'}> */}
                                            <StyledIconButton ref={backgroundMenuRefButton} className={styles.menuButton}
                                                onClick={() => setIsBackgroundMenu(prev => !prev)}>
                                                <PaletteOutlined />
                                            </StyledIconButton>
                                            {/* </StyledTooltip> */}
                                            {isBackgroundMenuOpen && (
                                                <div className={styles.backgroundMenu}
                                                    ref={backgroundMenuRef}>
                                                    <BackgroundIconButton selected={backgroundColor === '#ffffff'} onClick={() => toggleBackgroundColor('#ffffff', '#121212')}>
                                                        <BackgroundCircle selected={backgroundColor === '#ffffff'} />
                                                    </BackgroundIconButton>
                                                    <BackgroundIconButton selected={backgroundColor === '#fff59c'} onClick={() => toggleBackgroundColor('#fff59c', '#9c955c')}>
                                                        <BackgroundCircleYellow selected={backgroundColor === '#fff59c'} />
                                                    </BackgroundIconButton>
                                                    <BackgroundIconButton selected={backgroundColor === '#aaf0d1'} onClick={() => toggleBackgroundColor('#aaf0d1', '#5f8775')}>
                                                        <BackgroundCircleMintyGreen selected={backgroundColor === '#aaf0d1'} />
                                                    </BackgroundIconButton>
                                                    <BackgroundIconButton selected={backgroundColor === '#b2dfdb'} onClick={() => toggleBackgroundColor('#b2dfdb', '#005c5a')}>
                                                        <BackgroundCircleTeal selected={backgroundColor === '#b2dfdb'} />
                                                    </BackgroundIconButton>
                                                    <BackgroundIconButton selected={backgroundColor === '#f5f5f5'} onClick={() => toggleBackgroundColor('#f5f5f5', '#8a8a8a')}>
                                                        <BackgroundCircleChalk selected={backgroundColor === '#f5f5f5'} />
                                                    </BackgroundIconButton>
                                                </div>
                                            )}
                                        </div>

                                        {initialOperation !== 'create' && (
                                            <StyledTooltip title={'Archive note'} >
                                                <StyledIconButton aria-label="Archive" onClick={() => toggleArchive()}>
                                                    {isArchived ? <Archive /> : <ArchiveOutlined />}
                                                </StyledIconButton>
                                            </StyledTooltip>
                                        )}
                                        {isEditMode && (
                                            <React.Fragment>
                                                <StyledTooltip title={'Undo'} >
                                                    <span>
                                                        <StyledIconButton aria-label="Undo" onClick={handleUndo} disabled={index.current === 0}>
                                                            <UndoOutlined />
                                                        </StyledIconButton>
                                                    </span>
                                                </StyledTooltip>
                                                <StyledTooltip title={'Redo'} >
                                                    <span>
                                                        <StyledIconButton aria-label="Redo" onClick={handleRedo} disabled={index.current === contentArray.length - 1}>
                                                            <RedoOutlined />
                                                        </StyledIconButton>
                                                    </span>
                                                </StyledTooltip>
                                            </React.Fragment>
                                        )}
                                        <div className={styles.anchor}>
                                            {/* <StyledTooltip title={'Options'} > */}
                                            <StyledIconButton ref={optionsMenuRefButton} onClick={() => setIsOptionsMenu(prev => !prev)}>
                                                <MoreVert />
                                            </StyledIconButton>
                                            {/* </StyledTooltip> */}
                                            {isOptionsMenuOpen && (
                                                <div className={styles.menu} ref={optionsMenuRef}>
                                                    {/* {MenuHeader('Note Options')} */}
                                                    {/* <MenuItem disableGutters sx={MenuItemStyles} onClick={handleSend}>Send</MenuItem> */}
                                                    {showMakeACopyButton && (
                                                        <MenuItem disableGutters sx={MenuItemStyles} onClick={handleMakeACopy}>Make a copy</MenuItem>
                                                    )}
                                                    <MenuItem disableGutters sx={MenuItemStyles} onClick={toggleDelete}>Delete</MenuItem>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                                    : (
                                        <div className={styles.footerLeading}>
                                            <TransparentIconButton>
                                                <TransparentIcon />
                                            </TransparentIconButton>
                                        </div>)
                            }
                            <React.Fragment>
                                {showCloseButton && (
                                    <StyledTextButton type="submit">Close</StyledTextButton>
                                )}
                            </React.Fragment>
                            {
                                (initialOperation === 'read' && !isEditMode) && (
                                    <div>
                                        <StyledTooltip title={type === 'note' ? 'Note' : 'Project'} >
                                            <span>
                                                <StyledIconButton onClick={handleIdeaIconButton}>
                                                    {type === 'note' ? <NoteOutlined /> : <AccountTreeOutlined />}
                                                </StyledIconButton>
                                            </span>
                                        </StyledTooltip>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                )
            }
        </React.Fragment>
    );
}