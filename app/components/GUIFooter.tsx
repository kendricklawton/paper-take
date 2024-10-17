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
} from '@mui/icons-material';
import styles from "./GUI.module.css"
import React from 'react';
import {
    BackgroundCircle, BackgroundIconButton, StyledIconButton, StyledTextButton, StyledNoteButton, TransparentIconButton, TransparentIcon,
    StyledTooltip,
    BackgroundCircleYellow,
    BackgroundCircleMintyGreen,
    BackgroundCircleTeal,
    BackgroundCircleChalk
} from './Styled';

interface GUIFooterProps {
    type: 'note' | 'project';
    backgroundColor: string;
    contentArray: string[];
    initialOperation: 'read' | 'create';
    isArchived: boolean;
    isEditMode: boolean;
    isHovering: boolean;
    isBackgroundMenuOpen: boolean;
    isFontMenuOpen: boolean;
    isOptionsMenuOpen: boolean;
    isTrash: boolean;
    backgroundMenuRef: React.RefObject<HTMLDivElement>;
    backgroundMenuRefButton: React.RefObject<HTMLButtonElement>;
    fontMenuRef: React.RefObject<HTMLDivElement>;
    fontMenuRefButton: React.RefObject<HTMLButtonElement>;
    optionsMenuRef: React.RefObject<HTMLDivElement>;
    optionsMenuRefButton: React.RefObject<HTMLButtonElement>;
    index: React.MutableRefObject<number>;
    handleBackgroundColor: (
        backgroundColor: "#ffffff" | "#fff59c" | "#aaf0d1" | "#b2dfdb" | "#f5f5f5", 
        backgroundColorDark: "#121212" | "#a68f00" | "#4c8c7d" | "#005c5a" | "#004d40" 
    ) => Promise<void>;
    handleDeleteNote: () => void;
    handleRedo: (event: React.MouseEvent<HTMLButtonElement>) => void;
    handleUndo: (event: React.MouseEvent<HTMLButtonElement>) => void;
    setIsBackgroundMenu: React.Dispatch<React.SetStateAction<boolean>>;
    setIsFontMenu: React.Dispatch<React.SetStateAction<boolean>>;
    setIsOptionsMenu: React.Dispatch<React.SetStateAction<boolean>>;
    toggleArchive: () => void;
    toggleDelete: () => void;
}

export default function GUIFooter({
    type,
    backgroundColor,
    contentArray,
    isArchived,
    // isDarkMode,
    isEditMode,
    isBackgroundMenuOpen,
    isHovering,
    // isFontMenuOpen,
    isOptionsMenuOpen,
    isTrash,
    initialOperation,
    backgroundMenuRef,
    backgroundMenuRefButton,
    // fontMenuRef,
    // fontMenuRefButton,
    optionsMenuRef,
    optionsMenuRefButton,
    index,
    handleBackgroundColor,
    handleDeleteNote,
    handleRedo,
    handleUndo,

    setIsBackgroundMenu,
    // setIsFontMenu,
    setIsOptionsMenu,
    toggleArchive,
    toggleDelete
}: GUIFooterProps) {

    const showFooter = isEditMode || initialOperation === 'read';
    const showFooterIcons = isEditMode || (isHovering && initialOperation === 'read') || isBackgroundMenuOpen || isOptionsMenuOpen;
    const showCloseButton = initialOperation === 'create' || isEditMode;

    return (
        <React.Fragment>
            {isTrash ?
                (<div className={styles.footerWrapper}>
                    <div className={styles.footerContainer}>
                        <div className={styles.footerLeading}>
                            {
                                showFooterIcons && (
                                    <React.Fragment>
                                        <StyledTooltip title={type === 'note' ? 'Delete note forever' : 'Delete project forever'}>
                                            <StyledIconButton aria-label="Delete note forever" onClick={() => handleDeleteNote()}>
                                                <DeleteForeverOutlined />
                                            </StyledIconButton>
                                        </StyledTooltip>
                                        <StyledIconButton aria-label="Delete note forever" onClick={() => handleDeleteNote()}>
                                            <DeleteForeverOutlined />
                                        </StyledIconButton>
                                        <StyledIconButton aria-label="Restore from trash" onClick={() => toggleDelete()}>
                                            <RestoreFromTrashOutlined />
                                        </StyledIconButton>
                                    </React.Fragment>
                                )
                            }
                        </div>
                        <StyledTooltip title={type === 'note' ? 'Note' : 'Project'}>
                            <span>
                                <StyledIconButton disabled={true}>
                                    <NoteOutlined/>
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
                                        <StyledTooltip  title={'Pin note'}>
                                            <StyledIconButton ref={backgroundMenuRefButton} className={styles.menuButton}
                                            // onClick={() => setIsBackgroundMenu(prev => !prev)}
                                            >
                                                <PushPinOutlined />
                                            </StyledIconButton>
                                        </StyledTooltip>
                                        <StyledTooltip  title={'Reminder'}>
                                            <StyledIconButton ref={backgroundMenuRefButton} className={styles.menuButton}
                                                onClick={() => setIsBackgroundMenu(prev => !prev)}>
                                                <AlarmAddOutlined />
                                            </StyledIconButton>
                                        </StyledTooltip>
                                        <div className={styles.backgroundAnchor}>

                                            {/* <StyledTooltip
                                                
                                                title={'Background options'}> */}
                                                <StyledIconButton ref={backgroundMenuRefButton} className={styles.menuButton}
                                                    onClick={() => setIsBackgroundMenu(prev => !prev)}>
                                                    <PaletteOutlined />
                                                </StyledIconButton>
                                            {/* </StyledTooltip> */}

                                            {isBackgroundMenuOpen && (
                                                <div className={styles.backgroundMenu}
                                                    ref={backgroundMenuRef}>
                                                    <BackgroundIconButton selected={backgroundColor === '#ffffff'} onClick={() => handleBackgroundColor('#ffffff','#121212')}>
                                                        <BackgroundCircle selected={backgroundColor === '#ffffff'} />
                                                    </BackgroundIconButton>
                                                    <BackgroundIconButton selected={backgroundColor === '#fff59c'} onClick={() => handleBackgroundColor('#fff59c', '#a68f00')}>
                                                        <BackgroundCircleYellow selected={backgroundColor === '#fff59c'} />
                                                    </BackgroundIconButton>
                                                    <BackgroundIconButton selected={backgroundColor === '#aaf0d1'} onClick={() => handleBackgroundColor('#aaf0d1', '#4c8c7d')}>
                                                        <BackgroundCircleMintyGreen selected={backgroundColor === '#aaf0d1'} />
                                                    </BackgroundIconButton>
                                                    <BackgroundIconButton selected={backgroundColor === '#b2dfdb'} onClick={() => handleBackgroundColor('#b2dfdb', '#005c5a')}>
                                                        <BackgroundCircleTeal selected={backgroundColor === '#b2dfdb'} />
                                                    </BackgroundIconButton> 
                                                    <BackgroundIconButton selected={backgroundColor === '#f5f5f5'} onClick={() => handleBackgroundColor('#f5f5f5', '#004d40')}>
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
                                        <div className={styles.settingsAnchor} >
                                            {/* <StyledTooltip title={'Options'} > */}
                                                <StyledIconButton ref={optionsMenuRefButton} className={styles.menuButton}
                                                    onClick={() => setIsOptionsMenu(prev => !prev)}>
                                                    <MoreVert />
                                                </StyledIconButton>
                                            {/* </StyledTooltip> */}
                                            {isOptionsMenuOpen && (
                                                <div className={styles.menu} ref={optionsMenuRef}>
                                                    <StyledNoteButton type="button" onClick={toggleDelete}>Delete</StyledNoteButton>
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
                                    <StyledTooltip title={type === 'note' ? 'Note' : 'Project'} >
                                        <span>
                                            <StyledIconButton disabled={true}>
                                                <NoteOutlined sx={{ color: 'gray' }} />
                                            </StyledIconButton>
                                        </span>
                                    </StyledTooltip>
                                )
                            }
                        </div>
                    </div>
                )
            }
        </React.Fragment>
    );
}